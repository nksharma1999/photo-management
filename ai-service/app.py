from flask import Flask, request, jsonify
from deepface import DeepFace
import numpy as np
import cv2
import tempfile

app = Flask(__name__)

@app.route("/detect-faces", methods=["POST"])
def detect_faces():
    print(request.files)
    if "image" not in request.files:
        print("❌ No image received")
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    # Save temporary image
    temp = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
    file.save(temp.name)

    try:

        # Detect faces
        faces = DeepFace.extract_faces(
            img_path=temp.name,
            detector_backend="opencv",
            enforce_detection=False
        )

        embeddings = []

        for face in faces:

            embedding = DeepFace.represent(
                img_path=temp.name,
                model_name="Facenet",
                enforce_detection=False
            )

            vector = embedding[0]["embedding"]

            embeddings.append(vector)

        return jsonify({
            "faces_detected": len(faces),
            "embeddings": embeddings
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


@app.route("/health")
def health():
    return {"status": "AI service running"}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4001)