#!/usr/bin/env node
const api = require("./index");
const { program } = require("commander");
const pkg = require("./package.json");

program.version(pkg.version);

program
  .command("add")
  .description("add a todo")
  .action((source, destination) => {
    // const wordsArr = args.splice(0,-1);
    // console.log(wordsArr);
    if (destination.args.length === 0) {
      return console.log("todo title is needed!");
    }
    api.add(destination.args.join(" "));
  });

program
  .command("clear")
  .description("remove all todos")
  .action((source, destination) => {
    api.clear();
  });

if (process.argv.length === 2) {
  api.showAll();
  return;
}

program.parse(process.argv);
