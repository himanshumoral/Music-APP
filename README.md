# 🎵 Music App

A full-stack personal music streaming application where users can upload, play, and organize music into albums/playlists.

🔗 **Live Demo:** [https://music-app-hfeb.onrender.com](https://music-app-hfeb.onrender.com)

## Features

- 🔐 User authentication (Register/Login) with JWT and cookies
- 🎤 Artist role — upload music with title, audio file, and thumbnail image
- 🎧 Music player with play/pause, seek bar, and auto-next on song end
- 📁 Create albums/playlists and add songs to them
- ✏️ Update album name and delete albums
- 🗑️ Remove songs from albums (auto-deletes empty albums)
- 📱 Fully responsive design (mobile-friendly)

## Tech Stack

**Frontend**
- HTML, CSS, JavaScript (Vanilla)

**Backend**
- Node.js
- Express.js
- MongoDB with Mongoose

**Other Tools & Services**
- JWT (jsonwebtoken) — authentication
- bcryptjs — password hashing
- Multer — handling file uploads
- ImageKit (@imagekit/nodejs) — cloud storage for music files and images
- cookie-parser — cookie handling
- cors — cross-origin resource sharing
- dotenv — environment variable management

## Dependencies

```json
"@imagekit/nodejs": "^7.6.3",
"bcryptjs": "^3.0.3",
"cookie-parser": "^1.4.7",
"cors": "^2.8.6",
"dotenv": "^17.4.2",
"express": "^5.2.1",
"jsonwebtoken": "^9.0.3",
"mongoose": "^9.6.3",
"multer": "^2.1.1"
```

## Project Structure

```
Music-App/
├── beckend/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   └── music.controller.js
│       ├── db/
│       │   └── db.js
│       ├── middlewares/
│       │   └── auth.middleware.js
│       ├── models/
│       │   ├── album.model.js
│       │   ├── music.model.js
│       │   └── user.model.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   └── music.routes.js
│       └── services/
│           └── storage.service.js
└── frontend/
    ├── index.html        (Login)
    ├── register.html
    ├── home.html          (All songs)
    ├── album.html         (User's albums)
    ├── album-details.html (Songs inside an album)
    └── corresponding .css / .js files
```

## Environment Variables

Create a `.env` file inside the `beckend` folder with:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/himanshumoral/Music-APP.git
```

2. Install dependencies
```bash
cd beckend
npm install
```

3. Add your `.env` file (see above)

4. Run the server
```bash
npm run dev
```

5. Open your browser at `http://localhost:3000`

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/music/Musics` | Get all songs |
| POST | `/api/music/upload` | Upload a new song (artist only) |
| GET | `/api/music/albums` | Get logged-in user's albums |
| POST | `/api/music/album` | Create a new album |
| POST | `/api/music/album/music` | Add a song to an album |
| POST | `/api/music/album/music/remove` | Remove a song from an album |
| GET | `/api/music/album-details/:albumId` | Get details of a specific album |
| POST | `/api/music/album/update/:albumId` | Update album title |
| DELETE | `/api/music/album/:albumId` | Delete an album |

## Author

**Himanshu Moral**
- GitHub: [@himanshumoral](https://github.com/himanshumoral)

## License

ISC
