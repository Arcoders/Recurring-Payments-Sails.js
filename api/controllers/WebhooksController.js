let stripe = require('stripe')('sk_test_kLHTuR3If28OnfukayEe5C1n');

module.exports = {

        create: (req, res) => {
            stripe.events.retrieve(req.body.id, (err, ev) => {

            //   if (err) return res.send(401);

                Event.findOrCreate({stripeId: req.body.id}, {
                    stripeId: req.body.id,
                    stripeType: req.body.type,
                    data: req.body.data
                }).then(event => res.send(200)).catch(err => res.negotiate(err));

            });
        }

};
