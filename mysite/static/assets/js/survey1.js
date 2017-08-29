Survey.Survey.cssType = "bootstrap";
Survey.defaultBootstrapCss.navigationButton = "btn btn-green";
Survey.defaultBootstrapCss.progressBar = "bar-green";

var num_questions = 9;
var start = Date.now();
var clicked_references = new Set();

// Durations spent on each question
var lastPage = 0;
var durations = [];
for (i=0; i<num_questions; i++) {
    durations.push(0.0);
}
var lastStartTime = Date.now();

$('a').click( function(e) {clicked_references.add(this.innerHTML); return true; } );


window.survey = new Survey.Model({ 
    title: "Please read the case and resources to answer the questions",
    pages: [
        { questions: [
                {type:"checkbox", name:"1", title: "Does this case have to do with a/an____?", colCount:4, isRequired: true,
                    choices:["Person","Group","State","Object","Facility"]}
            ]},

       	{
            questions: [
            {type:"checkbox", name:"2",title: "Does this case contain ___?",
                 colCount: 2, isRequired: true,
                choices:["Formal documents","Blogs","Journal magazine abstract","News extract","Images","Photos-People","Photos-Artifacts","Maps","Drawings","Video clip","Audio","Statistical references","Social media content(FB,Twitter,Linkedin)"]
            }
        ]},

          {
            questions: [
            {type:"checkbox", name:"3",title: "Does the reasoner need to be knowledgeable in ___ to solve this case",
                 colCount: 3, isRequired: true,
                choices:["Military","Economic","Socialogical","Leadership analysis","Political","Geography/mapping","Counter-intelligence"]
            }
        ]},

        {
            questions: [
            {type:"checkbox", name:"4",title: "Does this case have ___ type of intelligence data?",
                 colCount: 2, isRequired: true,
                choices:["Imagery intelligence data","Open-source intelligence data","Measurement and Signature Intelligence","Hunman-source intelligence","Geospatial intelligence"]
            }
        ]},

        {
            questions: [
            {type:"checkbox", name:"5",title: "Does this case have ____?",
                 colCount: 2, isRequired: true,
                choices:["Difficulties in getting information","Situation evolvement","External forces","Cross-disciplinary materials"]
            }
        ]},

        {
            questions: [
                {type:"checkbox", name:"6", title: "Does this case require _____?", colCount:1, isRequired: true,
                    choices:[
	                  "Future investigation",
		      		  "Retrospective investigation",
				      "Subject matter familiarity",
				      "Case framework familiarity",
				      "Tactical type of thinking",
				      "Strategic type of thinking",
				      "A single factual answer, given the right information",
				      "Systems of dependencies that do not produce a single answer"
                    ]}
            ]},

             {
            questions: [
                {type:"checkbox", name:"7",title: "Does the reasoner have to answer _____ type of identification question?", colCount:1, isRequired: true,
                    choices:[
	                 "Identify a person (Who is this?)",
					 "Identify location of an object/person/facility (Where is it?)",
					 "What is an object/facility used for? Who has it? Who is trying to get it?",
					 "What just happened? Who did it?"
                    ]}
            ]},

              {
            questions: [
                {type:"checkbox", name:"8", title: "Does the reasoner have to answer _____type of strengths and vulnerabilities assessment question?", colCount:1, isRequired: true,
                    choices:[
	                 "Who's in charge? ",
					 "Who's in conflict?",
					 "What kinds of vulnerabilities does this state, group, facility or person have?",
					 "What are the strengths/capabilities of this state, group or person with respect to us?",
					 "What are the needs of this state, group or person with respect to us?",
					 "What is this state/group/person capable of?",
					 "What can we do in regards of this state/group/person?"
                    ]}
            ]},

            {
            questions: [
                {type:"checkbox", name:"9", title: "Does the reasoner have to answer _____type of calculation question?", colCount:1, isRequired: true,
                    choices:[
	                 "How will a certain situation evolve?",
					 "What are the goals/intentions of certain persons/groups/state?",
					 "What can we expect in this person, group, or state(s)?",
					 "Prediction of action",
					 "Effects of intervention"
                    ]}
            ]},

       ]
});

survey.onCurrentPageChanged.add(function() {
    durations[lastPage] += Date.now() - lastStartTime;
    lastStartTime = Date.now();
    lastPage = survey.currentPageNo;
});

survey.onComplete.add(function(result) {
    // Fill in the duration for the last question
    durations[lastPage] += Date.now() - lastStartTime;

	document.querySelector('#surveyResult').innerHTML = "result: " + JSON.stringify(result.data);

	var end = Date.now();
	var duration = end - start;
	var arrReferences = Array.from(clicked_references);

	var data = {
        results: result.data,
        duration: duration,
        references: arrReferences,
        durations: durations
    }

    $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        url: "/minitrace/postsurveyresults",
        data: JSON.stringify(data)
    })
});

survey.showProgressBar = "bottom";

$("#surveyElement").Survey({model:survey});
