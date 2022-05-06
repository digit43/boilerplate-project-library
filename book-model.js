const mongoose = require('mongoose');

const { Schema } = mongoose;

const BooksSchema = new Schema({
  title: String,
  commentcount: Number,
  comments: [{type: Schema.Types.ObjectId, ref: "Comments"}],
});

const Books = mongoose.model("Books", BooksSchema);

module.exports = Books;