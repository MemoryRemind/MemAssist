exports.handler = (event, context) => {
	
	// Initialize variables
	var medicine = ["Aricept","Exelon","Razadyne"];
	var medicineTaken = [];
	var sendString = "";
    var tookMedicine = false
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
							"Welcome to Ferris' example Alexa. This runs on Lambda",true)
					)
				)
				break;

			case "IntentRequest":
				// Intent Request *** called if specified call is made to intent
				console.log('INTENT REQUEST')

				switch(event.request.intent.name) {
					case "StoreMedicineInfo": 
                        
						break;
                    
                                
                    case "TookMedicine":
                        sendString = tookMedicine? "You have taken your medicine": "You have not taken your medicine"
                        context.succeed(
				generateResponse(
				{},
				buildSpeechletResponse(sendString,true)
				)
			)
			break;
                    
                    case "UpdateMedicine":
                        var index = event.sessionAttributes.size();//NOTE replace with array struct
                        for(; index >0; index --){
                            medicineTaken.add(sessionAttributes[index]); //TODO replace pseudocode
                        }
                        sendString = "You have currently taken ";
                        for(; index < medicineTaken.length; index++){
                            if(index == medicineTaken.length-1)
                            sendString += "and ";
                            sendString += medicineTaken[index] + " ";
                        }
                        
                        context.succeed(
				generateResponse(
					{},
					buildSpeechletResponse(sendString,true)
					)
				)
                        
                    break;
                    
					case "GetMedicineInfo":
						console.log('You reached here')

						for(var i = 0; i < medicine.length; i++) {
							console.log('Now you are here')
							sendString += medicine[i] + " and ";
						}
						sendString += medicine[medicine.length-1];
						context.succeed(
							generateResponse(
								{},
								buildSpeechletResponse(sendString,true)
								//buildSpeechletResponse('You must take ${sendString}',true)
							)
						)
						break;

					default:
						throw "Invalid intent"
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

generateResponse = (sessionAttributes, speechletResponse) => {

	return {
		version: "1.0",
		sessionAttributes: sessionAttributes,
		response: speechletResponse
	}
}
