# generate_token.py
from google_auth_oauthlib.flow import InstalledAppFlow
import pickle
import os

# Fix 1: Correct path to your credentials file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))           # current script folder
CREDENTIALS_PATH = os.path.abspath(os.path.join(BASE_DIR, "../key/credentials.json"))

if not os.path.exists(CREDENTIALS_PATH):
    print(f"ERROR: cred.json not found!")
    print(f"Looked here: {CREDENTIALS_PATH}")
    exit(1)

print(f"Found credentials: {CREDENTIALS_PATH}")

# Fix 2: Use the correct scope (this one actually works for sending emails)
SCOPES = ["https://mail.google.com/"]

# Fix 3: Point to the real file
flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_PATH, SCOPES)
creds = flow.run_local_server(port=0)

# Save token (optional)
with open("token.pickle", "wb") as token_file:
    pickle.dump(creds, token_file)

# MOST IMPORTANT: Print the refresh token so you can copy it!
print("\nSUCCESS! New token generated")
print("Copy this line into your .env file:\n")
print(f"GOOGLE_REFRESH_TOKEN={creds.refresh_token}")
print("\nDone! Your forgot password email will work now")