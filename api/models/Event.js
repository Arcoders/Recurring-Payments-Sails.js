function getStatus(eventType) {
    let status = 'created';
    if (eventType == 'invoice.payment_failed')
        status = 'failed';
    if (eventType == 'invoice.payment_succeeded')
        status = 'payed';
    return status;
}

module.exports = {

        attributes: {
            stripeId: {
                type: 'string',
                required: true,
                unique: true
            },
            stripeType: {
                type: 'string',
                required: true
            },
            data: {
                type: 'json'
            }
        },

        afterCreate: (event, callback) => {
            if (event.stripeType.includes('invoice.')) {
                let invoiceJSON = event.data.object;
                let invoiceUpdatedPromise = Invoice.findOrUpdate({stripeId: invoiceJSON.id}, {
                    stripeId: invoiceJSON.id,
                    amount: invoiceJSON.total,
                    stripeSubscriptionId: invoiceJSON.subscription,
                    stripeCustomerId: invoiceJSON.customer,
                    periodStart: invoiceJSON.period_start,
                    periodEnd: invoiceJSON.period_end,
                    nextPayament: invoiceJSON.next_payment_attempt,
                    status: getStatus(event.stripeType)
                });
                let subscriptionUpdatePromise = Subscription.updateFromRemote(invoiceJSON.subscription);
                Promise.all([invoiceUpdatedPromise, subscriptionUpdatePromise])
                       .then(([inv, subs]) => callback())
                       .catch(callback);
            }
        }

};
