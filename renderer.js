const fs = require('fs');
const _ = require('lodash');
let data = {data:[]};
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
    questionCurrent.a = a;
    userInput.value = "";
    let isValid = true;
    if(isValid){
        let nextQ = getNextQ();
        if(nextQ){
            ask(nextQ,true);
        }
    }
  
}
function inputAnswer(a){
    switch(questionCurrent.type){
      case 'date':
        let date = new Date(a);
        if(date.toString() != 'Invalid Date'){
            fillAnswer(a);
            return;
        }else{
            invalid();
            return;
        }
        break;
      case 'time':
      case 'yesorno':
      default:
        fillAnswer(a);
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
        save(data);
        questionCurrent = questions[qIndex];
        return questionCurrent;
    }
}
function invalid(){
    error.innerHTML = 'Invalid, try again: ';
}
let qIndex = 0;
let questions = [
{q:'Event',a:'',required:true},
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
    
    var content=fs.readFileSync("./tmp/data.json", "utf8");
    if(content.length){
      data =(JSON.parse(content));
    }
    updateHistory();
    
    
    label = document.querySelector('#label');
    error = document.querySelector('#error');
    //input
    userInput = document.querySelector('#user');
    userInput.focus();
    
    document.onkeypress = function (e) {
        e = e || window.event;
        if(waitForEnter){
            if(e.code == 'Enter'){
                inputAnswer(userInput.value);                
            }
        }else{
            //answer immediately
            inputAnswer(userInput.value);
        }
    };
    
    // Attempt to skip current input when TAB is pressed
    // TODO: only tab, not mouseclick
    userInput.addEventListener("blur", function( event ) {
      console.log(event);
        // unless question is required
        if(questionCurrent.required){
          invalid();
        }else{
          // Skip current input with default, then refocus:
          fillAnswer((function getDefaultAnswer(){
            switch(questionCurrent.type){
              case 'date':
                return formatMMDDYYYY(new Date());
                break;
              case 'time':
                return '00:00';
              case 'yesorno':
                return null;
              default:
                // Attempt to fill answer with content of input box.
                return userInput.value;
            }
          })());
        }
        userInput.focus();
    }, true);
    
    
    function formatMMDDYYYY(date){
      return (date.getMonth() + 1) + 
      "/" +  date.getDate() +
      "/" +  date.getFullYear();
    }
    
    //Entry point!:
    questionCurrent = questions[qIndex];
    ask(questionCurrent, true);
});