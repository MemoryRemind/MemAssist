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
                    
                    case "UpdateMedicine": //FIXME variables
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

//Copied from https://github.com/bignerdranch/developing-alexa-skills-solutions/blob/master/3_sessionsAndVUI/solution/madlibbuilder/index.js
//see https://github.com/bignerdranch/developing-alexa-skills-solutions/blob/master/3_sessionsAndVUI/solution/madlibbuilder/madlib_helper.js
//https://github.com/bignerdranch/developing-alexa-skills-solutions/blob/master/coursebook/mlbPersistence_Chapter.pdf
/*skillService.intent("madlibIntent", {
    "slots": {
        "STEPVALUE": "STEPVALUES"
    },
    "utterances": ["{new|start|create|begin|build} {|a|the} madlib", "{-|STEPVALUE}"]
},

function (request, response) {
      var stepValue = request.slot("STEPVALUE");
      var madlibHelper = getMadlibHelper(request);
      madlibHelper.started = true;
      if (stepValue !== undefined) {
          madlibHelper.getStep().value = stepValue;
      }
      if (madlibHelper.completed()) {
          var completedMadlib = madlibHelper.buildMadlib();
          response.card(madlibHelper.currentMadlib().title, completedMadlib);
          response.say("The madlib is complete! I will now read it to you. " + completedMadlib);
          response.shouldEndSession(true);
      } else {
          if (stepValue !== undefined) {
              madlibHelper.currentStep++;
          }
          response.say("Give me " + madlibHelper.getPrompt());
          response.reprompt("I didn't hear anything. Give me " + madlibHelper.getPrompt() + " to continue.");
          response.shouldEndSession(false);
      }
      response.session(MADLIB_BUILDER_SESSION_KEY, madlibHelper);
  }*/

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
