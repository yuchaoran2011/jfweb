Survey.Survey.cssType = "bootstrap";

var surveyJSON = {pages:[
	{elements:[
		{
	     "type": "checkbox",
	     "choices": [
	      "Person",
	      "Group",
	      "State",
	      "Object",
	      "Facility"
	     ],
	     colCount:4,
	     "isRequired": true,
	     "name": "Does this case have to do with a/an____?"
	    },
	    {
	     "type": "checkbox",
	     "choices": [
	      "Formal documents",
	      "Blogs",
	      "Journal magazine abstract",
	      "News extract",
	      "Images",
	      "Photos-People",
	      "Photos-Artifacts",
	      "Maps",
	      "Drawings",
	      "Video clip",
	      "Audio",
	      "Statistical references",
	      "Social media content(FB,Twitter,Linkedin)"
	     ],
	     colCount: 2,
	     isRequired: true,
	     "name": "Does this case contain ___?"
	    },
	    {
	     "type": "checkbox",
	     "choices": [
	      "Military",
	      "Economic",
	      "Socialogical",
	      "Leadership analysis",
	      "Political",
	      "Geography/mapping",
	      "Counter-intelligence"
	     ],
	     colCount: 3,
	     isRequired: true,
	     name: "Does the reasoner need to be knowledgeable in ___ to solve this case"
	    },
	    {
	     "type": "checkbox",
	     "choices": [
	      "Imagery intelligence data",
	      "Open-source intelligence data",
	      "Measurement and Signature Intelligence",
	      "Hunman-source intelligence",
	      "Geospatial intelligence"
	     ],
	     colCount: 2,
	     isRequired: true,
	     name: "Does this case have ___ type of intelligence data?"
	    },
	    {
	     "type": "checkbox",
	     "choices": [
	      "Difficulties in getting information",
	      "Situation evolvement",
	      "External forces",
	      "Cross-disciplinary materials"
	     ],
	     colCount:2,
	     "isRequired": true,
	     "name": "Does this case have ____?"
	    },],name:"page1"},


	{elements:[
		{
	     "type": "checkbox",
	     "choices": [
	      "Future investigation",
	      "Retrospective investigation",
	      "Subject matter familiarity",
	      "Case framework familiarity",
	      "Tactical type of thinking",
	      "Strategic type of thinking",
	      "A single factual answer, given the right information",
	      "Systems of dependencies that do not produce a single answer"
	     ],
	     colCount:1,
	     isRequired:true,
	     name:"Does this case require _____?"},
		{
		type:"checkbox",
		choices: [
		"Identify a person (Who is this?)",
		 "Identify location of an object/person/facility (Where is it?)",
		 "What is an object/facility used for? Who has it? Who is trying to get it?",
		 "What just happened? Who did it?"
		 ],
		 colCount:1,
 		 isRequired:true,
		 name:"Does the reasoner have to answer _____ type of identification question?"},

		{
		type:"checkbox",
		choices:[
		"Who's in charge? ",
		"Who's in conflict?",
		"What kinds of vulnerabilities does this state, group, facility or person have?",
		"What are the strengths/capabilities of this state, group or person with respect to us?",
		"What are the needs of this state, group or person with respect to us?",
		"What is this state/group/person capable of?",
		"What can we do in regards of this state/group/person?"
		],
		colCount:1,
		isRequired:true,
		name:"Does the reasoner have to answer _____type of strengths and vulnerabilities assessment question?"
		},
		{
		type:"checkbox",
		choices:[
		"How will a certain situation evolve?",
		"What are the goals/intentions of certain persons/groups/state?",
		"What can we expect in this person, group, or state(s)?",
		"Prediction of action",
		"Effects of intervention",
		],
		colCount:1,
		isRequired:true,
		name:"Does the reasoner have to answer _____type of calculation question?"
		}

		],name:"page2"}]}

function sendDataToServer(survey) {
    survey.sendResult('ef044d84-e0c1-4f92-81af-61f523cc1cdf');
}

var myCss = {
    checkbox: {root: "table table-striped"},
    navigationButton: "button btn-lg"   
};


var survey = new Survey.Model(surveyJSON);
$("#surveyContainer").Survey({
    model: survey,
    onComplete: sendDataToServer
});