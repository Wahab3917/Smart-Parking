# Smart Parking - AI Powered Parking Spot Detection with YOLOv5

### Artificial Intelligence Lab - 6th Semester BSCS
### Term Project

This project presents an AI-powered parking spot detection system built using YOLOv5 object detection. The system enables automated detection of available parking spots from parking lot images, providing the foundation for smart parking solutions in real-world scenarios.

## Tools & Technologies

- **YOLOv5** — Computer Vision Object Detection Model
- **Python** — Backend development
- **FastAPI** — REST API for detection service
- **PIL (Pillow)** — Image processing
- **React.js (Vite)** — Frontend interface
- **ShadCN UI Library** — Frontend components
- **makesense.ai** — Dataset labeling

## Dataset & Training Details

- Parking lot images were obtained from the [CNRPark + EXT dataset](http://cnrpark.it/)
- The images were labeled manually using [makesense.ai](https://www.makesense.ai/)
- YOLOv5 model trained on **20 labeled images**
- The model's accuracy and performance were modest due to the limited dataset
- The dataset was intentionally kept small to demonstrate a complete custom end-to-end workflow from data collection to deployment

## How to Run

### 1. Clone the Repository
```bash
git clone <repo-link>
cd <project-folder>
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

Start the backend server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Start the frontend server:
```bash
npm run dev
```

### 4. Test the Model
Test the model using the test images located at assets/Test Images.

## Screenshots

<div>
  <img src="assets/Interface Images/interface-1.png" width="600" alt="Default Interface"/>
  <br>
  <img src="assets/Interface Images/interface-2.png" width="600" alt="Output with Detected Spots"/>
</div>

