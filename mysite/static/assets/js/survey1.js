Survey.Survey.cssType = "bootstrap";
Survey.defaultBootstrapCss.navigationButton = "btn btn-green";
Survey.defaultBootstrapCss.progressBar = "bar-green";


window.survey = new Survey.Model({ 
    title: "Please read the case and resources to answer the questions",
    pages: [
        { questions: [
                {type:"checkbox", name:"objects", title: "Does this case have to do with a/an____?", colCount:4, isRequired: true, 
                    choices:["Person","Group","State","Object","Facility"]}
            ]},
     
       	{ 
            questions: [
            {type:"checkbox", name:"contain",title: "Does this case contain ___?",
                 colCount: 2, isRequired: true,
                choices:["Formal documents","Blogs","Journal magazine abstract","News extract","Images","Photos-People","Photos-Artifacts","Maps","Drawings","Video clip","Audio","Statistical references","Social media content(FB,Twitter,Linkedin)"]
            }
        ]},

          {  
            questions: [
            {type:"checkbox", name:"knowlege",title: "Does the reasoner need to be knowledgeable in ___ to solve this case",
                 colCount: 3, isRequired: true,
                choices:["Military","Economic","Socialogical","Leadership analysis","Political","Geography/mapping","Counter-intelligence"]
            }
        ]},

        {  
            questions: [
            {type:"checkbox", name:"intelligence",title: "Does this case have ___ type of intelligence data?",
                 colCount: 2, isRequired: true,
                choices:["Imagery intelligence data","Open-source intelligence data","Measurement and Signature Intelligence","Hunman-source intelligence","Geospatial intelligence"]
            }
        ]},

        {  
            questions: [
            {type:"checkbox", name:"have",title: "Does this case have ____?",
                 colCount: 2, isRequired: true,
                choices:["Difficulties in getting information","Situation evolvement","External forces","Cross-disciplinary materials"]
            }
        ]},

        { 
            questions: [
                {type:"checkbox", name:"requirement", title: "Does this case require _____?", colCount:1, isRequired: true, 
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
                {type:"checkbox", name:"Identify",title: "Does the reasoner have to answer _____ type of identification question?", colCount:1, isRequired: true, 
                    choices:[
	                 "Identify a person (Who is this?)",
					 "Identify location of an object/person/facility (Where is it?)",
					 "What is an object/facility used for? Who has it? Who is trying to get it?",
					 "What just happened? Who did it?"
                    ]}
            ]},

              { 
            questions: [
                {type:"checkbox", name:"strengths", title: "Does the reasoner have to answer _____type of strengths and vulnerabilities assessment question?", colCount:1, isRequired: true, 
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
                {type:"checkbox", name:"calculation", title: "Does the reasoner have to answer _____type of calculation question?", colCount:1, isRequired: true, 
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

survey.onComplete.add(function(result) {
	document.querySelector('#surveyResult').innerHTML = "result: " + JSON.stringify(result.data);
	console.log(document.cookie);

    $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        url: "/minitrace/postsurveyresults",
        data: JSON.stringify(result.data)
    })
});

survey.showProgressBar = "bottom";

$("#surveyElement").Survey({model:survey});
