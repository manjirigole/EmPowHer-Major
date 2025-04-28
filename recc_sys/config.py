import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("empowher-two-firebase-adminsdk-wihba-e426f0fd7b.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
