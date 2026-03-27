from deepface import DeepFace
result = DeepFace.represent(img_path="1774589074244-IMG_8269.jpeg", model_name="Facenet", enforce_detection=False)
print(result)
