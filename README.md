# Digital Memory Album 📸

A production-ready, modern, fully responsive React.js web application that creates a QR/Album-code based 3D Flipbook Photo Album.

## ✨ Features

- **QR Code Access**: Enter a 6-digit numeric album code to access albums
- **3D Flipbook**: Realistic page-turning animation with Framer Motion
- **Firebase Integration**: Images fetched from Firestore database
- **Fully Responsive**: Optimized for mobile, tablet, laptop, desktop, and large screens
- **Modern UI**: Glassmorphism design with Tailwind CSS
- **Direct Routing**: Access albums via `/album/:qrCode` URLs
- **Error Handling**: Graceful handling of invalid codes and network issues

## 🛠 Tech Stack

- **React.js** (Vite)
- **React Router v6**
- **Tailwind CSS** (100% utility-based styling)
- **Firebase v10+** (Firestore)
- **Framer Motion** (animations)

## 📁 Project Structure

```
src/
├─ app/
│   ├─ App.jsx
│   ├─ router.jsx
├─ pages/
│   ├─ LoginPage.jsx
│   ├─ AlbumPage.jsx
├─ components/
│   ├─ FlipBook/
│   │   ├─ FlipBook.jsx
│   │   ├─ FlipPage.jsx
│   ├─ Header.jsx
│   ├─ Loader.jsx
├─ firebase/
│   ├─ firebaseConfig.js
│   ├─ albumService.js
├─ utils/
│   ├─ validateQR.js
├─ main.jsx
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

Update `src/firebase/firebaseConfig.js` with your Firebase project credentials:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
}
```

### 3. Firebase Data Structure

Your Firestore should have this structure:

```
favorites/
└── {qrCode}/
    └── imgs/
        ├── doc1: { path | url | imagePath | src }
        ├── doc2: { path | url | imagePath | src }
        └── ...
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

## 🎨 Design Features

### Responsive Breakpoints
- `sm:` → Mobile (640px+)
- `md:` → Tablet (768px+)
- `lg:` → Laptop (1024px+)
- `xl:` → Desktop (1280px+)
- `2xl:` → Large screens (1536px+)

### UI Components
- **Glassmorphism Cards**: `bg-white/20 backdrop-blur-md`
- **Gradient Backgrounds**: Multi-color gradients
- **Smooth Animations**: Framer Motion transitions
- **3D Transforms**: CSS perspective and transforms

## 📱 Usage

1. **Access Album**: Enter a 6-digit numeric code on the login page
2. **Navigate**: Use Previous/Next buttons or arrow keys
3. **Fullscreen**: Click the fullscreen icon in the header
4. **Direct Access**: Share URLs like `/album/123456`

## 🔧 Customization

### Styling
All styling uses Tailwind CSS utility classes. No custom CSS files needed.

### Image Handling
The app supports multiple image field formats:
- `url` - Direct image URL
- `path` - Firebase Storage path
- `imagePath` - Alternative path field
- `src` - Source URL

### Flipbook Logic
- One page = 2 images (front + back)
- Odd image count: Duplicates second-last image
- Single image: Duplicates the image

## 🚀 Deployment

Ready for deployment on:
- **Vercel**: `npm run build` then deploy `dist/` folder
- **Netlify**: Connect repository and set build command to `npm run build`
- **Firebase Hosting**: Use Firebase CLI

## 📄 License

MIT License - feel free to use for personal and commercial projects.

---

Built with ❤️ using React.js, Tailwind CSS, and Firebase