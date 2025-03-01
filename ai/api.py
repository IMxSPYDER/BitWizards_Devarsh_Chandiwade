from flask import Flask, request, jsonify
import tensorflow as tf
import joblib
import numpy as np
from flask_ngrok import run_with_ngrok  # Use flask_ngrok for tunneling
from flask_cors import CORS


app = Flask(__name__)

# Enable ngrok for tunneling
# run_with_ngrok(app)
CORS(app)

# Load the model, scaler, and label encoders
model = tf.keras.models.load_model('multi_output_model.h5')
scaler = joblib.load('scaler.pkl')
label_encoders = joblib.load('label_encoders.pkl')  # This should be a dictionary of label encoders

# Endpoint for prediction
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input data from the React app
        data = request.get_json()

        # Check if the features key exists
        if 'features' not in data:
            return jsonify({'error': 'Missing "features" in request data'}), 400

        # Assuming the input data is a list of features (adjust as per your model's input structure)
        features = np.array(data['features']).reshape(1, -1)

        # Scale the features using the loaded scaler
        scaled_features = scaler.transform(features)

        # Predict using the loaded model
        prediction = model.predict(scaled_features)

        # Decode the predictions for each output (ensure you're using the correct label encoder for each)
        disease_pred = label_encoders["Predicted Disease"].inverse_transform([np.argmax(prediction[0])])[0]
        triage_pred = label_encoders["Triage Level"].inverse_transform([np.argmax(prediction[1])])[0]
        treatment_pred = label_encoders["Suggested Treatment"].inverse_transform([np.argmax(prediction[2])])[0]

        # Return the prediction as a JSON response
        return jsonify({
            'Predicted Disease': disease_pred,
            'Triage Level': triage_pred,
            'Suggested Treatment': treatment_pred
        })

    except Exception as e:
        # Return a detailed error message in case of failure
        return jsonify({'error': str(e)}), 500

# Run the Flask app (ngrok will handle tunneling automatically)
if __name__ == '__main__':
    app.run()