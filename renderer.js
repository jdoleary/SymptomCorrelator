const fs = require('fs');
const _ = require('lodash');
const fuzzytimeinput = require("fuzzytimeinput");
const jutil = require('./js/util');

// Initial test values:
let data = {
  entries:[
    'headache',
    'back pain'
  ],
  data:[]
};
let label, error, userInput;
let waitForEnter = false;
function save(output){
    const content = JSON.stringify(output);

    fs.writeFile("./tmp/data.json", content, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    }); 
    
}
function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
function ask(q, wait){
    label.innerHTML = q.q;
    waitForEnter = wait;
}

function fillAnswer(a){
    // Normalize inputs:
    switch(questionCurrent.type){
      case 'date':
        // transform date:
        a = jutil.formatMMDDYYYY(new Date(a));
        break;
      case 'time':
        // transform time:
        a = fuzzytimeinput(a);
        break;
    }
    questionCurrent.a = a;
    userInput.value = "";
    let validCheck = validate(a);
    if(validCheck.valid){
        let nextQ = getNextQ();
        if(nextQ){
            ask(nextQ,true);
        }
    }else{
      error.innerHTML = validCheck.msg;
    }
    
    showAutoCompleteHint(getDefaultAnswer());
}
function validate(a){
    switch(questionCurrent.type){
      case 'date':
        let date = new Date(a);
        if(date.toString() != 'Invalid Date'){
          return {valid:true};
        }else{
          return {valid:false,msg:'Invalid date'};
        }
        break;
      case 'entry':
        if(data.entries.indexOf(a) != -1){
          return {valid:true};
        }else{
          return {valid:false,msg:'Entry does not exist in the list of possible entries'};
        }
        break;
      default:
        return {valid:true};
    }
}
function getNextQ(){
    if(++qIndex < questions.length){
        questionCurrent = questions[qIndex];
        return questionCurrent;
    }else{
        // restart and save
        qIndex = 0;
        data.data.push(_.map(questions, 'a'));
        updateHistory();
        save({data:data.data});
        questionCurrent = questions[qIndex];
        return questionCurrent;
    }
}

let qIndex = 0;
let questions = [
{q:'Entry',a:'',type:'entry'},
{q:'Negative of Event (y/n)',a:'',type:'yesorno'},
{q:'Time',a:'',type:'time'},
{q:'Date',a:'',type:'date'}
];
function updateHistory(){
    const hist = document.querySelector('#history');
    hist.innerHTML = "";
    for(let i = 0; i < data.data.length; i++){
        
        var newDiv = document.createElement("div"); 
        newDiv.innerHTML = data.data[i];
        hist.appendChild(newDiv);
    }
    
}
ready(()=>{
    let dataContent;
    let entriesContent;
    try{
      entriesContent=fs.readFileSync("./tmp/entries.json", "utf8");
      if(entriesContent && entriesContent.length){
        fs.writeFile("./data-backups/entries.json.bak", entriesContent, 'utf8', function (err) {
          if (err) {
              return console.log(err);
          }
          console.log("./data-backups/entries.json.bak backup created.");
        }); 
      }
    }catch(e){
      console.error(e);
    }
    try{
      dataContent=fs.readFileSync("./tmp/data.json", "utf8");
      // Make backups of data: 
      if(dataContent && dataContent.length){
        fs.writeFile("./data-backups/data.json.bak", dataContent, 'utf8', function (err) {
          if (err) {
              return console.log(err);
          }
          console.log("./data-backups/data.json.bak backup created.");
        }); 
      }
    }catch(e){
      console.error(e);
    }
    if(dataContent && dataContent.length){
      data.data = (JSON.parse(dataContent).data);
    }
    if(entriesContent && entriesContent.length){
      data.entries =(JSON.parse(entriesContent).entries);
    }
    
    updateHistory();
    
    
    label = document.querySelector('#label');
    error = document.querySelector('#error');
    //input
    userInput = document.querySelector('#user');
    userInput.focus();
    
    // Attempt to skip current input when TAB is pressed
    document.onkeydown = function (e) {
        var TABKEY = 9;
        if(e.keyCode == TABKEY) {
          // Skip current input with default, then refocus:
          fillAnswer(getDefaultAnswer());
          
          userInput.focus();
          e.preventDefault();
          return false;
        }
    }
    document.onkeyup = function(e){
      showAutoCompleteHint(getDefaultAnswer());
    }
    document.onkeypress = function (e) {
        e = e || window.event;
        if(waitForEnter){
            if(e.code == 'Enter'){
                fillAnswer(userInput.value);                
            }
        }else{
            //answer immediately
            fillAnswer(userInput.value);
        }
    };
    
    //Entry point!:
    questionCurrent = questions[qIndex];
    ask(questionCurrent, true);
});

function getDefaultAnswer(){
  switch(questionCurrent.type){
    case 'date':
      // Get closest data answer to input
      if(!userInput.value){
        // if there is no closest answer, pass current date:
        return new Date();
      }else{
        return jutil.formatMMDDYYYY(new Date(userInput.value));
      }
      break;
    case 'time':
      // Get closest time answer to input
      if(!userInput.value){
        // if there is no closest answer, pass current time:
        const now = new Date();
        return fuzzytimeinput(now.getHours() + ':' + now.getMinutes());
      }else{
        return fuzzytimeinput(userInput.value);
      }
    case 'yesorno':
      return null;
    case 'entry':
      if(!userInput.value){
        return null;
      }
      let autoComp = jutil.autoComplete(userInput.value,data.entries);
      if(autoComp.length){
        return autoComp[0];
      }else{
        return null;
      }
    default:
      // Attempt to fill answer with content of input box.
      return userInput.value;
  }
}
      
function showAutoCompleteHint(hint){
  document.querySelector('#autocomplete').innerHTML = hint;
}