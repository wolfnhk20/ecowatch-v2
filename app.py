import io
from flask import Flask, request, render_template, jsonify, send_from_directory
from PIL import Image
import torch
from ultralytics import YOLO

app = Flask(__name__)

# Use GPU if available
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load YOLO model
model = YOLO("best.pt").to(device)

# Define class names
classNames = [
    'Iguana', 'Indian Elephant', 'Indian Wolf', 'Tiger', 'White Tiger', 'Antelope',
    'Asiatic Lion', 'Barking Deer', 'Bengal Tiger', 'Bengal Tiger', 'Asiatic Black Bear',
    'Blackbuck', 'Chimpanzee', 'Gharial', 'Indian Bison', 'Indian Rock Python', 'Jackal',
    'King Cobra', 'Leopard', 'Lion-tailed Macaque', 'Monkey', 'Nilgiri Tahr', 'One Horned Rhino',
    'Orangutan', 'Peacock', 'Porcupine', 'Red Panda', 'Indian Rhinoceros', 'Sambar Deer',
    'Sloth Bear', 'Snow Leopard', 'Indian Star Tortoise'
]

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/data.json')
def get_data():
    return send_from_directory('static', 'data.json')

@app.route("/identify", methods=["POST"])
def identify_species():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"})

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No file selected"})

    # Ensure file format is valid
    if not file.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
        return jsonify({"error": "Invalid file format"})

    # Read and process image
    image_data = file.read()
    img = Image.open(io.BytesIO(image_data))

    # Run YOLO model on the image
    results = model(img)

    detected_labels = []  # List to store detected species

    for r in results:
        boxes = r.boxes
        for box in boxes:
            if box.cls.numel() > 0:  # Ensure there are valid class predictions
                cls = int(box.cls[0])
                
                if 0 <= cls < len(classNames):
                    detected_labels.append(classNames[cls])
                    print("Detected -->", classNames[cls])

    if detected_labels:
        return jsonify({"labels": detected_labels})
    else:
        return jsonify({"error": "No species detected"})

if __name__ == "__main__":
    app.run(debug=True)
