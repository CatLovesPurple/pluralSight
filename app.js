var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//bookAPI is the db name in mongodb
var db = mongoose.connect('mongodb://localhost/bookAPI');

var Book = require('./models/bookModel');

var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var bookRouter = express.Router();

bookRouter.route('/books')
	.post(function(req,res){
		var book = new Book(req.body);
		book.save();
		console.log(req.body);

		res.send(book);
	})
	.get(function(req, res){
		var query = {};
		if(req.query.genre){
			query.genre = req.query.genre;
		}

		Book.find(query, function(err, books){
			if(err){
				//internal server errors
				res.status(500).send(err);
			}
			res.json(books);

		});
	});

bookRouter.route('books/:bookId').get(function(req, res){
	Book.findById(req.params.bookId, function(err, book){
		if(err){
			//internal server errors
			res.status(500).send(err);
		}
		res.json(book);

	});
});
app.use('/api', bookRouter);

app.get('/', function(req, res){
	res.send("testing APIs");
});

app.listen(port, function(){
	console.log("i'm listening: " + port);
});