from flask import Flask, request, jsonify
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model and tokenizer
model_path = "./emotion-model/content/emotion-model/"
model = AutoModelForSequenceClassification.from_pretrained(model_path)
tokenizer = AutoTokenizer.from_pretrained(model_path)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to the Sentiment Analysis API!"})

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)

    predicted_label_index = torch.argmax(outputs.logits, dim=1).item()
    predicted_label = model.config.id2label[predicted_label_index]
    confidence_scores = torch.softmax(outputs.logits, dim=-1)[0].tolist()
    confidence = confidence_scores[predicted_label_index]

    return jsonify({"sentiment": predicted_label, "confidence": confidence})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)