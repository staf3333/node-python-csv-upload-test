import { useState, useEffect } from "react";
import "./App.css";
import DataChart from "./DataChart";

function App() {
  const [files, setFiles] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(files);

    // handle file data from state before sending
    const data = new FormData();

    // to add files to data (type: FormData) object, iterate through the files(type: FileList) object
    // and append each file to data seperately
    for (let i = 0; i < files.length; i++) {
      // console.log(files[i]);
      // data.append("csvFiles", files[i], files[i].webkitRelativePath);
      // data.append(files[i].name, files[i].webkitRelativePath);
      data.append("csvFiles", files[i]);
      // data.append(files[i].name);
    }

    fetch("http://localhost:5000/uploadFolder", {
      method: "POST",
      body: data,
    })
      .then((result) => {
        console.log("File Sent Succesfully");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleChange = (e) => {
    // EVERYTHING I SAID HERE IS FALSE - I WAS A CHILD AND DIDN'T KNOW ANY BETTER, PLEASE FORGIVE ME
    // have to create a new array to store files
    // typically could just take e.target.files as an array but for some reason, for webkitdirectory,
    // React makes e.target.files an object instead of array (which isn't compatible with multer--> it expects an array of files)
    // const fileList = e.target.files;
    // const files = [];

    // // fileList object from e.target.files contains a key for length property - tells how many files in FileList object
    // for (let i = 0; i < fileList.length; i++) {
    //   const file = fileList.item(i);
    //   files.push(file);
    // }
    // STUPID STUPID STUPID PRETEND YOU DON'T SEE, ONLY HERE TO REMIND MYSELF THAT I AM STUPID
    setFiles(e.target.files);
  };

  const analyzeData = async () => {
    console.log("analyzing data!");

    const res = await fetch("http://localhost:5000/analyzeFolder");
    const data = await res.json();
    // const data = JSON.parse(res);
    console.log(data);
  };

  const changeFileName = () => {
    console.log(files[0].name);
    console.log(files[0].webkitRelativePath);
    files[0].name = files[0].webkitRelativePath;
    console.log(files[0].name);
  };

  useEffect(() => {
    const getFolderData = async () => {
      const res = await fetch("http://localhost:5000/analyzeFolder");
      const data = await res.json();
      // const data = JSON.parse(res);
      setData(data);
      setLoading(false);
    };
    getFolderData();
  }, []);

  return (
    <>
      <h1>Practice uploading folder to server</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          id="files"
          name="csvFiles"
          webkitdirectory="true"
          onChange={handleChange}
          multiple
        />
        <button onClick={changeFileName}>Change File Name</button>
        <button type="submit">Submit Folder</button>
      </form>
      <button onClick={analyzeData}>Analyze the data</button>
      {loading ? <h1>Chart is Loading</h1> : <DataChart stiffData={data} />}
    </>
  );
}

export default App;
