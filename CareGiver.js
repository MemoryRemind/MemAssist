exports.handler = (event, context) => {
	
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
