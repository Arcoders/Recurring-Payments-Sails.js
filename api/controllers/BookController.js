/**
 * BookController
 *
 * @description :: Server-side logic for managing Books
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	find: (req, res) => {
		Book.find({
			limit: 20,
			sort: 'creattedAt DESC'
		}).exec((err, docs) => {
			if (err) console.log(err);
			return res.view('books/index', {books: docs});
		});
	},

	update: (req, res) => {
		let datos = {};
		if (req.body.title) datos.title = req.body.title;
		if (req.body.description) datos.description = req.body.description;
		if (req.body.pages) datos.pages = req.body.pages;
		if (req.body.publishedAt) datos.publishedAt = req.body.publishedAt;

		req.file('book').upload({dirname: '../../books/files'}, (err, files) => {

			if(err) res.negotiate(err);
			if (files.length > 0) datos.pdfUrl = files[0].fd.split('\\').pop();

			Book.update({id: req.params.id}, datos).exec((err, libro) => {
				if(err) res.negotiate(err);
				res.view('books/show', {book: libro[0]});
			});

		});
	},

	create: (req, res) => {
		req.file('avatar').upload({dirname: '../../assets/images/books/avatars'}, (err, files) => {
			if (err) res.negotiate(err);
			let options = {
				title: req.body.title,
				description: req.body.description,
				pages: req.body.pages,
				publishedAt: req.body.publishedAt
			};
			if (files.length > 0) {
				options.avatarUrl = files[0].fd.split('\\').pop();
			}
			Book.create(options, (err, newBook) => {
				if (err) console.log(err);
				res.redirect('/book/' + newBook.id);
			});
		});
	},

	new: (req, res) => {
		return res.view('books/new');
	},

	findOne: (req, res) => {
		Book.findOne({id: req.params.id}).exec((err, book) => {
			if (err) console.log(err);
			return res.view('books/show', {book: book});
		});
	},

	edit: (req, res) => {
		Book.findOne({id: req.params.id}).exec((err, book) => {
			if (err) console.log(err);
			return res.view('books/edit', {book: book});
		});
	},

	delete: (req, res) => {
		Book.findOne({id: req.params.id}).exec((err, book) => {
			if (err) console.log(err);
			return res.view('books/delete', {book: book});
		});
	},

	destroy: (req, res) => {
		Book.destroy({id: req.params.id}).exec(err => {
			res.redirect('/book');
		});
	}

};
