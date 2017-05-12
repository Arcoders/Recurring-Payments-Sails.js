let stripe = require('stripe')('sk_test_kLHTuR3If28OnfukayEe5C1n');

module.exports = {
    attributes: {
        user: {
            model: 'user'
        },
        plan: {
            model: 'plan'
        },
        status: {
            type: 'string',
            defaultsTo: 'inactive'
        },
        nextBilling: {
            type: 'date'
        },
        stripe_id: {
            type: 'string'
        },
        isValid: function() {
            return true;
        },
        isActive: function() {
            return this.isValid || this.status == 'past_due';
        }
    },

    updateFromRemote: stripeId => {
        return new Promise ((resolve, reject) => {
            stripe.subscriptions.retrieve(stripeId, (err, stripeSubscription) => {
                if (err) return reject(err);
                let updateSubPromise = Subscription.update({stripe_id: stripeId}, {
                    status: stripeSubscription.status
                }).then(resolve).catch(reject);
            });
        });
    },

    createAndStripe: opts => {
        return new Promise((resolve, reject) => {
            stripe.subscriptions.create({
                customer: opts.user.customer_id,
                plan: opts.plan.id
            }, (err, stripeSubscription) => {
                if (err) {
                    reject(err);
                }else{
                    Subscription.create({
                        plan: opts.plan,
                        user: opts.user,
                        stripe_id: stripeSubscription.id
                    }).then(sub => resolve(sub)).catch(err => reject(err));
                }
            });
        });
    }

};
