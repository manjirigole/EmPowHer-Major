import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("GOOGLE_APPLICATION_CREDENTIALS"")
firebase_admin.initialize_app(cred)

db = firestore.client()
