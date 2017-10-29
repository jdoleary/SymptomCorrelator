
 $(document).ready(function() {  
     update();
   
  });
function addListeners(){
    $('input').on('click',function(){$(this).select()});
   // $('input').focusout(()=>console.log('update')); 
    $('input').on('keyup',function(e) {
          if (e.keyCode == '13'){
            $(this).blur();
            newEntry();
          }
     }); 
  
}
function newEntry(){
  var newData = {};
  newData.name = $('#newEntry #newName').val();
  newData.intensity = $('#newEntry #newIntensity').val();
  newData.date = $('#newEntry #newDate').val();
  newData.time = $('#newEntry #newTime').val();
  newData.category = $('#newEntry #newCategory').val();
  data.push(newData);
  update();
}
function update(){
  $('table').html(`
  <tr>
    <th>Name</th>
    <th>Intensity</th>
    <th>Date</th>
    <th>Time</th>
    <th>Category</th>
  </tr>

  <tr id="newEntry">
    <th><input id="newName" value="" list=""/></th>
    <th><input id="newIntensity" value="" list=""/></th>
    <th><input id="newDate" value="" list=""/></th>
    <th><input id="newTime" value="" list=""/></th>
    <th><input id="newCategory" value="" list=""/></th>
  </tr>
`);
  for(var i = 0; i < data.length; i++){
    $('table').append(makeRow(data[i])); 
  }
  addListeners();
}
function makeRow({name, intensity, date, time, category}){
  return `
  <tr>
    <th>${name}</th>
    <th>${intensity}</th>
    <th>${date}</th>
    <th>${time}</th>
    <th>${category}</th>
  </tr>`;
}
var data = [
  {
    name:'headache',
    intensity: 4,
    date:'10/4/17',
    time:'15:00',
    category:'pain'
  }
];