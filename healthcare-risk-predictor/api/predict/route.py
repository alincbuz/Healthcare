"""
Healthcare Worker Risk Predictor - Python API Endpoint

This serverless function loads pre-trained scikit-learn models and returns
risk predictions for burnout, long COVID, and extended sick leave.

Note: This requires the following files in the 'workers' directory:
- burnout_model.pkl
- long_covid_model.pkl
- extended_leave_model.pkl
- predictor_columns.pkl
"""

import json
import os
from http.server import BaseHTTPRequestHandler

import joblib
import numpy as np

# Load models once at module import time to avoid reloading on every request
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'workers')

try:
    burnout_model = joblib.load(os.path.join(MODEL_DIR, 'burnout_model.pkl'))
    long_covid_model = joblib.load(os.path.join(MODEL_DIR, 'long_covid_model.pkl'))
    extended_leave_model = joblib.load(os.path.join(MODEL_DIR, 'extended_leave_model.pkl'))
    predictor_columns = joblib.load(os.path.join(MODEL_DIR, 'predictor_columns.pkl'))
    MODELS_LOADED = True
except Exception as e:
    MODELS_LOADED = False
    MODEL_LOAD_ERROR = str(e)


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Check if models are loaded
        if not MODELS_LOADED:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': 'Models not loaded',
                'details': MODEL_LOAD_ERROR
            }).encode())
            return

        # Read request body
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length == 0:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': 'Request body is required'
            }).encode())
            return

        try:
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
        except json.JSONDecodeError:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': 'Invalid JSON in request body'
            }).encode())
            return

        # Extract features from request
        features = data.get('features', {})
        if not features:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': 'Features object is required'
            }).encode())
            return

        try:
            # Build feature vector with defaults for missing columns
            filled_features = {col: 0 for col in predictor_columns}
            
            # Overwrite with user-specified values
            for key, value in features.items():
                if key in filled_features:
                    filled_features[key] = float(value)
            
            # Create ordered array matching predictor_columns
            input_array = np.array([filled_features[col] for col in predictor_columns]).reshape(1, -1)
            
            # Get predictions from all three models
            pred_burnout = float(burnout_model.predict_proba(input_array)[0][1])
            pred_covid = float(long_covid_model.predict_proba(input_array)[0][1])
            pred_leave = float(extended_leave_model.predict_proba(input_array)[0][1])
            
            # Return predictions
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'burnout_risk': pred_burnout,
                'long_covid_risk': pred_covid,
                'extended_leave_risk': pred_leave
            }).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': 'Prediction failed',
                'details': str(e)
            }).encode())

    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
