var fs=require('fs'),
    sys=require('util');

exports.get=function(fileName,key){
	var configJson={};
	try{
		var str=fs.readFileSync(fileName,'utf8'); // utf8 format read teh information of the file...
		configJson=JSON.parse(str);  // use JSON method to parse the file to JOSN object
	}catch(e){
		sys.debug("JSON parse fails");
	}
	return configJson[key];  //return the needed key information.
}