# MemAssist
Memory Assist HackIllinois 2017

MemAssist is a caretaker assistant device implemented on Amazon Echo to assist caretakers keep track of their patients suffering from memory loss.

Features:

+Keeps track of medication patients need to take, and can remind patients to take them, as well as alert caretakers

+Caretakers may input the list of medicine the patients need to take on a daily bases once, and the system will remember.

Coming Soon:

+We seek to use the Twilio library to be able to automatically schedule calls with relatives. This is especially important because patients suffering from memory loss need social interaction to slow down the memory loss.

+We seek to link to a medical database to support a much greater number of drug names

+Enhaunced functionality so a caretaker can input a list of medication once and the patient can input his medications as he takes them, and the list will keep track each day if the patient has taken all the required medication, and provide a notification if the patient fails to take all the required medication

Build Instructions:

1) Create Amazon Work Station account

2) Create a new lambda function

3) Select blank function

4) Make sure region is set to U.S. East, North Virginia, and add ALexa Skills Kit as the trigger

5) Name function, set runtime to Node.js 4.3

6) Copy Caretaker.js over to the Lambda function conde space. (make sure Code entry type is Edit code inline)

7) set existing role to servise-role/role, click next on page bottom

8) Create function, take note of ARN in top right corner

9) Log into Amazon Developer Console (same account as for AWS)

10) Click on Alexa tab

11) Choose "Get Started" under Alexa skills kit

12) Add a new skill

13) Set name and invocation name to Butler
 
14) In Intent Schema copy over intentSchema.json, add a slot type corresponding to medicines.txt, and in Sample Utterances copy over utterances.txt

15) Configure service endpoint to be AWS Lambda ARN, pich a region, and copy over ARN.

16) Once Interaction model has finished compiling, you are ready to test the skill.

17) to run skill, link amazon device with the Alexa phone app, then say "Alexa, open butler"



Contributors

https://github.com/MemoryRemind/MemAssist/blob/master/CONTRIBUTION.md



MIT License

Copyright (c) 2017 Ferris Dweik, Richard Nai, Timothy Xiang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
