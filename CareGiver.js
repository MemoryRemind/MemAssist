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
							"Welcome to Ferris' example Alexa. This runs on Lambda",true)
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

handleIntent = (request, session, callback) => {
	console.log(`onIntent requestId=${intentRequest.requestId},
										sessionId=${session.sessionId}`);
	const intent = intentRequest.intent;
	const intentName = intent.name;

	if (intentName == /* INTENT NAME HERE */) {
		// call intent function
		// function(intent, session, callback) or
		// function(callback)
	} else if (intentName === 'AMAZON.HelpIntent') {
        // function here
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        // function here
    } else {
        throw new Error('Invalid intent');
    }

}