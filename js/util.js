const util = {
  autoComplete: 
    function autoComplete(input,list){
      if(!input || input.length == 0){
        return null;
      }
      const results = [];
      const inList = JSON.parse(JSON.stringify(list));
      inList.sort();
      for(var i = 0; i < inList.length; i++){
        if(inList[i].startsWith(input)){
          results.push(inList[i]);
        }
      }
      return results;
    },
    formatMMDDYYYY: function formatMMDDYYYY(date){
      return (date.getMonth() + 1) + 
      "/" +  date.getDate() +
      "/" +  date.getFullYear();
    }
    
}

module.exports = util;