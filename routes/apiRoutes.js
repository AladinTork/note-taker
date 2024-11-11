const api = require("express").Router();
const uuid = require("generate-unique-id");
const fs = require("fs");
const { readFromFile} = require("../helpers/fsUtils.js");



// GET request for notes
api.get("/notes", (req, res) => {
    console.info(`${req.method} request received for notes`);
  
    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
  });
  
  // POST request for notes
  api.post("/notes", (req, res) => {
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

  module.exports = api;