#!/usr/local/bin/node
require("colors");
const fs = require("fs");
const inquirer = require("inquirer");
const readline = require("readline");



const fooo = () => {
  const executionDir = process.cwd();
  const list = fs.readdirSync(executionDir);

  inquirer
    .prompt([
      {
        name: "fileName",
        type: "list",
        message: "Choose a file or a directory to read",
        choices: ["..", ...list],
      },
    ])
    .then(({ fileName }) => {
      console.clear();

      if (fileName === "..") {
        process.chdir("../");
        console.log(process.cwd());
        fooo();
      } else if (fs.lstatSync(fileName).isDirectory()) {
        process.chdir(`./${fileName}`);
        console.log(process.cwd());
        fooo();
      } else if (fs.lstatSync(fileName).isFile()) {
        inquirer
          .prompt([
            {
              name: "readOrSearch",
              type: "list",
              message: "Would you search file, or read it?",
              choices: ["read", "search"],
            },
          ])
          .then(({ readOrSearch }) => {
            if (readOrSearch === "read") {
              fs.readFile(fileName, "utf-8", (err, data) => {
                if (err) console.log(err);
                else console.log(data);
              });
            } else {
              inquirer
                .prompt([
                  {
                    name: "wordSearch",
                    type: "input",
                    message: "enter the word to search",
                  },
                ])
                .then(({ wordSearch }) => {
                  const readStream = fs.createReadStream(fileName, "utf8");

                  const rl = readline.createInterface({
                    input: readStream,
                    terminal: true,
                  });

                  rl.on("line", (line) => {
                    if (line.includes(wordSearch)) {
                      console.log(line, " contains ".red, wordSearch);
                    }
                  });
                });
            }
          });
      }
    });
};
console.clear();
fooo();
