module.exports = {

    new: (req, res) => {
        res.view('plans/new');
    },

    find: (req, res) => {
        Plan.find({}).then(docs => {
            res.view('plans/index', {plans: docs});
        }).catch(err => {
            console.log(err);
            res.redirect('/');
        });
    },

    destroy: (req, res) => {
        Plan.findOne({id: req.params.id}).then(plan => {
            plan.destroy();
            res.redirect('/plan');
        });
    }

};
