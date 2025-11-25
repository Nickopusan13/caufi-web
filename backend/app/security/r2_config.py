import os
from boto3 import client
from botocore.config import Config
from dotenv import load_dotenv

load_dotenv()

CLOUDFLARE_ACCESS_KEY_ID = os.getenv("CLOUDFLARE_ACCESS_KEY_ID")
CLOUDFLARE_SECRET_ACCESS_KEY = os.getenv("CLOUDFLARE_SECRET_ACCESS_KEY")
CLOUDFLARE_ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
CLOUDFLARE_BUCKET_NAME_1 = os.getenv("CLOUDFLARE_BUCKET_NAME_1")
CLOUDFLARE_BUCKET_NAME_2 = os.getenv("CLOUDFLARE_BUCKET_NAME_2")
S3_ENDPOINT = f"https://{CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com"

_r2_client = None


def get_r2_client():
    global _r2_client
    if _r2_client is None:
        _r2_client = client(
            "s3",
            aws_access_key_id=CLOUDFLARE_ACCESS_KEY_ID,
            aws_secret_access_key=CLOUDFLARE_SECRET_ACCESS_KEY,
            endpoint_url=S3_ENDPOINT,
            config=Config(signature_version="s3v4"),
        )
    return _r2_client
