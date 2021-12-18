const fs = require("fs");
const path = require("path");
const homeDir = process.env.HOME || require("os").homedir();
const dbPath = path.join(homeDir, "todo.txt");

const db = {
  read: (path = dbPath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(path, { flag: "a+" }, (err, data) => {
        if (err) return reject(err);
        if (!data) {
          console.log("todo is needed！");
          reject();
        }
        let content;
        try {
          content = JSON.parse(data);
        } catch (err2) {
          content = [];
        }
        resolve(content);
      });
    });
  },
  write: (list, path = dbPath) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(list), (err3) => {
        if (err3) return reject(err3);
        resolve();
      });
    });
  },
};

module.exports = db;
