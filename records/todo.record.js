const { ObjectId } = require("mongodb");
const { todos } = require("../utils/db");

class TodoRecord {
  constructor(obj) {
    this._id = ObjectId(obj._id);
    this.title = obj.title;

    this._validate();
  }

  async insert() {
    const { insertedId } = await todos.insertOne({
      _id: this._id,
      title: String(this.title),
    });
    this._id = insertedId;

    return insertedId;
  }

  async delete() {
    await todos.deleteOne({
      _id: this._id,
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

  static async findAllWithCursor() {
    return todos.find();
  }

  async update() {
    await todos.replaceOne(
      {
        _id: this._id,
      },
      { title: String(this.title) }
    );
  }

  _validate() {
    if (this.title.trim() < 5) {
      throw new Error("Todo title should be at least 5 characters.");
    }

    if (this.title.length > 150) {
      throw new Error("Todo title should be at most 150 characters.");
    }
  }
}

module.exports = {
  TodoRecord,
};
