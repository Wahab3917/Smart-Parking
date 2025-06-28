from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from detect import detect_parking_spots
import shutil
import os

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (result image)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.post("/detect")
async def detect_image(image: UploadFile = File(...)):
    # Clean up static folder before processing new image
    static_dir = "static"
    if os.path.exists(static_dir):
        for file in os.listdir(static_dir):
            file_path = os.path.join(static_dir, file)
            if os.path.isfile(file_path):
                os.remove(file_path)
    
    # Save uploaded file temporarily
    temp_path = os.path.join("static", image.filename)
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    # Perform detection
    output_filename = detect_parking_spots(temp_path)

    # Clean up uploaded file only if it still exists
    if os.path.exists(temp_path):
        os.remove(temp_path)

    return {"result": f"static/{output_filename}"}