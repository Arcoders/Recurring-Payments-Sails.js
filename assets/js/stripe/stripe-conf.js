Stripe.setPublishableKey('pk_test_cqTUjWIamRmF4rxQp0lknvSz');

function isValid(callback) {
    var data = {
        number: $("#card-number").val(),
        cvc: $("#cvc").val(),
        exp_month: $("#expiration-month").val(),
        exp_year: $("#expiration-year").val()
    };
    Stripe.card.createToken(data, callback);
}

$("#submitBtn").on("click", function(ev) {
    ev.preventDefault();

    var $form = $('#paymentForm');

    isValid(function(status, response){
        if (response.error) {
            $form.find('.errors').text(response.error.message);
        }else{
            var token = response.id;
            $form.append($("<input type='hidden' name='stripeToken'>").val(token));
            $form.get(0).submit();
        }
    });

    return false;
});
