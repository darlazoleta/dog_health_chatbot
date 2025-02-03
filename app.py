
from flask import Flask, request, jsonify
import requests
import json
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define the Cohere API endpoint and your API key
api_key = 'tvIZ363Cg95OtTsniNW9YoglrZ6ApbdHwpalpsdT'  # Replace with your actual Cohere API key
url = "https://api.cohere.ai/v1/generate"

def chat_with_cohere(prompt):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"  # Use the correct API key here
    }

    data = {
        "prompt": prompt,
        "max_tokens": 300,  # Adjust the token limit as needed
    }

    try:
        # Send the request to Cohere API
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()  # Will raise an HTTPError for bad responses
        
        # If the response is successful, extract and return the response
        response_data = response.json()
        print("Response Data:", json.dumps(response_data, indent=2))  # For debugging

        # Extract the correct response text from the 'generations' field
        return response_data['generations'][0]['text']  # Adjusted to the correct field

    except requests.exceptions.RequestException as e:
        # Handle errors and return a message
        print(f"Request failed: {e}")
        return f"Request failed: {e}"

@app.route('/chat', methods=['POST'])
def chat():
    try:
        # Get the user's message from the request
        user_message = request.json.get('message', '')

        # Call the function to get the Cohere API response
        response_message = chat_with_cohere(user_message)

        # Return the response back to the frontend
        return jsonify({'response': response_message})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
