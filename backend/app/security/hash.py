from passlib.context import CryptContext
import hashlib

# Prefer a modern scheme for new hashes. Keep bcrypt and bcrypt_sha256
# available so older hashes can still be verified. bcrypt has a known
# 72-byte password length limit which raises a ValueError when passed
# a longer secret; we catch that during verify and return False so the
# application can respond with a user-friendly error instead of 500.
pwd_context = CryptContext(
    schemes=["argon2", "bcrypt_sha256", "bcrypt"], deprecated="auto"
)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hash_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password, hash_password)
    except ValueError as exc:
        # Passlib bcrypt handler raises ValueError for passwords longer
        # than 72 bytes. Treat as verification failure rather than
        # propagating an internal server error.
        msg = str(exc).lower()
        if "longer than" in msg and "72" in msg:
            return False
        raise


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()
