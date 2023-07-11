const express = require("express");
const multer = require("multer");
const path = require("path");
const { exec } = require("child_process");

const app = express();

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

app.post("/upload", upload.single("csvFile"), (req, res) => {
  const filePath = req.file.path;

  console.log(filePath);

  //spawn new child process to call the python script
  exec(`python analyze-csv.py ${filePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error}`);
      //handle the error appropriately
      return res.status(500).send("Iternal Server Error");
    }

    // Process the script output if needed
    const data = JSON.parse(stdout);
    // console.log(`Python script output: ${data}`);
    console.log(Object.keys(data));

    // const { "x": x, "y": y } = data;
    // console.log(x);
    // console.log(y);
    const { x, y } = data;

    // Send a response to the client indicating succesful processing
    res.status(200).send("File processed successfully");
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000!");
});
