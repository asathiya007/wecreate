const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const config = require("config");
const path = require("path");

// set up server 
const app = express(); 
app.use(express.json());
app.use(cors());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// connect to MongoDB
const conn = mongoose.createConnection(config.get("mongoURI"), {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
let gfs;

// init stream 
conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
});

// create storage engine
const storage = new GridFsStorage({
    url: config.get("mongoURI"),
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

// @route   GET /test
// @desc    test api running endpoint
app.get("/test", (req, res) => {
    res.json({ msg: "API running" });
}); 

// @route   GET /
// @desc    loads form
app.get("/", (req, res) => {
    // get files 
    gfs.files.find().toArray((err, files) => {
        // check if files
        if (!files || files.length === 0) {
            res.render("index", {files: false});
        } else {
            files.map(file => {
                if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
                    file.isImage = true; 
                } else {
                    file.isImage = false; 
                }
            });
            res.render("index", { files: files });
        }
    })
}); 

// @route   POST /upload
// @desc    uploads file to db
app.post("/upload", upload.single("file"), (req, res) => {
    // res.json({file: req.file});
    res.redirect("/");
}); 

// @route   GET /files 
// @desc    display all files in JSON 
app.get("/files", (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // check if files
        if (!files || files.length === 0) {
            return res.status(400).json({err: "no files exist"});
        }

        // return files
        return res.json(files);
    });
}); 

// @route   GET /files/:filename
// @desc    display a file in JSON
app.get("/files/:filename", (req, res) => {
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
        // check if file
        if (!file || file.length === 0) {
            return res.status(400).json({ err: "no file exists" });
        }

        // return files
        return res.json(file);
    }); 
}); 

// @route   GET /image/:filename
// @desc    display an image 
app.get("/image/:filename", (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // check if file
        if (!file || file.length === 0) {
            return res.status(400).json({ err: "no file exists" });
        }

        // check if image 
        if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
            // read output to browser 
            const readStream = gfs.createReadStream(file.filename);
            readStream.pipe(res);
        } else {
            return res.status(404).json({err: "not an image"}); 
        }
    });
}); 

// @route   DELETE /files/:id
// @desc    delete file 
app.delete("/files/:id", (req, res) => {
    gfs.remove({_id: req.params.id, root: "uploads"}, (err, gridStore) => {
        if (err) {
            return res.status(404).json({err: err});
        }

        res.redirect("/");
    })
});

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`server running on port ${PORT}`));