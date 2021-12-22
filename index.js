const db = require("./db");
const inquirer = require("inquirer");

async function add(todo) {
  const list = await db.read();
  list.push({
    title: todo,
    isDone: false,
  });
  await db.write(list);
}

async function clear() {
  await db.write([]);
  console.log("清除完毕");
}

async function showAll() {
  const list = await db.read();
  printTodos(list);
}

async function save(list) {
  return await db.write(list);
}

function printTodos(list) {
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
          { value: -3, name: "清空" },
        ],
      },
    ])
    .then(({ key }) => {
      if (key >= 0) {
        todoAction(list, +key - 1);
      } else if (key === -2) {
        addTodo(list);
      } else if (key === -3) {
        clear();
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

function markAsDone(list, index) {
  list[index].isDone = true;
  return list;
}

function markAsUndone(list, index) {
  list[index].isDone = false;
  return list;
}

function deleteTodo(list, index) {
  list.splice(index, 1)
  return list;
}

function eidtTodoTitle(list, index) {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: `将【${list[index].title}】改为：`,
        },
      ])
      .then(({ title }) => {
        list[index].title = title;
        resolve(list);
      })
  });
}

function todoAction(list, index) {
  const actions = { markAsDone, markAsUndone, eidtTodoTitle, deleteTodo };
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: `待办事项【${list[index].title}】操作：`,
        choices: [
          {
            value: list[index].isDone ? "markAsUndone" : "markAsDone",
            name: list[index].isDone ? "设为【未完成】" : "设为【完成】",
          },
          { value: "eidtTodoTitle", name: "编辑" },
          { value: "deleteTodo", name: "删除" },
          { value: "back", name: "返回" },
        ],
      },
    ])
    .then(async ({ action }) => {
      if (actions[action]) {
        console.log("action", action);
        const list2 = await actions[action](list, index);
        console.log("list2", list);
        await save(list2);
        showAll();
      }
    })
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
    .then(async ({ title }) => {
      await save([...list, { title, isDone: false }]);
      showAll();
    })
}

module.exports.add = add;
module.exports.save = save;
module.exports.clear = clear;
module.exports.showAll = showAll;
