module.exports = {

    find: (req, res) => {
        Subscription.find({}).then(docs => {
            res.view('subscriptions/admin', {subscriptions: docs});
        });
    },

    landing: (req, res) => {
        Plan.find({stripe_valid: true}).then(plans => {
            res.view('subscriptions/index', {plans: plans});
        }).catch(err => {
            console.log(err);
        });
    },

    pay: (req, res) => {
        Plan.findOne({id: req.params.id}).then(plan => {
            res.view('subscriptions/pay', {plan: plan});
        }).catch(err => {
                console.log(err);
        });
    },

    create: (req, res) => {

        let findPlanPromise = Plan.findOne({id: req.body.planId});

        let customerCreatedPromise = User.createCustomer({
            user: req.user,
            token: req.body.stripeToken
        });

        Promise.all([findPlanPromise, customerCreatedPromise]).then(results => {
            let plan = results[0];
            let user = req.user;
            Subscription.createAndStripe({
                user: user,
                plan: plan
            }).then(sub => res.json(sub)).catch(err => {
                console.log(err);
                res.json(err);
            });
        });

    }

};
