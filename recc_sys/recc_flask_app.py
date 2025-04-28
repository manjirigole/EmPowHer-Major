import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize Firestore
cred = credentials.Certificate("empowher-two-firebase-adminsdk-wihba-e426f0fd7b.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        print("Received request data:", data)

        if not data or "user_id" not in data:
            return jsonify({"error": "User ID is required"}), 400

        user_id = data["user_id"]
        print(f"✅ Fetching symptoms for user: {user_id}")

        # Step 1: Fetch symptoms from Firestore
        symptoms_ref = db.collection("symptoms").document(user_id)
        keywords = {"behavioral": [], "physical": [], "emotional": []}

        for category in keywords.keys():
            category_ref = symptoms_ref.collection(category).stream()
            for doc in category_ref:
                symptoms_data = doc.to_dict()
                if "symptom" in symptoms_data:
                    keywords[category].append(symptoms_data["symptom"].lower())

        print("Extracted keywords by category:", keywords)

        # Step 2: Fetch blogs and match with symptoms
        blog_ref = db.collection("blogs")
        blogs = blog_ref.stream()

        matched_blogs = {"behavioral": [], "physical": [], "emotional": []}

        for blog in blogs:
            blog_data = blog.to_dict()
            tags = [tag.lower() for tag in blog_data.get("tags", [])]

            for category, symptoms in keywords.items():
                if any(tag in symptoms for tag in tags):
                    matched_blogs[category].append(blog_data)
                    break  # Stop checking after the first match

        # Step 3: Select top 3 unique blogs per category
        recommendations = []
        for category, blog_list in matched_blogs.items():
            unique_blogs = list({blog["title"]: blog for blog in blog_list}.values())
            recommendations.extend(unique_blogs[:5])  # Pick top 10

        print("✅ Final Recommendations:", recommendations)

        return jsonify({"recommendations": recommendations}), 200

    except Exception as e:
        print("❌ Server Error:", str(e))
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
