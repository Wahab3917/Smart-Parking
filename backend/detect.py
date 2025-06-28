import torch
import os
from PIL import Image

# Path to your trained model (relative to detect.py)
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'best.pt')

# Load YOLOv5 model
model = torch.hub.load('yolov5', 'custom', path=MODEL_PATH, source='local')

# Function to run detection and save result image
def detect_parking_spots(image_path):
    # Run detection
    results = model(image_path)

    # Ensure static folder exists
    static_dir = os.path.join(os.path.dirname(__file__), 'static')
    os.makedirs(static_dir, exist_ok=True)

    # Extract original filename without extension
    original_name = os.path.splitext(os.path.basename(image_path))[0]
    
    # Save result image
    results.save(save_dir=static_dir, exist_ok=True)

    # # Debug: Print what files are in static directory
    # print("Files in static directory:", os.listdir(static_dir))
    
    # Find the saved detection image
    saved_files = [f for f in os.listdir(static_dir) if f.endswith(('.jpg', '.png', '.jpeg'))]
    print("Image files found:", saved_files)
    
    if saved_files:
        # Use the first image file found
        saved_image_path = os.path.join(static_dir, saved_files[0])
        output_filename = f"{original_name}_result.jpg"
        output_path = os.path.join(static_dir, output_filename)
        
        # If output file already exists, remove it first
        if os.path.exists(output_path):
            os.remove(output_path)
        
        os.rename(saved_image_path, output_path)
        print(f"Renamed {saved_files[0]} to {output_filename}")
        
        return output_filename
    
    return None