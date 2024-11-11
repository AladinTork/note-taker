const express = require("express");
const path = require("path");
const fs = require("fs");
const { readFromFile } = require("./helpers/fsUtils");
const uuid = require("generate-unique-id");

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// GET request for notes
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received for notes`);

  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// POST request for notes
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received for notes`);

  //deconstructing assignment for the items in req.body
  const { title, text } = req.body;

  //If title and note text is present
  if (title && text) {
    //variable for the object we will save
    const newNote = {
      title,
      text,
      review_id: uuid({
        length: 4,
        useLetters: false,
      }),
    };

    // Convert the data to a string so we can save it
    const noteString = JSON.stringify(newNote);

    fs.readFile("./db/db.json", "utf8", (error, data) => {
      if (error) {
        console.log("Error happened");
      } else {
        const parsedDataArray = JSON.parse(data);
        parsedDataArray.push(newNote);

        const newDataString = JSON.stringify(parsedDataArray);

        //write to file the new string
        fs.writeFile("./db/db.json", newDataString, (err) => {
          err
            ? console.error(err)
            : console.log(`Note has been written to "db.json"`);
        });
      }
    });

    const response = {
      status: "success",
      body: newNote,
    };
    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(300).json("Error in posting note");
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
