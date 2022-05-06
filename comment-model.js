const mongoose = require('mongoose');

const {Schema} = mongoose;

const CommentSchema = new Schema({
  comment_text: String,
  book_id: {type: Schema.Types.ObjectId, ref: "Books"},
});

const Comments = mongoose.model("Comments", CommentSchema);

module.exports = Comments;