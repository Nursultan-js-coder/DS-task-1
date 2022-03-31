const port = 4000;
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const fileUpload = require('express-fileupload')
const app = express();
const {join} = require('path')
const logger = require("./logger")
const path = require("path");

app.use(cors());
app.use(fileUpload({}))

app.get("/files/:filename", (req, res) => {
    const filePath = join(__dirname, 'files', `${req.params.filename}.jpeg`);
    if (fs.existsSync(filePath)) {
        const file = fs.statSync(filePath);
        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Content-Length", file.size);
        res.status(200)
        res.sendFile(filePath);
    } else {
        res.status(400);
        res.send("Can not find file with name" + req.params.filename);
    }
});

app.put("/files/:filename", (req, res) => {
    const filePath = join(__dirname, 'files', `${req.params.filename}.jpeg`);
    const action = fs.existsSync(filePath) ? "updated" : "created";
    const file = fs.createWriteStream(filePath);
    const dirPath = path.join(__dirname, "files");
    if (fs.statSync(dirPath).size.valueOf() > 1000) {
        logger.error("max size exceeded (10MB)");
        res.status(500);
        res.send("max size exceeded (10MB) in directory 'files'");
    } else {
        logger.info("file writing started at " + new Date().toLocaleDateString());
        file.write(req.files.file.data, (err) => {
            if (err) {
                console.log('err ->>', err);
                logger.error("error occurred when writing file")
            } else {
                logger.info(`file ${req.params.filename} is ${action} at ${new Date().toLocaleDateString()}`);
            }
        })
        return res.send(`file ${req.params.filename} is ${action}`);
    }
})

app.listen(port, () =>
    console.log(`image-upload backend listening on port ${port}`)
);
