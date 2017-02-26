exports.handler = (event, context, callback) => {
	
	//try catch is for potential errors in code
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
							event.request.intent.name,
							"Welcome to Ferris' example Alexa. This runs on Lambda",
							"", true)
						)
					)
				break;

			case "IntentRequest":
				// Intent Request *** called if specified call is made to intent
				console.log('INTENT REQUEST')
				context.succeed(
					handleIntent(event.request, event.session),
						(sessionAttributes, speechletResponse=>
							callback(null, buildResponse(sessionAttributes, speechletResponse));
						});
					);

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
buildSpeechletResponse = (title, outputText, repromptText, shouldEndSession) => {

	return {
		outputSpeech: {
			type: "PlainText",
			text: outputText
		},
		// Add for ability to communicate with phone app
		// card: {
        //     type: 'Simple',
        //     title: `SessionSpeechlet - ${title}`,
        //     content: `SessionSpeechlet - ${output}`,
        // },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
		shouldEndSession
	};
}

generateResponse = (sessionAttributes, speechletResponse) => {

	return {
		version: "1.0",
		sessionAttributes: sessionAttributes,
		response: speechletResponse
	}
}

handleIntent = (request, session, callback) => {
	console.log(`onIntent requestId=${intentRequest.requestId},
										sessionId=${session.sessionId}`);
	const intent = intentRequest.intent;
	const intentName = intent.name;

	// if (intentName == /* INTENT NAME HERE */) {
		// call intent function
		// function(intent, session, callback) or
		// function(callback)
	// }
	if (intentName == 'getInfo') {
		getInfo(intent, session, callback);
	} else if (intentName === 'AMAZON.HelpIntent') {
        // function here
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        // function here
    } else {
        throw new Error('Invalid intent');
    }

}


/// /  intents  / ///

getInfo = (intent, session, callback) => {
	const cardTitle = intent.name;
	const personSlot = intent.slots.Person;
	const endSession = false;
	const reprompt = '';
	let sessionAttributes = {};
	let response = '';

	if (personSlot) {
		const person = personSlot.value;

		response = '${person} is an American hero.';
	} else {
		response = 'Please specify a person.';
	}

	callback(sessionAttributes, buildSpeechletResponse(cardTitle,
				response, reprompt, endSession));
}

/// /           / ///