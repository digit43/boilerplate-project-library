/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Books = require('../book-model');
const Comments = require('../comment-model');

module.exports = function (app) {
  
  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const books = await Books.find({});
      
      const response = books.map(item => {
        return {
          _id: item._id,
          title: item.title,
          commentcount: item.hasOwnProperty('commentcount') ? item.commentcount : 0,
        }
      })

      res.json(response);
    })
    
    .post(async function (req, res){
      // let title = req.body.title;
      //response will contain new book object including atleast _id and title

      const { title } = req.body;
      
      if (!title) {
        res.json("missing required field title")
      } else {
        const book = new Books({
          title,
        });

        try {
          const doc = await book.save();
          res.json({
            _id: doc._id,
            title: doc.title,
          });
        } catch(err) {
          console.log(err);
          res.sendStatus(500);
        }
      }
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      try {
        const result = Books.deleteMany({});
        res.json("complete delete successful");
      } catch(err) {
        console.log(err);
        res.sendStatus(500);
      }
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      // console.log(bookid)
      Books
        .findOne({ _id: req.params.id})
        .populate('comments')
        .exec(function (err, doc) {
          if (err) {
            console.log(err)
          } else {
            if (!doc) {
              res.json("no book exists");
            } else {
              const response = {
                title: doc.title,
                _id: doc._id,
                comments: doc.comments.map( item => item.comment_text ),
              };
              res.json(response);
            }
          }
        });
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment_text = req.body.comment;
      //json res format same as .get
      
      if (!comment_text) {
        res.json("missing required field comment");
      } else {
        try {
          const doc = await Books.findOne({_id: bookid});

          if (!doc) {
            
            res.json("no book exists");
          } else {
            
            const comment = new Comments({
              comment_text: comment_text,
              book_id: doc._id,
            });
      
            try {
              const doc = await comment.save();
              
              const response = await Books.findOneAndUpdate(
                  {_id: bookid},
                  { $push: { comments: doc._id } },
                  { new: true }
                )
                .populate('comments')
                .exec(function(err, book) {
                  
                  res.json({
                    title: book.title,
                    _id: book._id,
                    comments: book.comments.map(item => item.comment_text),
                  });
                });

            } catch (err) {
              console.log(err);
              res.sendStatus(500);
            }
          }

        } catch(err) {
          console.log(err);
          res.json(err);
        }
      }
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      const result = await Books.deleteOne({_id: bookid});

      if (result.deletedCount === 1) {
        res.json("delete successful");
      } else {
        res.json("no book exists");
      }
      
    });
  
};
