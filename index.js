const { db, client } = require("./utils/db");
const { TodoRepository } = require("./repositories/todo.repository");
const { TodoRecord } = require("./records/todo.record");

(async () => {
  try {
    for await (const todo of await TodoRecord.findAllWithCursor()) {
      const record = new TodoRecord(todo);

      record.title += " [Updated]";
      await record.update();
    }
  } finally {
    await client.close();
  }
})();
