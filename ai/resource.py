import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler
import joblib

# Define diseases and resource categories
diseases = ["Covid", "Stroke", "Sepsis", "Pneumonia", "Severe_Trauma", "Heart_Failure"]
resources = ["PPEkits", "Beds", "Doctors", "Ventilator", "Oxygen Cylinder"]

# Generate dataset with 20000 rows
data = []
for _ in range(20000):
    disease = np.random.choice(diseases)
    patient_count = np.random.randint(50, 500)
    severity_score = np.random.randint(1, 5)

    # Simulated resource requirements based on disease severity
    resource_needs = {
        "PPEkits": np.random.randint(10, 100) * severity_score,
        "Beds": np.random.randint(5, 50) * severity_score,
        "Doctors": np.random.randint(1, 10) * severity_score,
        "Ventilator": np.random.randint(0, 5) * severity_score,
        "Oxygen Cylinder": np.random.randint(5, 30) * severity_score,
    }

    data.append([disease, patient_count, severity_score] + list(resource_needs.values()))

# Create DataFrame
df = pd.DataFrame(data, columns=["Disease", "Patient_Count", "Severity_Score"] + resources)

# One-Hot Encode Disease Column
ohe = OneHotEncoder(sparse_output=False)
disease_encoded = ohe.fit_transform(df[["Disease"]])
disease_df = pd.DataFrame(disease_encoded, columns=ohe.get_feature_names_out(["Disease"]))
df = pd.concat([df, disease_df], axis=1).drop(columns=["Disease"])

# Save the OneHotEncoder
joblib.dump(ohe, "ohe.pkl")

# Features and target variables
X = df.drop(columns=resources)
y = df[resources]

# Feature scaling
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split dataset into training and test sets (80-20 split)
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Train a MultiOutput Gradient Boosting Regressor model
base_model = GradientBoostingRegressor(n_estimators=200, learning_rate=0.1, max_depth=5)
model = MultiOutputRegressor(base_model)
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# Model Evaluation
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print(f"MAE: {mae}")
print(f"RMSE: {rmse}")
print(f"R2 Score: {r2}")

# Save model and scaler
model_path = "resource_prediction_model_gb.pkl"
scaler_path = "scaler.pkl"
joblib.dump(model, model_path)
joblib.dump(scaler, scaler_path)
print(f"Model saved as {model_path}")
print(f"Scaler saved as {scaler_path}")
