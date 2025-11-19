# generate_token.py
from google_auth_oauthlib.flow import InstalledAppFlow
import pickle

SCOPES = ['https://www.googleapis.com/auth/gmail.send']

flow = InstalledAppFlow.from_client_secrets_file(
    'credentials.json', SCOPES
)
creds = flow.run_local_server(port=0)

# Save token for later use
with open('token.pickle', 'wb') as token_file:
    pickle.dump(creds, token_file)

print("Token saved as token.pickle")
