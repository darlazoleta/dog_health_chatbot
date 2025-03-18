from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from cohere import Client
from dotenv import load_dotenv
import os
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Cohere Client
co = Client(os.getenv('COHERE_API_KEY'))

# Store conversation context
user_context = {}

def classify_text(question):
    try:
        response = co.classify(model=os.getenv('MODEL_ID'), inputs=[
            question])
        return response.classifications[0].prediction
    except Exception as e:
        print(f"Classification Error: {e}")
        return None

def is_irrelevant(question):
    irrelevant_animals = ["cat", "rabbit", "bird", "hamster", "fish", "turtle", "parrot", "guinea pig", "ferret", "lizard", "snake", "mouse", "rat", "chinchilla", "horse", "goat", "sheep", "pig", "cow", "duck", "chicken", "frog", "gecko", "hedgehog", "alpaca"]
    return any(animal in question.lower() for animal in irrelevant_animals)

@app.route("/chat", methods=["POST"])
def chat_stream():
    data = request.get_json()
    user_message = data.get("message", "").strip()
    user_id = data.get("user_id", "default")
    
    if not user_message:
        return jsonify({"response": "Please enter a valid message."})

    if is_irrelevant(user_message):
        return jsonify({"response": "I can only assist with dog issues/concerns."})
    
    greetings = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"]
    polite_responses = ["thank you", "thanks", "alright", "okay"]
    
    if any(word in user_message.lower() for word in greetings):
        return jsonify({"response": "Hello! How can I assist you with your dog's concerns?"})
    elif any(word in user_message.lower() for word in polite_responses):
        return jsonify({"response": "You're welcome! Let me know if you need any help with your dog."})

    try:
        stream = co.chat_stream(
            message=user_message,
            model="command"
        )
        
        def generate():
            try:
                for event in stream:
                    if hasattr(event, 'text') and event.text:
                        yield f"data: {json.dumps({'chunk': event.text})}\n\n"
            except Exception as e:
                print(f"Stream Error: {str(e)}")
                yield f"data: {json.dumps({'error': str(e)})}\n\n"

        return Response(generate(), mimetype='text/event-stream')
                
    except Exception as e:
        print(f"Chatbot API Error: {str(e)}")
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)

