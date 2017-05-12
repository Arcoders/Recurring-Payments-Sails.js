
module.exports = (req, res, next) => {
    if (req.user && req.user.admin) return next();
    return res.redirect('/');
};
