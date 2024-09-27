from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Directory where the uploaded files are stored
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Route to upload the dataset (already existing)
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'datasetFile' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['datasetFile']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)
    return jsonify({"file": {"originalname": file.filename}}), 200

# Route to show the first 5 rows of the uploaded dataset
@app.route('/show-dataset', methods=['GET'])
def show_dataset():
    file_list = os.listdir(app.config['UPLOAD_FOLDER'])
    if not file_list:
        return jsonify({"error": "No files uploaded"}), 400

    # Assuming the latest uploaded file is what the user wants to preview
    latest_file = file_list[-1]
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], latest_file)
    
    # Load the file with pandas
    try:
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        elif file_path.endswith('.xlsx'):
            df = pd.read_excel(file_path)
        elif file_path.endswith('.json'):
            df = pd.read_json(file_path)
        else:
            return jsonify({"error": "Unsupported file format"}), 400
        
        # Get the top 5 rows
        df_html = df.to_html(classes='dataframe', index=False)

        return render_template('index.html', table=df_html)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=8000, debug=True)
