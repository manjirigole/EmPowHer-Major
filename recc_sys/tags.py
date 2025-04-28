import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
cred = credentials.Certificate("empowher-two-firebase-adminsdk-wihba-e426f0fd7b.json")
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# Fetch all blogs from Firestore
blog_ref = db.collection("blogs")
blogs = blog_ref.stream()

# Set to store unique tags
all_tags = set()

# Loop through all the blogs and extract the tags
for blog in blogs:
    blog_data = blog.to_dict()
    tags = blog_data.get("tags", [])
    
    # Add each tag to the set (set avoids duplicates)
    all_tags.update(tags)

# Convert the set of tags to a sorted list
all_tags_list = sorted(list(all_tags))

# Print all unique tags
print("Unique Tags across all blogs:")
for tag in all_tags_list:
    print(tag)
