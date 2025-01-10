from pathlib import Path
import re


def to_snake(string):
    """
    Convert a given string to snake_case.
    Handles PascalCase, camelCase, mixed case, and constant-style case.
    """
    # Add underscores before uppercase letters not preceded by another uppercase or the start
    string = re.sub(r'(?<!^)(?<![A-Z])([A-Z])', r'_\1', string)
    # Handle sequences of uppercase letters followed by lowercase letters
    string = re.sub(r'([A-Z]+)([A-Z][a-z])', r'\1_\2', string)
    # Convert the string to lowercase and replace multiple underscores with a single underscore
    string = string.lower().replace("__", "_")
    return string


def get_event_list_from_file_names(root: str, network: str, data_path: str) -> set[str]:
    event_list = set()
    path = Path(data_path).rglob("*.parquet")
    for parquet_file in path:
        event_name = parquet_file.stem
        event_list.add(event_name)
    print(f"Found {len(event_list)} events for {network}")
    return event_list
