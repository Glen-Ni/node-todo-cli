const api = require("./api");
const inquirer = require("inquirer");

const { program } = require("commander");
program
  .option("-d, --debug", "output extra debugging")
  .option("-s, --small", "small pizza size")
  .option("-p, --pizza-type <type>", "flavour of pizza");

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
  api.showAll().then((list) => {
    showTodos(list);
  });
  return;
}

function showTodos(list) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "key",
        message: "请选择操作",
        choices: [
          { value: -1, name: "退出" },
          { value: -2, name: "+ 新增待办" },
          ...list.map((item, index) => ({
            value: index + 1,
            name: `${index + 1}. ${item.isDone ? "[X]" : "[_]"} ${item.title}`,
          })),
        ],
      },
    ])
    .then(({ key }) => {
      console.log("answer", key);
      if (key === -1) {
        return;
      } else if (key === -2) {
        addTodo(list);
      } else {
        todoAction(list, +key - 1);
      }
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
}

function todoAction(list, index) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "key",
        message: "待办事项操作",
        choices: [
          {
            value: list[index].isDone ? "unComplete" : "complete",
            name: list[index].isDone ? "设为【未完成】" : "设为【完成】",
          },
          { value: "edit", name: "编辑" },
          { value: "delete", name: "删除" },
          { value: "back", name: "返回" },
        ],
      },
    ])
    .then(({ key }) => {
      switch (key) {
        case "unComplete":
          list[index].isDone = false;
          break;
        case "complete":
          list[index].isDone = true;
          break;
        case "edit":
          eidtTodo(list,index);
          return;
        case "delete":
          list[index].isDone = false;
          list.splice(index, 1);
          break;
        default:
          break;
      }
      api.save(list).then(() => {
        api.showAll().then((list2) => {
          showTodos(list2);
        });
      });
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
}

function addTodo(list) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "请输入待办事项：",
      },
    ])
    .then(({ title }) => {
      api.save([...list, { title, isDone: false }]).then(() => {
        api.showAll().then((list2) => {
          showTodos(list2);
        });
      });
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
}

function eidtTodo(list, index) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: `将【${list[index].title}】改为：`,
      },
    ])
    .then(({ title }) => {
      list[index].title = title
      api.save(list).then(() => {
        api.showAll().then((list2) => {
          showTodos(list2);
        });
      });
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
}

program.parse(process.argv);
