import re
import random
import string


def generate_username(name: str, email: str) -> str:
    base = re.sub(r"[^a-zA-Z0-9]", "", name.lower()) or email.split("@")[0].lower()
    base = re.sub(r"[^a-zA-Z0-9]", "", base)[:15]
    if not base:
        base = "user"
    suffix = "".join(random.choices(string.digits, k=4))
    return f"{base}{suffix}"
