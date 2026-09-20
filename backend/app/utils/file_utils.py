import os
import uuid


def get_file_extension(filename: str) -> str:
    _, ext = os.path.splitext(filename)
    return ext.lower().lstrip(".")


def generate_unique_filename(original_filename: str) -> str:
    ext = get_file_extension(original_filename) or "jpg"
    return f"{uuid.uuid4().hex}.{ext}"


def human_readable_size(num_bytes: int) -> str:
    size = float(num_bytes)
    for unit in ["B", "KB", "MB", "GB"]:
        if size < 1024:
            return f"{size:.1f}{unit}"
        size /= 1024
    return f"{size:.1f}TB"
