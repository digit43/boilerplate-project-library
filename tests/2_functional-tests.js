/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Books = require('../book-model');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
    
      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .post("/api/books")
          .type("form")
          .send({
            title: "test chai title",
          })
          .end(function(err, res) {
            bookid = res.body._id;
            assert.equal(res.status, 200, "Response status always 200");
            assert.property(res.body, '_id', "Response object contains _id property.");
            assert.property(res.body, "title", "Response object contains title property");
            assert.property(res.body, "comments", "Response object contains comments property");
          });
        done();
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post("/api/books")
          .type("form")
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200, "Response status is always 200.");
            assert.isString(res.body, "value is string");
            assert.equal(res.body, "missing required field title");
          })
        done();
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .get('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 200, "Response status is always 200.");
            assert.isArray(res.body, "Response is array of objects");
            assert.isAtLeast(res.body.length, 1);
          })
        done();
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){

      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .get('/api/books/6275002567d24e253ab10208')
          .end(function(err, res) {
            assert.equal(res.status, 200, "Response status is always 200.");
            assert.equal(res.body, "no book exists");
          });
        done();
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){

        chai
          .request(server)
          .get(`/api/books/62750461e28a434df3f4ea40`)
          .end(function(err, res) {
            assert.equal(res.status, 200, "Response status is always 200.");
            assert.include(res.body, {
              _id: "62750461e28a434df3f4ea40",
              title: "Deletable Book",
            });
          });
        done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        const book = new Books({
          title: "test comment title chai",
        });
        book.save(function(err, doc) {
          chai
            .request(server)
            .post(`/api/books/${String(doc._id)}`)
            .type("form")
            .send({
              comment: "test comment chai",
            })
            .end(function(err, res) {
              assert.equal(res.status, 200, "Response always 200.");
              // console.log(res.body)
              // assert.include(res.body, {
              //   comments: ["test comment chai"],
              // });
            })
        });
        done();
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        const book = new Books({
          title: "test chai add without comment"
        });

        book.save(function(err, doc) {
          chai
            .request(server)
            .post(`/api/books/${String(doc._id)}`)
            .type("form")
            .send({
              comment: ""
            })
            .end(function(err, res) {
              assert.equal(res.status, 200, "Response always 200");
              assert.equal(res.body, "missing required field comment");
            });
          done();
        });

      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
          .request(server)
          .post("/api/books/6275002567d24e253ab10208")
          .type("form")
          .send({
            comment: "test comment chai"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200, "Response status is always 200.");
            assert.equal(res.body, "no book exists");
          })
        done();
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){

        const book = new Books({
          title: "delete title chai 2",
        })
        book.save(function(err, doc) {
          chai
            .request(server)
            .delete(`/api/books/${String(doc._id)}`)
            .end(function(err, res) {
              assert.equal(res.status, 200, "Response status is always 200.");
              assert.equal(res.body, "delete successful");
            })
          done();
        });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
          .request(server)
          .delete("/api/books/6275002567d24e253ab10208")
          .end(function(err, res) {
            assert.equal(res.status, 200, "Response is always 200.");
            assert.equal(res.body, "no book exists");
          })
        done();
      });

    });

  });

});
