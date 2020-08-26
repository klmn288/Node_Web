var testFolder = 'data'; //data폴더에 있는 값을 읽어오기
var fs = require('fs');
 
fs.readdir(testFolder, function(error, filelist){
  console.log(filelist);
})