import os
import logging
from fastapi import HTTPException, status
from dotenv import load_dotenv
from email.mime.text import MIMEText
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import base64
import pickle 
# from sendgrid import SendGridAPIClient
# from sendgrid.helpers.mail import Mail

logger = logging.getLogger(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TOKEN_PATH = os.path.join(BASE_DIR, '../key/token.pickle')
TOKEN_PATH = os.path.abspath(TOKEN_PATH)
load_dotenv()

def send_mail(to_email: str, subject: str, html: str):
    with open(TOKEN_PATH, "rb") as token_file:
        creds = pickle.load(token_file)
    service = build("gmail", "v1", credentials=creds)
    msg = MIMEText(html, "html")
    msg["to"] = to_email
    msg["from"] = "no-reply@nickopusan.dev"
    msg["subject"] = subject
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    return service.users().messages().send(
        userId="me",
        body={"raw": raw}
    ).execute()


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