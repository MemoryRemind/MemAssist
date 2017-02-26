const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

var params = {
		Item: {
			medicine: [],
			userID: 1
			    
		},
		TableName: 'medicalinfo',
		Key: {
			    "userID": 1
			}

	};

exports.handler = function(event, context, callback) {
	
	// Initialize variables
	
	/*let params = {
		TableName: 'medicalinfo',
		Key: {
			"userID": "one";
		}
	};*/

	docClient.get(params, function(err,data){
		if(err){
			callback(err,null);
		}else{
			callback(null,data);
		}
	});

	var sendString = "";



	// Try catch is for potential errors in code
	try {

		if (event.session.new) {
			// New Session
			console.log("NEW SESSION")
		}

		switch (event.request.type) {

			case "LaunchRequest":
				// Launch Request *** called if only invocation is called
				console.log('LAUNCH REQUEST')
				context.succeed(
					generateResponse(
						{},
						buildSpeechletResponse(
							"Hello, my name is Butler, I am here to assist you in your daily needs.",false)
					)
				)
				break;



			case "IntentRequest":
				// Intent Request *** called if specified call is made to intent
				console.log('INTENT REQUEST')

				//checks specific intent requests
				switch(event.request.intent.name) {
				
					case "StoreMedicineInfo": 
					/*	docClient.get(params, function(err,data){
							if(err){
								callback(err,null);
							}else{
								callback(null,data);
						}
						});*/
					    //console.log("you are here");
					    params.Item.medicine[params.Item.medicine.length] = event.request.intent.slots.Drugs.value;
						//medicine[medicine.length] = event.intent.slots.Drugs.value;
						//console.log("you are leaving");
						for(var i = 0; i < params.Item.medicine.length - 1; i++) {
							sendString += params.Item.medicine[i] + " and ";
						}
						sendString += params.Item.medicine[params.Item.medicine.length-1];
						context.succeed(
							generateResponse(
								{},
								buildSpeechletResponse(sendString,false)
							)
						)
						docClient.put(params, function(err, data) {
	                    	if(err) {
                			callback(err, null);
                    		}else {
                    			callback(null, data);
	                    	}
	                        });
						break;

					case "GetMedicineInfo":
						docClient.get(params, function(err,data){
							if(err){
								callback(err,null);
							}else{
								callback(null,data);
							}
						});
						for(var i = 0; i < params.Item.medicine.length - 1; i++) {
							sendString += params.Item.medicine[i] + " and ";
						}
						sendString += params.Item.medicine[params.Item.medicine.length-1];
						context.succeed(
							generateResponse(
								{},
								buildSpeechletResponse(sendString,false)
							)
						)
						break;

					case "DeleteMedicineInfo":
						docClient.get(params, function(err, data){
							docClient.get(params, function(err,data){
							if(err){
								callback(err,null);
							}else{
								callback(null,data);
							}
						});

						let d = params.Item.medicine.indexOf(event.request.intent.slots.Drugs.value);

						let n = [];

						let delted = params.Item.medicine[d];

						for (var i = 0; i < params.Item.medicine.length; i++) {
							if (i != d) n.push(params.Item.medicine[i]);
						}

						params.Item.medicine = n;

						docClient.put(params, function(err, data) {
	                    	if(err) {
                			callback(err, null);
                    		}else {
                    			callback(null, data);
	                    	}
	                    });

	                    context.succeed(
							generateResponse(
								{},
								buildSpeechletResponse("Deleted " + deleted, false)
							)
						)

					default:
					    context.succeed(
							generateResponse(
								{},
								buildSpeechletResponse("I'm sorry. I do not understand. Please try again",true)
							)
						)
						//throw "Invalid intent"
				}

				break;



			case "SessionEndedRequest":
				// Session Ended Request *** called if code is exited
				console.log('SESSION ENDED REQUEST')
				break;

			default:
				context.fail('INVALID REQUEST TYPE: ${event.request.type}')
		}



	} catch(error) { context.fail('Exception: ${error}') }
	
//}
}

// Helpers
buildSpeechletResponse = (outputText, shouldEndSession) => {

	return {
		outputSpeech: {
			type: "PlainText",
			text: outputText
		},
		shouldEndSession: shouldEndSession
	}
}

/*buildSpeechletResponse = (title, output, repromptText, shouldEndSession) => {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession: shouldEndSession,
    };
}*/

generateResponse = (sessionAttributes, speechletResponse) => {

	return {
		version: "1.0",
		sessionAttributes: sessionAttributes,
		response: speechletResponse
	}
}
