import express from 'express';

import multer from "multer";
import cloudinary from './cloudinary';

const app = express();
const port = 3000;

const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post("/issues", upload.single("file"), async (req, res) => {
  try {
    console.log("UPLOAD HIT");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageResult  = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "emoji" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    console.log("imageresult", imageResult);
    res.json({
      message: "done",
      //@ts-ignore
      url: imageResult.url
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});



app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});