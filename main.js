var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring'); //post분석용

function templateHTML(title, list, body, control){ //본문내용
	return `
	<!doctype html>
	<html>
	<head>
		<title>WEB1 - ${title}</title>
		<meta charset="utf-8">
	</head>
	<body>
		<h1><a href="/">WEB</a></h1>
		${list}
		${control} //update관련
		${body}
	</body>
	</html>
	`;
}

function templateList(filelist) { //목록
	var list = '<ol>';
	var i = 0;
	while(i < filelist.length){
		list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
		i = i + 1;
	}
	list = list+'</ol>';
	return list;
}

var app = http.createServer(function(request,response){ //웹 페이지를 실행할때마다 호출
	var _url = request.url; // localhost:3000/?id=HTML 에서 /?id=HTML이 부분 추출
	var queryData = url.parse(_url, true).query;  //{id: 'HTML'} 이런식으로 분석
	var pathname = url.parse(_url, true).pathname;	
	//console.log(url.parse(_url, true)); //url이 가지고있는 정보를 알수있음	
	
	if(pathname === '/'){ // home 
      if(queryData.id === undefined){	
      	fs.readdir('./data', function(error, filelist){
      		var title = 'Welcome';
      		var description = 'Hello, Node.js';
      		var list = templateList(filelist);
      		var template = templateHTML(title, list, `<h2>${title}</h2>${description}`,
      			`<a href="/create">create</a>`);
      		response.writeHead(200);
      		response.end(template);
      	})

      } else { // home이 아닌경우
      	fs.readdir('./data', function(error, filelist){// data 앞에 ./는 현재의 디렉토리를 말한다(없어도 똑같음)                    
      		fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
      			var title = queryData.id; //HTML, CSS, JavaScript .....
      			var list = templateList(filelist);
      			var template = templateHTML(title, list, `<h2>${title}</h2>${description}`,
      				`<a href="/create">create</a> <a href="/update?id=${title}">updat</a>`);  //update는 무엇을 수정할지에 대해 알려줘야함  
      			response.writeHead(200);
      			response.end(template);
      		});
      	});
      }
  } else if(pathname === '/create'){ //create를 요청한 경우
  	fs.readdir('./data', function(error, filelist){
  		var title = 'WEB - create';      		
  		var list = templateList(filelist);
  		//form은 웹브라우저에서 서버로 데이터를 전송할때 사용한다
  		var template = templateHTML(title, list, `
  			<form action="http://localhost:3000/create_process" method="post"> 
  			<p><input type="text" name="title" placeholder="title"></p>
  			<p>
  				<textarea name="description" placeholder="description"></textarea>
  			</p>
  			<p>
  				<input type="submit">
  			</p>
  			</form>`);
  		response.writeHead(200);
  		response.end(template);
  	})
  } else if(pathname === '/create_process'){ //create_process를 요청한 경우
  	var body = '';
  	request.on('data', function(data){ //
  		body = body + data;  		
  	});
  	request.on('end', function(){ //더이상 들어올 데이터가 없을때
  		var post = qs.parse(body); // post데이터를 분석  		
  		var title = post.title;
  		console.log('title :'+ title);
  		var description = post.description;
  		fs.writeFile(`data/${title}`, description, 'utf8', function(err){ //파일쓰기
			response.writeHead(302, {Location:`/?id=${title}`}); //파일이 정상적으로 쓰였으면 페이지 리다이렉션
			response.end('success'); //서버에 전송하는 데이터	
  		})
  		//console.log(post);
  	});
  	
  }
  	else if(pathname === '/update'){
  		fs.readdir('./data', function(error, filelist){// data 앞에 ./는 현재의 디렉토리를 말한다(없어도 똑같음)                    
      		fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
      			var title = queryData.id; //HTML, CSS, JavaScript .....
      			var list = templateList(filelist);
      			var template = templateHTML(title, list, 
      				`
      				<form action="http://localhost:3000/update_process" method="post"> 
      				<input type="hidden" name="id" value="${title}">
		  			<p><input type="text" name="title" placeholder="title" value="${title}"></p>
		  			<p>
		  				<textarea name="description" placeholder="description">${description}</textarea>
		  			</p>
		  			<p>
		  				<input type="submit">
		  			</p>
		  			</form>
      				`,
      				`<a href="/create">create</a> <a href="/update?id=${title}">updat</a>`);  //update는 무엇을 수정할지에 대해 알려줘야함  
      			response.writeHead(200);
      			response.end(template);
      		});
      	});
  	} else if(pathname === '/update_create'){
  		
  	}
  	else {
  	response.writeHead(404);
  	response.end('Not found');
  }



});
app.listen(3000); //3000번 포트로 접속가능