import os
import time
import shutil
from pathlib import Path
from datetime import datetime, timedelta

def cleanup_old_data(
    base_dirs: list = ["/parquet-data", "/home/src/parquet-data", "../parquet-data", "./parquet-data"],
    max_age_days: int = 1,
    networks: list = None,
    dry_run: bool = False
) -> dict:
    """
    Delete blockchain data older than the specified age (default: 1 day)
    
    Args:
        base_dirs: List of base directories to check for storage
        max_age_days: Maximum age of data in days before deletion
        networks: Optional list of networks to clean up (None = all networks)
        dry_run: If True, only report what would be deleted without actually deleting
    
    Returns:
        Dictionary with statistics about deleted files and freed space
    """
    # Calculate the cutoff timestamp
    cutoff_time = time.time() - (max_age_days * 86400)  # 86400 seconds in a day
    
    # Get all available networks if none specified
    if networks is None:
        networks = list_networks()
    
    # Statistics to return
    stats = {
        "deleted_files": 0,
        "deleted_dirs": 0,
        "bytes_freed": 0,
        "networks_cleaned": set(),
        "errors": []
    }

    # Search for valid base directories
    valid_base_dirs = []
    for base_dir in base_dirs:
        base_path = Path(base_dir)
        if base_path.exists() and base_path.is_dir():
            valid_base_dirs.append(base_path)
    
    if not valid_base_dirs:
        raise ValueError(f"None of the specified base directories exist: {base_dirs}")
    
    # Process each valid base directory
    for base_path in valid_base_dirs:
        # Check both raw and clean directories
        for data_type in ["raw", "clean"]:
            data_path = base_path / data_type
            
            if not data_path.exists():
                continue
                
            # Process each network directory
            for network_dir in data_path.glob("*"):
                if not network_dir.is_dir():
                    continue
                    
                network_name = network_dir.name
                
                # Skip if not in the specified networks list
                if network_name not in networks:
                    continue
                
                # Process each function directory or file
                for item in network_dir.glob("*"):
                    try:
                        # Get the modification time
                        mtime = item.stat().st_mtime
                        
                        # Check if older than cutoff
                        if mtime < cutoff_time:
                            # Calculate size for statistics
                            if item.is_dir():
                                size = sum(f.stat().st_size for f in item.glob('**/*') if f.is_file())
                            else:
                                size = item.stat().st_size
                                
                            # Delete the item if not a dry run
                            if not dry_run:
                                if item.is_dir():
                                    shutil.rmtree(item)
                                    stats["deleted_dirs"] += 1
                                else:
                                    os.remove(item)
                                    stats["deleted_files"] += 1
                            else:
                                # Just log for dry run
                                if item.is_dir():
                                    stats["deleted_dirs"] += 1
                                else:
                                    stats["deleted_files"] += 1
                                    
                            # Update statistics
                            stats["bytes_freed"] += size
                            stats["networks_cleaned"].add(network_name)
                    except Exception as e:
                        stats["errors"].append(f"Error processing {item}: {str(e)}")
    
    # Convert set to list for easier serialization
    stats["networks_cleaned"] = list(stats["networks_cleaned"])
    
    # Format the bytes freed for human readability
    human_readable = bytes_to_human_readable(stats["bytes_freed"])
    stats["human_readable_freed"] = human_readable
    
    # For dry run, add a note
    if dry_run:
        stats["note"] = "This was a dry run. No files were actually deleted."
    
    return stats

def bytes_to_human_readable(bytes_size: int) -> str:
    """Convert bytes to human-readable format"""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if bytes_size < 1024 or unit == 'TB':
            return f"{bytes_size:.2f} {unit}"
        bytes_size /= 1024