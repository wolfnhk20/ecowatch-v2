# **Wildlife Recognition with YOLOv8**
🚀 **AI-powered wildlife recognition system** that detects species using **YOLOv8** and provides **detailed scientific data** for each identified species.

---

## **📌 Features**
✔️ **Wildlife Detection** using YOLOv8  
✔️ **Displays Scientific & Conservation Data**  
✔️ **Supports Image Upload & Camera Capture**  
✔️ **Mobile Responsive UI**  
✔️ **Fast Inference & Search**  
✔️ **Deployable on Render**  

---

## **📂 Project Structure**
```
├── static/              # Static assets (CSS, JS, images, data)
│   ├── styles.css       # Main CSS file
│   ├── script.js        # Main JavaScript logic
│   ├── data.json        # Wildlife species data
├── templates/           # HTML templates (for Flask if needed)
│   ├── index.html       # Main UI
├── app.py               # Flask backend (if used)
├── best.pt              # yolov8 model
├── requirements.txt     # Python dependencies
├── README.md            # Project Documentation
```

---

## **📸 Class Names (Detected Species)**
Model can detect the following species:

```
['Iguana', 'Indian Elephant', 'Indian Wolf', 'Tiger', 'White Tiger', 'Antelope', 'Asiatic Lion', 
 'Barking Deer', 'Bengal Tiger', 'Asiatic Black Bear', 'Blackbuck', 'Chimpanzee', 'Gharial', 
 'Indian Bison', 'Indian Rock Python', 'Jackal', 'King Cobra', 'Leopard', 'Lion-Tailed Macaque', 
 'Monkey', 'Nilgiri Tahr', 'One-Horned Rhino', 'Orangutan', 'Peacock', 'Porcupine', 'Red Panda', 
 'Indian Rhinoceros', 'Sambar Deer', 'Sloth Bear', 'Snow Leopard', 'Indian Star Tortoise']
```

---

## **🚀 Getting Started**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/wolfnhk20/ecowatch-v2.git
cd ecowatch-v2
```

### **2️⃣ Install Dependencies**
```sh
pip install -r requirements.txt
```

### **3️⃣ Run the Application**
```sh
python app.py
```
or if using **Flask**:
```sh
flask run
```

### **4️⃣ Access the Web Interface**
Go to `http://127.0.0.1:5000` in your browser.

---

## **🖼️ Screenshots**
```md
![image](https://github.com/user-attachments/assets/719aa45a-f6dc-448f-bbfe-529b1b676efe)

```

---

## **🛠️ Future Enhancements**
✅ Add more species  
✅ Improve UI animations  
✅ Enhance accuracy with more training data  

---

## **🤝 Contributing**
Got improvements? Feel free to fork, improve, and submit a pull request!

---

## **📜 License**
MIT License. Free to use and modify.

---
