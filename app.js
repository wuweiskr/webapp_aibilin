let http = require('http'); //引入http模块
let express = require('express');
let app = express();
let router = require('./router/index.js');
let mogonoose = require('mongoose');
let Cookies = require('cookies');
let path = require('path');

app.use('/public',express.static(path.resolve(__dirname,'public')));
app.use("/", function(req, res, next) {
	//设置允许跨域的域名，*代表允许任意域名跨域
	res.header("Access-Control-Allow-Origin", "*");
	
	//允许的header类型
	res.header("Access-Control-Allow-Headers", "content-type");
	
	//跨域允许的请求方式 
	res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
	
	//解析客户端发送过来的cookies
	req.cookies = new Cookies(req, res);

	next();
})


// 连接数据库
mogonoose.connect('mongodb://127.0.0.1:27017/aby', function(err) {
	if (!err){
		// 连接成功
		app.use('/', router);
		//中间件 app.use     
		app.listen(3000);
		console.log('连接成功')
	}

})
