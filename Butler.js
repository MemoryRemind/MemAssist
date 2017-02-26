/*
This is Butler, the voice-activated Alexa skill created to add convenience and reliability to the lives of
patients, elderly, and everyone else around. The purpose of Butler is to assist patients and elderly to 
live their lives with someone who is always there to help with any medical need. We have started by
implementing the first function, tracking medicine and intake of the individual. For more information and
ideas, check the github page: https://github.com/MemoryRemind/MemAssist and also feel free to message the 
developers. This project is open-sourced and it is encouraged to commit to the project. REMEMBER, even 
changing one line of code is immensely helpful.
*/

// Initializes values to access DynamoDB database (used for storing medical information)
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});


// Initializes params with blank page and reference key to database (used for holding database values)
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


// This is the code used when Alexa accesses Butler
exports.handler = function(event, context, callback) {
	
	//replaces params with values pulled from database
	docClient.get(params, function(err,data){
		if(err){
			callback(err,null);
		}else{
			callback(null,data);
		}
	});

	// String used for sending output to Alexa
	var sendString = "";
    


	// Try catch is for potential errors in code
	try {


		// Logs if Alexa has accessed Butler
		if (event.session.new) {
			// New Session
			console.log("NEW SESSION")
		}

		// Executes command based on type of request
		switch (event.request.type) {

			// Executes if launched using only Butler name
			case "LaunchRequest":

				console.log('LAUNCH REQUEST')

				// Outputs string to Alexa
				context.succeed(
					generateResponse(
						{},
						buildSpeechletResponse(
							"Hello, my name is Butler, I am here to assist you in your daily needs.",false)
					)
				)
				break;

			// Executes if specific request is made
			case "IntentRequest":

				console.log('INTENT REQUEST')

				// Initializes check duplicates
                var noDuplicateDrugFlag = true;


				// Switch executes based on specific request
				switch(event.request.intent.name) {
				
					// Stores new medicines
					case "StoreMedicineInfo": 

						// Retrieves most updated params values
					    docClient.get(params, function(err,data){
							if(err){
								callback(err,null);
							}else{
								callback(null,data);
							}
						});

						// Prepares sendString to be sent to Alexa if there is a duplicate
					    for(var i = 0; i< params.Item.medicine.length; i++){
					        if(params.Item.medicine[i]==event.request.intent.slots.Drugs.value){
					        sendString = "You have already added the drug " + event.request.intent.slots.Drugs.value;
					        context.succeed(
						       	generateResponse(
						       		{},
							       	buildSpeechletResponse(sendString,false)
					        		)
    		    				)
        					noDuplicateDrugFlag = false;
        					break;
					        }
					    }

						// Adds start of sentence for Alexa output
					    if(noDuplicateDrugFlag){
					    sendString = "You need to take "
					    
					 	// Pulls newest value from user input and adds to params
					    params.Item.medicine[params.Item.medicine.length] = event.request.intent.slots.Drugs.value;

					    // Prepares sendString for output to Alexa
						for(var i = 0; i < params.Item.medicine.length - 1; i++) {
							sendString += params.Item.medicine[i] + " ";
						}
						if(params.Item.medicine.length!=1)
						sendString += "and ";
						sendString += params.Item.medicine[params.Item.medicine.length-1];

						// Outputs string to Alexa
						context.succeed(
							generateResponse(
								{},
								buildSpeechletResponse(sendString,false)
							)
						)
 
						// Updates values in database with new values gotten
						docClient.put(params, function(err, data) {
	                    	if(err) {
                			callback(err, null);
                    		}else {
                    			callback(null, data);
	                    	}
	                        });
					    }
						break;

					// Outputs all medicine needed to take
					case "GetMedicineInfo":

						// Gets newest values for params
						docClient.get(params, function(err,data){
							if(err){
								callback(err,null);
							}else{
								callback(null,data);
							}
						});

						// Prepares string to be sent to Alexa
						sendString = "You need to take ";
						for(var i = 0; i < params.Item.medicine.length - 1; i++) {
							sendString += params.Item.medicine[i] + " ";
						}
						if(params.Item.medicine.length!=1)
						sendString += "and ";
						sendString += params.Item.medicine[params.Item.medicine.length-1];
						if(params.Item.medicine.length==0)
						sendString = "You do not need any medications";

						// Outputs string to Alexa to say
						context.succeed(
							generateResponse(
								{},
								buildSpeechletResponse(sendString,false)
							)
						)
						break;
                    
                    // Deletes medicine taken or not needed anymore
                    case "DeleteMedicineInfo":

                    	// Retrieves newest values from database for params
						docClient.get(params, function(err, data) {
							if(err){
								callback(err,null);
							}else{
								callback(null,data);
							}
						});

						// Initialized values for saving input and checking current medicine
						var d = params.Item.medicine.indexOf(event.request.intent.slots.Drugs.value);

						var n = [];

						var deleted = params.Item.medicine[d];

						// Returns medicine to params if not equal to user input
						for (var j = 0; j < params.Item.medicine.length; j++) {
							if (j != d) n.push(params.Item.medicine[j]);
						}

						// Outputs string to Alexa to say if medicine was removed or not
                        if (n.length==params.Item.medicine.length){
                            deleted = "You are not taking that medication";
                            context.succeed(
							    generateResponse(
								{},
								buildSpeechletResponse(deleted, false)
							    )
						    )
                        }
                        
                        else{
						params.Item.medicine = n;

						docClient.put(params, function(err, data) {
	                    	if(err) {
                			callback(err, null);
                    		} else {
                    			callback(null, data);
	                    	}
	                    });
                        deleted = "I have removed " + deleted + " from the list of drugs you need"

                        // Outputs string to Alexa
	                    context.succeed(
							generateResponse(
								{},
								buildSpeechletResponse(deleted, false)
							)
						)
                        }
			            break;
                    
                    // Default command if none are said is to try again
					default:
					    context.succeed(
							generateResponse(
								{},
								buildSpeechletResponse("I'm sorry. I do not understand. Please try again",false)
							)
						)
				}
				break;


			// Called when session is ending
			case "SessionEndedRequest":

				console.log('SESSION ENDED REQUEST')

				// Outputs string to Alexa
				context.succeed(
							generateResponse(
								{},
								buildSpeechletResponse("Shutting down",true)
							)
						)
				break;

			// Default if no types of sessions are called
			default:

				// Outputs failure of code
				context.fail('INVALID REQUEST TYPE: ${event.request.type}')
		}



	} catch(error) { context.fail('Exception: ${error}') }  //catches error and outputs error

}

// Helper functions for program

// Builds the output test and determines whether session will end after command
buildSpeechletResponse = (outputText, shouldEndSession) => {

	return {
		outputSpeech: {
			type: "PlainText",
			text: outputText
		},
		shouldEndSession: shouldEndSession
	}
}


// Generates general information and outputs response to Alexa
generateResponse = (sessionAttributes, speechletResponse) => {

	return {
		version: "1.0",
		sessionAttributes: sessionAttributes,
		response: speechletResponse
	}
}
