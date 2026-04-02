# 📸 Photo Dashboard

A full-stack **Photo Management System** that allows you to:

* Upload and manage photos
* Automatically extract metadata (EXIF)
* Detect faces using AI
* Convert local folders into albums
* Generate thumbnails
* Process images in background workers

---

## 🚀 Features

* 📂 Bulk import photos from local folders (Mac supported)
* 🖼️ Thumbnail generation using `sharp`
* 📍 Location detection (lat/lon → city via OpenStreetMap)
* 🤖 Face detection using `face-api`
* ⚙️ Background processing worker
* 🗂️ Album-based organization (extensible)

---

## 🛠️ Tech Stack

* **Backend:** Node.js + TypeScript
* **Image Processing:** sharp
* **AI:** face-api.js
* **Database:** (your DB here – MongoDB / etc.)
* **Scripts Runner:** ts-node
* **Process Manager:** concurrently

---

## 📦 Installation

### 1. Clone the repo

---

### 2. Install dependencies
>photo-management
```bash
npm install
```
Go to > face-api
```bash
npm install
```
Go to > server
```bash
npm install
```
Go to > frontend
```bash
npm install
```

---

## ⚙️ Folder Setup (Important)

Before running, ensure required folders exist:

```bash
mkdir -p uploads thumbnails config
```
Add .env file inside config folder
.env file variable:
```
FACE_API_SERVER_PORT=4401
FACE_API_URL="http://localhost:4401"
SERVER_PORT=4402
MONGODB_URL=""
BULKFILE_PATH=""
```

OR let the app create them automatically.

---

## ▶️ Running the Project

### 🔹 Start Main Server

```bash
npm run start:main
```

---

### 🔹 Start Face Detection Service

```bash
npm run start:face-api
```

---

### 🔹 Start Background Processing Worker

```bash
npm run start:pworker
```

---

### 🔥 Start Everything Together

```bash
npm run start:all
```

---

### 🔥 Start Frontend
Go to frontend folder
```bash
npm run dev
```
If you change the server port, make sure to update it in the frontend as well to fetch API data correctly.
Go to frontend/src/data/BaseIP.ts and update the port number.

## 📂 Convert Local Folder into Project

To bulk import images from your Mac:

```bash
npm run start:convert-folderinto-project
```

👉 Make sure you update the folder path inside:

```
server/scripts/convertFolderIntoProject.ts
```

Example:

```ts
processFolder("/Users/yourname/Desktop/my-photos");
```

---

## 🧹 Reset Database

```bash
npm run start:resetdb
```

---

## 📁 Project Structure

```
photo-dashboard/
│
├── server/
│   ├── src/                # Main backend server
│   ├── scripts/            # Utility scripts (import, worker, reset)
│
├── face-api/               # Face detection service
│
├── uploads/                # Original images
├── thumbnails/             # Resized images
│
└── package.json
```

---

## ⚠️ Important Notes

### 🔹 macOS Permissions

If using folders like Desktop/Documents:

* Go to **System Settings → Privacy & Security**
* Give **Terminal / Node Full Disk Access**

---

### 🔹 Supported Image Formats

* `.jpg`
* `.jpeg`
* `.png`
* `.heic` (requires `heif-convert` or `ImageMagick`)

---

### 🔹 HEIC Support

Install one of the following:

```bash
brew install libheif
```

OR

```bash
brew install imagemagick
```

---

### 🔹 API Rate Limits

Reverse geocoding uses OpenStreetMap (Nominatim):

* Avoid high-frequency requests
* Add delays if importing large folders

---

## 🚀 Future Improvements

* 📁 Auto album creation from folder name
* 🧠 Smart grouping (date, location, faces)
* ☁️ Cloud storage (AWS S3 / GCP)
* 🔍 Search by face / location

---

## 👨‍💻 Author

Nandkishor Sharma

---
