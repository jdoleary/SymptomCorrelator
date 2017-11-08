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
        save(data);
        return questions[qIndex];
    }
}
let qIndex = 0;
let questions = [
{q:'Event?',a:''},
{q:'Date',a:''}
];
ready(()=>{
    
    var content=fs.readFileSync("./tmp/data.json", "utf8");
    data =(JSON.parse(content));
    
    
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