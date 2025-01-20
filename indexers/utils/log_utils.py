import os
import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path

from utils.constants import LOGS_PATH, LOG_LEVEL


def create_logger(name: str, log_file: str, level=LOG_LEVEL):
    """
    Creates a logger that writes to both file and console

    Args
        name: Logger name (usually __name__)
        log_file: Name of the log file
        level: Logging level (default: logging.INFO)
    """
    base_path = Path(LOGS_PATH)
    base_path.mkdir(parents=True, exist_ok=True)

    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    file_handler = RotatingFileHandler(
        base_path / log_file,
        maxBytes=10*1024*1024,
        backupCount=5,
    )
    file_handler.setFormatter(formatter)

    logger = logging.getLogger(name)
    logger.setLevel(level)

    if not logger.handlers:
        logger.addHandler(console_handler)
        logger.addHandler(file_handler)

    return logger
