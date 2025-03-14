import os
import boto3
import botocore
from pathlib import Path
from typing import Dict, List, Optional, Any
import glob

class S3Operations:
    """Handles all S3 bucket operations for Synthetix data extraction with optimized sync"""
    
    def __init__(self):
        """Initialize the S3Operations object, setting up credentials"""
        # Get S3 bucket name from environment variable
        self.bucket_name = os.getenv('S3_BUCKET_NAME')
        if not self.bucket_name:
            print("WARNING: S3_BUCKET_NAME environment variable not set")
        
        # AWS credentials - clean any quotes that might be in the environment variables
        aws_access_key = os.getenv('AWS_ACCESS_KEY_ID', '')
        aws_secret_key = os.getenv('AWS_SECRET_ACCESS_KEY', '')
        if aws_secret_key and (aws_secret_key.startswith("'") and aws_secret_key.endswith("'") or 
                              aws_secret_key.startswith('"') and aws_secret_key.endswith('"')):
            aws_secret_key = aws_secret_key[1:-1]
        
        # Get the AWS region
        aws_region = os.getenv('AWS_REGION', 'us-east-1')
        
        try:
            # Create S3 client
            self.s3 = boto3.client(
                's3',
                aws_access_key_id=aws_access_key,
                aws_secret_access_key=aws_secret_key,
                region_name=aws_region
            )
            print(f"S3 client initialized with region {aws_region}")
        except Exception as e:
            print(f"Error initializing S3 client: {e}")
            self.s3 = None
            
    def check_data_exists(self, network_name: str, function_name: Optional[str] = None) -> bool:
        """Check if data exists in S3 bucket for the given network and function"""
        if not self.s3 or not self.bucket_name:
            return False
            
        # Determine the prefix to check
        file_name = "blocks" if function_name is None else function_name
        
        # First check if the clean data exists
        s3_clean_key = f"data/{network_name}/{file_name}.parquet"
        
        try:
            self.s3.head_object(Bucket=self.bucket_name, Key=s3_clean_key)
            return True
        except botocore.exceptions.ClientError as e:
            if e.response['Error']['Code'] == '404':
                return False
            else:
                raise
    
    def download_clean_data(self, network_name: str, function_name: Optional[str] = None, 
                           base_dir: str = "/parquet-data") -> bool:
        """Download only the clean parquet file - much faster than full sync"""
        if not self.s3 or not self.bucket_name:
            return False
            
        # Determine the file name and paths
        file_name = "blocks" if function_name is None else function_name
        
        # Local paths
        clean_dir = f"{base_dir}/clean/{network_name}"
        clean_path = f"{clean_dir}/{file_name}.parquet"
        
        # S3 key for clean data
        s3_clean_key = f"data/{network_name}/{file_name}.parquet"
        
        try:
            # Create directory
            Path(clean_dir).mkdir(parents=True, exist_ok=True)
            
            # Download clean data (parquet file)
            print(f"Downloading clean data from s3://{self.bucket_name}/{s3_clean_key}")
            self.s3.download_file(self.bucket_name, s3_clean_key, clean_path)
            print(f"Successfully downloaded {clean_path}")
            return True
                
        except botocore.exceptions.ClientError as e:
            if e.response['Error']['Code'] == '404':
                print(f"Clean data file not found in S3: {s3_clean_key}")
                return False
            else:
                raise
        except Exception as e:
            print(f"Error downloading clean data: {e}")
            return False
    
    def upload_clean_data(self, network_name: str, function_name: Optional[str] = None, 
                         base_dir: str = "/parquet-data") -> bool:
        """Upload only the clean parquet file - much faster than full sync"""
        if not self.s3 or not self.bucket_name:
            return False
            
        # Determine the file name and paths
        file_name = "blocks" if function_name is None else function_name
        
        # Local paths
        clean_path = f"{base_dir}/clean/{network_name}/{file_name}.parquet"
        
        # Check if file exists
        if not os.path.exists(clean_path):
            print(f"Clean parquet file does not exist: {clean_path}")
            return False
        
        try:
            # Upload clean data (parquet file)
            s3_clean_key = f"data/{network_name}/{file_name}.parquet"
            print(f"Uploading {clean_path} to s3://{self.bucket_name}/{s3_clean_key}")
            self.s3.upload_file(clean_path, self.bucket_name, s3_clean_key)
            print(f"Successfully uploaded {clean_path}")
            return True
            
        except Exception as e:
            print(f"Error uploading clean data: {e}")
            return False
    
    def upload_raw_data(self, network_name: str, function_name: Optional[str] = None, 
                       base_dir: str = "/parquet-data") -> bool:
        """Upload raw data files including hidden directories"""
        if not self.s3 or not self.bucket_name:
            return False
            
        # Determine the file name and paths
        file_name = "blocks" if function_name is None else function_name
        
        # Local path
        raw_dir = f"{base_dir}/raw/{network_name}/{file_name}"
        
        # Check if path exists
        if not os.path.exists(raw_dir):
            print(f"Raw directory does not exist: {raw_dir}")
            return False
        
        try:
            print(f"Uploading raw data from {raw_dir} to S3")
            
            # Use os.walk with includeHidden parameter
            for root, dirs, files in os.walk(raw_dir):
                # Process all files in this directory
                for filename in files:
                    local_path = os.path.join(root, filename)
                    # Get relative path from raw_dir
                    rel_path = os.path.relpath(local_path, raw_dir)
                    # Convert Windows paths to Unix style for S3
                    rel_path = rel_path.replace('\\', '/')
                    s3_key = f"data/{network_name}/{file_name}/raw/{rel_path}"
                    
                    # Upload file
                    print(f"Uploading {local_path} to s3://{self.bucket_name}/{s3_key}")
                    self.s3.upload_file(local_path, self.bucket_name, s3_key)
                
                # Process hidden directories
                hidden_dirs = [d for d in dirs if d.startswith('.')]
                for hidden_dir in hidden_dirs:
                    hidden_dir_path = os.path.join(root, hidden_dir)
                    for hidden_root, hidden_subdirs, hidden_files in os.walk(hidden_dir_path):
                        for hidden_file in hidden_files:
                            local_path = os.path.join(hidden_root, hidden_file)
                            rel_path = os.path.relpath(local_path, raw_dir)
                            rel_path = rel_path.replace('\\', '/')
                            s3_key = f"data/{network_name}/{file_name}/raw/{rel_path}"
                            
                            # Upload file
                            print(f"Uploading hidden file {local_path} to s3://{self.bucket_name}/{s3_key}")
                            self.s3.upload_file(local_path, self.bucket_name, s3_key)
            
            return True
            
        except Exception as e:
            print(f"Error uploading raw data: {e}")
            return False
    
    def _list_objects(self, prefix: str) -> List[Dict[str, Any]]:
        """List all objects in S3 bucket with the given prefix"""
        try:
            objects = []
            paginator = self.s3.get_paginator('list_objects_v2')
            pages = paginator.paginate(
                Bucket=self.bucket_name,
                Prefix=prefix
            )
            
            for page in pages:
                if 'Contents' in page:
                    objects.extend(page['Contents'])
            
            return objects
        except Exception as e:
            print(f"Error listing objects in S3: {e}")
            return []