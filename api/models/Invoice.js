module.exports = {
	attributes:{
		stripeId: {
			type: 'string',
			required: true,
			unique: true
		},
		amount:{
			type: 'integer'
		},
		stripeSubscriptionId:{
			type: 'string'
		},
		stripeCustomerId:{
			type:'string'
		},
		subscription:{
			model:'subscription'
		},
		user:{
			model: 'user'
		},
		periodStart:{
			type:'integer'
		},
		periodEnd:{
			type:'integer'
		},
		nextPayment:{
			type: 'integer'
		},
		status:{
			type: 'string',
			defaultsTo: 'created'
		}
	},
	findOrUpdate:function(criteria,values){
		let self = this;

		return new Promise(function(resolve, reject){

			self.findOne(criteria).then(result=>{
				let promise;
				if(result){
					promise = self.update(criteria, values);
				}else{
					promise = self.create(values);
				}

				promise.then(resolve).catch(reject);
			}).catch(reject);


		});


	}
};
