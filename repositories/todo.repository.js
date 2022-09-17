const { TodoRecord } = require("../records/todo.record");
const { todos } = require("../utils/db");
const { ObjectId } = require("mongodb");

class TodoRepository {
  static _checkRecord(record) {
    if (!record instanceof TodoRecord) {
      throw new Error("Record must be an instance of TodoRecord");
    }
  }

  static async insert(record) {
    TodoRepository._checkRecord(record);

    const { insertedId } = await todos.insertOne(record);
    record._id = insertedId;

    return record;
  }

  static async delete(record) {
    TodoRepository._checkRecord(record);

    await todos.deleteOne({
      _id: record._id,
    });
  }

  static async find(id) {
    const todo = await todos.findOne({ _id: ObjectId(String(id)) });
    return todo === null ? null : new TodoRecord(todo);
  }

  static async findAll() {
    return (await (await todos.find()).toArray()).map(
      (obj) => new TodoRecord(obj)
    );
  }

  static async update(record) {
    TodoRepository._checkRecord(record);

    await todos.replaceOne(
      {
        _id: record._id,
      },
      { title: String(record.title) }
    );
  }
}

module.exports = { TodoRepository };
