from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline

model_path = "./emotion-model/content/emotion-model/"  # Ensure this points to the correct path

# Load model and tokenizer
model = AutoModelForSequenceClassification.from_pretrained(model_path)
tokenizer = AutoTokenizer.from_pretrained(model_path)

# Create the pipeline
emotion_classifier = pipeline("text-classification", model=model, tokenizer=tokenizer)

# Test with a sample text
text = "eww"
print(emotion_classifier(text))
