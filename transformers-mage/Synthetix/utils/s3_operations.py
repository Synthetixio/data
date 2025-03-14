import os
import boto3
from pathlib import Path
from typing import List, Optional, Dict
import logging

logger = logging.getLogger(__name__)

class S3Operations:
    def __init__(self):
        """Initialize S3 client with credentials from environment"""
        self.s3_bucket = os.getenv("S3_BUCKET_NAME")
        
        if not self.s3_bucket:
            raise ValueError("S3_BUCKET_NAME environment variable is not set")
            
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID", ''),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY", '').replace("'", "").replace('"', ''),
            region_name=os.getenv("AWS_REGION", "us-east-1")
        )
        
    def _get_s3_prefix(self, network_name: str, function_name: Optional[str] = None) -> str:
        """Get the S3 prefix for a given network and function"""
        if function_name is None or function_name.lower() == "blocks":
            return f"data/{network_name}/blocks/"
        else:
            return f"data/{network_name}/{function_name}/"
            
    def check_data_exists(self, network_name: str, function_name: Optional[str] = None) -> bool:
        """
        Check if data for the specified network and function exists in S3
        
        Args:
            network_name: Name of the network (e.g., 'eth_mainnet')
            function_name: Name of the function (e.g., 'getVaultCollateral') or None for blocks
            
        Returns:
            True if data exists in S3, False otherwise
        """
        prefix = self._get_s3_prefix(network_name, function_name)
        file_name = "blocks.parquet" if function_name is None or function_name.lower() == "blocks" else f"{function_name}.parquet"
        s3_key = f"{prefix}clean/{file_name}"
        
        try:
            self.s3_client.head_object(Bucket=self.s3_bucket, Key=s3_key)
            return True
        except Exception:
            # Check if raw data exists
            try:
                # List objects with the prefix to see if there are any raw files
                response = self.s3_client.list_objects_v2(
                    Bucket=self.s3_bucket,
                    Prefix=f"{prefix}raw/",
                    MaxKeys=1
                )
                return 'Contents' in response and len(response['Contents']) > 0
            except Exception:
                return False
                
    def download_data(self, network_name: str, function_name: Optional[str] = None, 
                     local_base_dir: str = "./parquet-data") -> Dict[str, str]:
        """
        Download data from S3 for the specified network and function
        
        Args:
            network_name: Name of the network
            function_name: Name of the function or None for blocks
            local_base_dir: Base directory for storing the downloaded data
            
        Returns:
            Dictionary with paths to the downloaded data
        """
        file_name = "blocks" if function_name is None or function_name.lower() == "blocks" else function_name
        prefix = self._get_s3_prefix(network_name, function_name)
        
        # Local paths
        raw_dir = f"{local_base_dir}/raw/{network_name}/{file_name}"
        clean_dir = f"{local_base_dir}/clean/{network_name}"
        clean_path = f"{clean_dir}/{file_name}.parquet"
        
        # Create directories if they don't exist
        Path(raw_dir).mkdir(parents=True, exist_ok=True)
        Path(clean_dir).mkdir(parents=True, exist_ok=True)
        
        # Download clean data if it exists
        clean_s3_key = f"{prefix}clean/{file_name}.parquet"
        try:
            self.s3_client.download_file(
                Bucket=self.s3_bucket,
                Key=clean_s3_key,
                Filename=clean_path
            )
            print(f"Downloaded clean data from S3: {clean_s3_key} to {clean_path}")
            
            # If clean data exists, we don't need to download raw data
            return {
                "base_dir": local_base_dir,
                "raw_dir": raw_dir,
                "clean_path": clean_path
            }
        except Exception as e:
            print(f"Clean data not found in S3: {e}")
            
        # Download raw data
        try:
            # List all raw files
            paginator = self.s3_client.get_paginator('list_objects_v2')
            pages = paginator.paginate(
                Bucket=self.s3_bucket,
                Prefix=f"{prefix}raw/"
            )
            
            # Download each file
            download_count = 0
            for page in pages:
                if 'Contents' in page:
                    for obj in page['Contents']:
                        s3_key = obj['Key']
                        file_name = os.path.basename(s3_key)
                        local_file = f"{raw_dir}/{file_name}"
                        
                        self.s3_client.download_file(
                            Bucket=self.s3_bucket,
                            Key=s3_key,
                            Filename=local_file
                        )
                        download_count += 1
                        
            if download_count > 0:
                print(f"Downloaded {download_count} raw files from S3 to {raw_dir}")
                return {
                    "base_dir": local_base_dir,
                    "raw_dir": raw_dir,
                    "clean_path": clean_path
                }
            else:
                print(f"No raw data found in S3")
                return None
        except Exception as e:
            print(f"Failed to download raw data: {e}")
            return None
            
    def upload_data(self, network_name: str, function_name: Optional[str] = None,
                   local_base_dir: str = "./parquet-data") -> bool:
        """
        Upload data to S3 for the specified network and function
        
        Args:
            network_name: Name of the network
            function_name: Name of the function or None for blocks
            local_base_dir: Base directory with the data to upload
            
        Returns:
            True if upload was successful, False otherwise
        """
        file_name = "blocks" if function_name is None or function_name.lower() == "blocks" else function_name
        prefix = self._get_s3_prefix(network_name, function_name)
        
        # Local paths
        raw_dir = f"{local_base_dir}/raw/{network_name}/{file_name}"
        clean_path = f"{local_base_dir}/clean/{network_name}/{file_name}.parquet"
        
        success = True
        
        # Upload clean data if it exists
        if os.path.exists(clean_path):
            clean_s3_key = f"{prefix}clean/{file_name}.parquet"
            try:
                self.s3_client.upload_file(
                    Filename=clean_path,
                    Bucket=self.s3_bucket,
                    Key=clean_s3_key
                )
                print(f"Uploaded clean data to S3: {clean_path} to {clean_s3_key}")
            except Exception as e:
                print(f"Failed to upload clean data: {e}")
                success = False
                
        # Upload raw data
        if os.path.exists(raw_dir):
            try:
                # Get all files in the raw directory
                raw_files = list(Path(raw_dir).glob("*.parquet"))
                
                # Upload each file
                for file_path in raw_files:
                    file_name = file_path.name
                    s3_key = f"{prefix}raw/{file_name}"
                    
                    self.s3_client.upload_file(
                        Filename=str(file_path),
                        Bucket=self.s3_bucket,
                        Key=s3_key
                    )
                    
                print(f"Uploaded {len(raw_files)} raw files to S3")
            except Exception as e:
                print(f"Failed to upload raw data: {e}")
                success = False
                
        return success