from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS
import traceback

app = Flask(__name__)

# Enable CORS
CORS(app)

# Load the model and necessary resources
try:
    model = joblib.load('resource_prediction_model_gb.pkl')  # The model for resource prediction
    scaler = joblib.load('scaler.pkl')  # Assuming the scaler is used for input features
    label_encoders = joblib.load('label_encoders.pkl')  # Assuming you have label encoders for categorical features
    print("Model, Scaler, and Label Encoders loaded successfully.")
except Exception as e:
    print(f"Error loading model or resources: {str(e)}")
    raise e

# Endpoint for prediction
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input data from the React app
        data = request.get_json()

        # Check if the required keys are present in the input
        if not all(key in data for key in ['severity', 'disease', 'num_patients']):
            return jsonify({'error': 'Missing "severity", "disease", or "num_patients" in request data'}), 400

        # Extract features from input data
        severity = data['severity']
        disease = data['disease']
        num_patients = data['num_patients']

        # Validate num_patients (ensure it's an integer and non-negative)
        if not isinstance(num_patients, int) or num_patients < 0:
            return jsonify({'error': '"num_patients" should be a non-negative integer'}), 400

        # Process categorical features (e.g., disease) using label encoder
        try:
            disease_encoded = label_encoders["Disease"].transform([disease])[0]
            severity_encoded = label_encoders["Severity"].transform([severity])[0]
        except KeyError as e:
            return jsonify({'error': f"Invalid value for {str(e)} in the input data"}), 400

        # Prepare the feature vector (assuming all features are required for prediction)
        features = np.array([severity_encoded, disease_encoded, num_patients]).reshape(1, -1)

        # Scale the features
        try:
            scaled_features = scaler.transform(features)
        except Exception as e:
            return jsonify({'error': f"Error during feature scaling: {str(e)}"}), 500

        # Predict using the loaded model
        try:
            prediction = model.predict(scaled_features)
        except Exception as e:
            return jsonify({'error': f"Error during prediction: {str(e)}"}), 500

        # Extract the predicted resource requirements
        num_beds, num_doctors, num_ppe_kits, num_ventilators = prediction[0]

        # Return the prediction as a JSON response
        return jsonify({
            'Num Beds': num_beds,
            'Num Doctors': num_doctors,
            'Num PPE Kits': num_ppe_kits,
            'Num Ventilators': num_ventilators
        })

    except Exception as e:
        # Print the traceback for debugging
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)  # Set debug=True for better error output during development
