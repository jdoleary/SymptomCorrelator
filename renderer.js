const fs = require('fs');
const _ = require('lodash');
let data = {data:[]};
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
let label, userInput;
let waitForEnter = false;
function ask(q, wait){
    label.innerHTML = q.q;
    waitForEnter = wait;
}
function answer(a){
    console.log(a);
    if(questions[qIndex].type == 'date'){
        let date = new Date(a);
        if(date.toString() != 'Invalid Date'){
            a = date;
        }else{
            return invalid();
        }
    }
    questions[qIndex].a = a;
    userInput.value = "";
    let isValid = true;
    if(isValid){
        let nextQ = getNextQ();
        if(nextQ){
            ask(nextQ,true);
        }
    }
    
}
function getNextQ(){
    if(++qIndex < questions.length){
        return questions[qIndex];
    }else{
        // restart and save
        qIndex = 0;
        data.data.push(_.map(questions, 'a'));
        updateHistory();
        save(data);
        return questions[qIndex];
    }
}
function invalid(){
    label.innerHTML = 'Invalid, try again: ' + label.innerHTML;
}
let qIndex = 0;
let questions = [
{q:'Event',a:''},
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
    data =(JSON.parse(content));
    updateHistory();
    
    
    label = document.querySelector('#label');
    //input
    userInput = document.querySelector('#user');
    userInput.focus();
    
    document.onkeypress = function (e) {
        e = e || window.event;
        if(waitForEnter){
            if(e.code == 'Enter'){
                answer(userInput.value);                
            }
        }else{
            //answer immediately
            answer(userInput.value);
        }
    };
    
    
    userInput.addEventListener("blur", function( event ) {
        userInput.focus();
    }, true);
    
    ask(questions[qIndex], true);
    
});