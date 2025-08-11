from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/survival_analysis', methods=['POST'])
def example_endpoint():

    # Get JSON data from the request
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    print(data)
    
    response = {
        "survivalRate": np.random.randint(0, 100),  # Simulate a survival rate
    }
    
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)