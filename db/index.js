let mongoose = require('mongoose');
//创建集合模板：
let users = mongoose.Schema({
	name: {
		type: String,
		default: '小明'
	},
	iphone: String,
	pass: String,
	userimg: {
		type: String,
		default: '/public/img/login.JPG'
	}
})

// 首页轮播图
let index_banner = mongoose.Schema({
	img: String,
})


// 写一个模板，放验证码
let code = mongoose.Schema({
	username: String,
	code: String
})


// 写一个top数据
let top = mongoose.Schema({
	btnTitle: String,
	subTitle: String,
	mainTitle: String
})


let notepad = mongoose.Schema({
	id: Number,
	content: String,
	isFinised: Boolean
})

// mongoose.connect('mongodb://127.0.0.1:27017/aby', function(err) {
// 	if(err){
// 		console.log(err)
// 	}else{
// 		console.log('ok')
// 		let a = mongoose.model('index_banner',index_banner);
// 		a.insertMany([
// 			{img:"https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3319250955,2922975591&fm=11&gp=0.jpg"},
// 			{img:"https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2497087375,1054147526&fm=26&gp=0.jpg"},
// 			{img:"https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=701114191,2264623006&fm=11&gp=0.jpg"}
// 		]).then((data)=>{
// 			console.log(data)
// 		})
// 	}
// })

module.exports = {
	users,
	index_banner,
	code,
	top,
	notepad
}
