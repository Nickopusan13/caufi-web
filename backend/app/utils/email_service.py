import os
import logging
from dotenv import load_dotenv
from email.mime.text import MIMEText
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from dotenv import load_dotenv
import base64
import pickle
# from sendgrid import SendGridAPIClient
# from sendgrid.helpers.mail import Mail

load_dotenv()
TOKEN_PATH = os.getenv("TOKEN_PATH")
CREDENTIALS_PATH = os.getenv("CREDENTIALS_PATH")
logger = logging.getLogger(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv()

def gmail_credentials():
    try:
        with open(TOKEN_PATH, "rb") as token_file:
            creds = pickle.load(token_file)
        if creds.expired and creds.refresh_token:
            creds.refresh(Request())
        return creds
    except Exception as e:
        logger.exception("Failed to load Gmail credentials: %s", e)
        raise

def send_mail(to_email: str, subject: str, html: str):
    creds = gmail_credentials()
    service = build("gmail", "v1", credentials=creds)
    msg = MIMEText(html, "html")
    msg["to"] = to_email
    msg["from"] = "no-reply@nickopusan.dev"
    msg["subject"] = subject
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    return service.users().messages().send(userId="me", body={"raw": raw}).execute()


# SENDGRID
# def send_mail(to_email: str, subject: str, html: str):
#     message = Mail(
#         from_email="no-reply@nickopusan.dev",
#         to_emails=to_email,
#         subject=subject,
#         html_content=html
#     )
#     api_key = os.getenv('SG_API_KEY')
#     print(message)
#     print(f"'{api_key}'")
#     try:
#         sg = SendGridAPIClient(os.getenv('SG_API_KEY'))
#         response = sg.send(message)
#         return response.status_code
#     except Exception as e:
#         logger.exception("Error sending email: %s", e)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Error sending email."
#         )
