module.exports = {

    find: (req, res) => {
        User.find({sort: 'createdAt DESC'}).then(users => {
            return res.view('users/index', {users: users});
        }).catch(err => {
            console.log('Error - user - find');
            return res.redirect('/');
        });
    },

    admin: (req, res) => {
        User.findOne({id: req.params.id}).then(user => {
            user.admin = req.body.admin == '1';
            user.save().then(() => res.redirect('/user'));
        }).catch(err =>{
            console.log('Error - user - admin');
            return res.redirect('/');
        });
    }

};
