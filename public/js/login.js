//点击密码显示隐藏
function pass_show() {
	let pass = document.querySelector("body .content .login_out .login_input li .pass");
	let btn = document.querySelector("body .content .login_out .login_input li .show");

	btn.addEventListener( "touchstart" , function(){
		var isShow=true;
		if (pass.type == "password") {
			pass.type = "text";
			btn.style.color = '#008489';
			isShow = false;
		} else if(pass.type == "text"){
			pass.type = "password";
			btn.style.color = '#000000';
			isShow = true;
		}
	}, false);

}
pass_show();

//未zce。点击调转登录页面
function register() {
	//个人页面
	let btn = document.querySelector("body .mui-bar-nav .register");
	btn.addEventListener('tap', function() {
		mui.openWindow({
			url: './register.html', //通过URL传参
		})
	});
}
register();

$('body .content .login_out .login_btn').on('touchstart',function(){
	$.ajax({
		type:'post',
		url:'http://127.0.0.1:3000/login',
		data:{
			iphone:$('body .content .login_out .login_input .user').val(),
			pass:$('body .content .login_out .login_input .pass').val(),
		},
		success:(data)=>{
			let datas = JSON.parse(data);
			console.log(datas)
			if(datas.status == 1){
				setTimeout(function(){
						window.open('./index.html','_self');
					},2000
				)
				mui.alert('登录成功')
			}else{
				mui.alert('登录失败')
			}
		}
	})
})
