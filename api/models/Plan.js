let stripe = require('stripe')('sk_test_kLHTuR3If28OnfukayEe5C1n');

module.exports = {

    attributes: {
        name: {
            type: 'string',
            required: true
        },
        amount: {
            type: 'integer',
            required: true
        },
        interval: {
            type: 'string',
            required: true
        },
        stripe_valid: {
            type: 'boolean',
            defaultsTo: false
        }
    },

    afterDestroy: (plansDeleted, callback) => {
        stripe.plans.del([plansDeleted[0].id], (err, confirm) => {
            if (err) console.log(err);
            callback();
        });
    },

    afterCreate: (plan, callback) => {
        stripe.plans.create({
            amount: plan.amount,
            interval: plan.interval,
            name: plan.name,
            id: plan.id,
            currency: 'EUR'
        }, (err, stripe_plan) => {
            if (err) {
                console.log(err);
                callback();
            }else{
                Plan.update({id: plan.id}, {stripe_valid: true}).exec(callback);
            }
        });
    }

};
