from app.security.r2_config import get_r2_client, CLOUDFLARE_BUCKET_NAME_1
from fastapi import UploadFile
from typing import List, Dict
from dotenv import load_dotenv
import uuid
import os
import re

load_dotenv()
client = get_r2_client()
CLOUDFLARE_ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
R2_PUBLIC_URL = os.getenv("R2_PUBLIC_URL")


async def upload_product_images(
    files: List[UploadFile], bucket: str, folder: str = "products"
) -> List[Dict]:
    client = get_r2_client()
    uploaded = []
    for idx, file in enumerate(files):
        if not file.filename:
            continue
        contents = await file.read()
        if not contents:
            continue
        original_name = file.filename
        ext = (
            original_name.rsplit(".", 1)[-1].lower() if "." in original_name else "jpg"
        )
        clean_name = re.sub(r"[^\w\-_.]", "-", original_name.lower())
        clean_name = re.sub(r"-+", "-", clean_name)
        clean_name = clean_name.strip("-_.")
        clean_name = clean_name or f"image-{idx + 1}"
        unique_suffix = uuid.uuid4().hex[:8]
        final_filename = f"{clean_name}-{unique_suffix}.{ext}"
        key = f"{folder}/{final_filename}"
        client.put_object(
            Bucket=bucket,
            Key=key,
            Body=contents,
            ContentType=file.content_type or "image/jpeg",
        )
        public_url = f"{R2_PUBLIC_URL}/{key}"
        uploaded.append(
            {
                "image_url": public_url,
                "filename": final_filename,
            }
        )

    return uploaded


def delete_image_from_r2(key: str):
    client = get_r2_client()
    client.delete_object(Bucket=CLOUDFLARE_BUCKET_NAME_1, Key=key)


def extract_r2_key(url: str) -> str:
    return url.replace(f"{R2_PUBLIC_URL}/", "")
