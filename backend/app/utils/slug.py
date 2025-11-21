from slugify import slugify
from datetime import datetime, timezone
import uuid

def get_slug(name: str) -> str:
    base_slug = slugify(name)
    return f"{base_slug}-{int(datetime.now(timezone.utc).timestamp())}"

def get_sku():
    return uuid.uuid4().hex[:12].upper()