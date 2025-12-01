from google_auth_oauthlib.flow import InstalledAppFlow
import pickle
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CREDENTIALS_PATH = os.path.abspath(os.path.join(BASE_DIR, "../key/credentials.json"))

SCOPES = ["https://mail.google.com/"]

flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_PATH, SCOPES)
creds = flow.run_local_server(port=0)

with open("token.pickle", "wb") as token_file:
    pickle.dump(creds, token_file)
