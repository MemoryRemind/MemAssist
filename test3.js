exports.handler = (event, context) => {
	console.log("hi")
	// Initialize variables
	
	var sendString = "";
//while(1==1) {
	// Try catch is for potential errors in code
	try {

		if (event.session.new) {
			// New Session
			var medicine = [];
			var meds = "You need ";
			console.log("NEW SESSION")
		}
        else{
            //medicine=response.sessionAttributes.medicine;
            
        }
		switch (event.request.type) {

			case "LaunchRequest":
				// Launch Request *** called if only invocation is called
				console.log('LAUNCH REQUEST')
				context.succeed(
					generateResponse(
						{},
						buildSpeechletResponse(
							"Hello, my name is Butler, I am here to assist your daily needs.",false)
					)
				)
				break;



			case "IntentRequest":
				// Intent Request *** called if specified call is made to intent
				console.log('INTENT REQUEST')

				//checks specific intent requests
				switch(event.request.intent.name) {
				
					case "StoreMedicineInfo": 
					    //console.log("you are here");
					    //medicine = sessionAttributes.medicine;
					    //alert(medicine.length.toString());
					    //medicine[medicine.length] = event.request.intent.slots.Drugs.value;

						//console.log("you are leaving");
						//for(var i = 0; i < medicine.length - 1; i++) {
							sendString ="You need to take " + event.request.intent.slots.Drugs.value;
							//medicine.push(event.request.intent.slots.Drugs.value);
							meds+=event.request.intent.slots.Drugs.value;
							//askWithCard("What are you taking?", "What are you taking", cardTitle, cardContent)
						//}
						//sendString += medicine[medicine.length-1];
						context.succeed(
							generateResponse(
								{medicine},
								buildSpeechletResponse(sendString,false)
							)
						)
						break;

					case "GetMedicineInfo":
						//for(var i = 0; i < medicine.length - 1; i++) {
						//	sendString += medicine[i] + " and ";
						//}
						//sendString += medicine[medicine.length-1];
						context.succeed(
							generateResponse(
								{medicine},
								buildSpeechletResponse(meds,false)
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
