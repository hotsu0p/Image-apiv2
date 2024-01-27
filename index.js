import 'dotenv/config'
import express from "express"
import fs from "fs"
import cors from "cors"
import rateLimit from "express-rate-limit"
import path from "path"
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise'; // for MySQL
// or
// import pg from 'pg'; // for PostgreSQL

const dbConfig = {
    host: 'your_database_host',
    user: 'your_database_user',
    password: 'your_database_password',
    database: 'your_database_name',
};
const connection = await mysql.createConnection(dbConfig);
const port = process.env.PORT || 8080
const app = express()

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
})

const api_key = process.env.API_KEY;

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("public"))
app.use(limiter)
app.use(cors())

app.get("/", (req, res) => {
    res.redirect('https://github.com/hotsu0p/Image-apiv2/tree/main');
})

app.get("/cat", async(req, res) => {
    const key = req.query.key;
    const result = {};

    result.code = 200;

    try {
        const [rows] = await connection.query('SELECT * FROM images WHERE category = ?', ['cat']);
        const randomImage = rows[Math.floor(Math.random() * rows.length)];

        if (!randomImage) {
            result.code = 404;
            result.url = `error: no images available`;
        } else {
            result.url = `https://image-apiv2.vercel.app/cat/${randomImage.filename}`;
            result.key = key;
            res.header("Content-type", "application/json; charset=utf-8");
        }

        if (api_key.includes(key)) {
            res.send(JSON.stringify(result, null, 2));
            console.log(result);
        } else {
            result.code = 403;
            result.message = "error: invalid api key, try again";
            res.send(JSON.stringify(result, null, 2));
        }
    } catch (error) {
        console.error('Error fetching images from the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
import multer from 'multer';

const storage = multer.memoryStorage(); // Use memory storage for demo purposes
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), async(req, res) => {
    const { originalname, buffer } = req.file;

    try {
        // Save image information to the database
        await connection.query('INSERT INTO images (filename, content) VALUES (?, ?)', [originalname, buffer]);
        res.json({ success: true, message: 'Image uploaded successfully' });
    } catch (error) {
        console.error('Error uploading image to the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* app.get("/meme", app.get("/meme", (req, res) => {
    const key = req.query.key
    const result = {}

    result.code = 200

    const imageList = fs.readdirSync(path.join(__dirname, ".", "public", "meme"))
    const randomImage = imageList[Math.floor(Math.random() * imageList.length)]

    if (!imageList.length) {
        result.code = 404
        result.url = `error: no images available`
    } else {
        result.url = `https://api.skillzl.dev/meme/${randomImage}`
        result.key = key;
        res.header("Content-type", "application/json; charset=utf-8")
    }
    res.header("Content-type", "application/json; charset=utf-8")
    if (api_key.includes(key)) {
        res.send(JSON.stringify(result, null, 2))
        console.log(result)
    } else {
        const result = {}
        result.code = 403
        result.message = "error: invalid api key, try again"
        res.send(JSON.stringify(result, null, 2))
    }
})) */

app.get("/dog", (req, res) => {
    const key = req.query.key
    const result = {}

    result.code = 200

    const imageList = fs.readdirSync(path.join(__dirname, ".", "public", "dog"))
    const randomImage = imageList[Math.floor(Math.random() * imageList.length)]

    if (!imageList.length) {
        result.code = 404
        result.url = `error: no images available`
    } else {
        result.url = `https://image-apiv2.vercel.app/dog/${randomImage}`
        result.key = key;
        res.header("Content-type", "application/json; charset=utf-8")
    }
    res.header("Content-type", "application/json; charset=utf-8")
    if (api_key.includes(key)) {
        res.send(JSON.stringify(result, null, 2))
        console.log(result)
    } else {
        const result = {}
        result.code = 403
        result.message = "error: invalid api key, try again"
        res.send(JSON.stringify(result, null, 2))
    }
})

app.get("/test", (req, res) => {
    const result = {}

    result.code = 200

    const imageList = fs.readdirSync(path.join(__dirname, ".", "public", "test"))
    const randomImage = imageList[Math.floor(Math.random() * imageList.length)]

    if (!imageList.length) {
        result.code = 404
        result.url = `error: no images available`
    } else {
        result.url = `https://image-apiv2.vercel.app/test/${randomImage}`
        res.header("Content-type", "application/json; charset=utf-8")
    }
    res.send(JSON.stringify(result, null, 2))
    console.log(result)
})
app.get("/meme", (req, res) => {
    const result = {}

    result.code = 200

    const imageList = fs.readdirSync(path.join(__dirname, ".", "public", "meme"))
    const randomImage = imageList[Math.floor(Math.random() * imageList.length)]

    if (!imageList.length) {
        result.code = 404
        result.url = `error: no images available`
    } else {
        result.url = `https://image-apiv2.vercel.app/meme/${randomImage}`
        res.header("Content-type", "application/json; charset=utf-8")
    }
    res.send(JSON.stringify(result, null, 2))
    console.log(result)
})

app.listen(port, "0.0.0.0", function() {
    console.log(`Server listening on port ${port}\n`)
});