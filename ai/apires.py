from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)

# Load model, scaler, OneHotEncoder, and training features
model = joblib.load("resource_prediction_model_gb.pkl")
scaler = joblib.load("scaler.pkl")
ohe = joblib.load("ohe.pkl")

# Define the feature columns manually (same as in the training process)
feature_columns = ["Patient_Count", "Severity_Score"] + list(ohe.get_feature_names_out(["Disease"]))

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from the request
        data = request.get_json()

        # Extract data fields
        disease_name = data['disease']
        num_patients = data['patients']
        severity = data['severity']

        if disease_name not in ["Covid", "Stroke", "Sepsis", "Pneumonia", "Severe_Trauma", "Heart_Failure"]:
            return jsonify({"error": "Invalid disease name"}), 400

        if not (1 <= severity <= 5):
            return jsonify({"error": "Severity must be between 1 and 5"}), 400

        # One-Hot Encode input disease
        disease_encoded = ohe.transform([[disease_name]])
        disease_df = pd.DataFrame(disease_encoded, columns=ohe.get_feature_names_out(["Disease"]))

        # Prepare input data
        input_data = pd.DataFrame({"Patient_Count": [num_patients], "Severity_Score": [severity]})
        input_data = pd.concat([input_data, disease_df], axis=1)

        # Ensure input matches training features
        missing_cols = set(feature_columns) - set(input_data.columns)
        for col in missing_cols:
            input_data[col] = 0
        input_data = input_data[feature_columns]  # Reorder columns to match training data

        # Scale input data
        input_scaled = scaler.transform(input_data)

        # Predict resource needs
        predicted_resources = model.predict(input_scaled)
        resource_names = ["PPEkits", "Beds", "Doctors", "Ventilator", "Oxygen Cylinder"]
        resource_dict = dict(zip(resource_names, predicted_resources[0]))

        return jsonify(resource_dict)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
