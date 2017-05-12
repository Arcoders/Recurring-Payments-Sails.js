/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

let bcrypt = require('bcrypt-as-promised');
let stripe = require('stripe')('sk_test_kLHTuR3If28OnfukayEe5C1n');


module.exports = {

  attributes: {
      email: {
          type: 'string',
          required: true,
          unique: true
      },
      password: {
          type: 'string',
          required: true
      },
      admin: {
          type: 'boolean',
          defaultsTo: false
      },
      customer_id: {
          type: 'string'
      },
      subscription: function() {
          return new Promise((resolve, reject) => {
              Subscription.findOne({user: this.id, sort:"createAt DESC"})
                          .then(subscription => {
                              if (subscription) return resolve(subscription);
                              return resolve(null);
                          }).catch(reject);
          });
      }
  },

  createCustomer: opts => {

      return new Promise((resolve, reject) => {
          stripe.customers.create({
              description: 'Cliente ' + opts.user.email,
              source: opts.token
          }, (err, customer) => {
              if (err) {
                  console.log(err);
                  reject(err);
              }else{
                  User.update({id: opts.user.id}, {customer_id: customer.id}).exec(resolve);
              }

          });
      });

  },

  beforeCreate : (user, callback) => {

      let bcryptPromise = bcrypt.hash(user.password, 10);
      let userCountPromise = User.count({});

      Promise.all([bcryptPromise, userCountPromise]).then(([hash, count]) => {
          user.password = hash;
          user.admin = count === 0;
          callback();
      }).catch(callback);


  }

};
