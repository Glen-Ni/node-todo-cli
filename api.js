const db = require("./db");

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
}

async function showAll() {
  return await db.read();
}

async function save(list) {
  return await db.write(list);
}


module.exports.add = add;
module.exports.save = save;
module.exports.clear = clear;
module.exports.showAll = showAll;
