const express = require("express");
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");
const app = express();

const cors = require("cors");
app.use(cors());

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.post("/upload", upload.single("csvFile"), (req, res) => {
  const filePath = req.file.path;

  console.log(filePath);

  //spawn new child process to call the python script
  exec(`python analyze-csv.py ${filePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error}`);
      //handle the error appropriately
      return res.status(500).send("Internal Server Error");
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

const folderStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    // const folder = req.body["Specimen_RawData_1.csv"][0].slice(0, 15);
    // console.log("IN CALLBACK");
    // console.log(path.dirname(file.originalname));
    // const path = `./uploads//${folder}`;
    const uploadPath = `./uploads/${path.dirname(file.originalname)}`;
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, path.basename(file.originalname));
  },
});

const uploadFolder = multer({
  storage: folderStorageEngine,
  preservePath: true,
});

const getRoot = (dirName) => {
  console.log(dirName);
  const regEx = /^.+?[/]/;
  const root = regEx.exec(dirName)[0];
  return root;
};

app.post("/uploadFolder", uploadFolder.array("csvFiles"), (req, res) => {
  console.log("request received!");
  const rootPath = getRoot(req.files[0].originalname);
  console.log(`uploads/${rootPath}`);
  res.send("Multiple Files Upload Success");
});

app.get("/analyzeFolder", (req, res) => {
  console.log("request received!");
  exec(
    `python analyze-csv-simple.py "uploads/9_22_2022 Round 2 Testing/"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error}`);
        //handle the error appropriately
        return res.status(500).send("Internal Server Error");
      }
      // // Process the script output if needed
      // const data = JSON.parse(stdout);
      // // console.log(`Python script output: ${data}`);
      // console.log(Object.keys(data));
      // // const { "x": x, "y": y } = data;
      // // console.log(x);
      // // console.log(y);
      // const { x, y } = data;
      // Send a response to the client indicating succesful processing
      console.log("Successful!");
      // console.log(stdout);
      const data = JSON.parse(stdout);
      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end(JSON.stringify(data, null, 3));
    }
  );
});

app.listen(5000, () => {
  console.log("Server running on port 5000!");
});
