module.exports = {
        home: function(req, res) {

            let findBookPromise = Book.find({
                limit: 20,
                sort: "createAt DESC"
            });

            let userSubscriptionPromise = req.user.subscription();

            Promise.all([findBookPromise, userSubscriptionPromise])
                   .then(([books, subscription]) => {
                       res.view('homepage', {books: books, subscription: subscription});
                   }).catch(err => {
                       res.negotiate(err);
                   });
        }
};
