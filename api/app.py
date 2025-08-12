from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np

from kmc_static import kmc_static

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/survival_analysis', methods=['POST'])
def example_endpoint():

    # Get JSON data from the request
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    print(data)

    # random choice N KM curves from kmc_static.keys(), N is the number of treatments
    treatments = data["Treatments"]
    keys = list(kmc_static.keys())
    km_curves_id = np.random.choice(keys, len(treatments), replace=False)
    kmc = [kmc_static[key] for key in km_curves_id]
    
    response = {
        "Treatments": data["Treatments"],
        "KM_curves": kmc,
    }
    
    return jsonify(response), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)