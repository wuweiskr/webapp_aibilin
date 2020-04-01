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

$('body .content .login_out .login_btn').on('touchstart',function(){
	let iphone = $('body .content .login_out .login_input .user').val();
	let pass = $('body .content .login_out .login_input .pass').val();
	if(!(/^[1][3,4,5,7,8,9][0-9]{9}$/.test(iphone))){
		alert("手机号码有误，请重填");  
	}else if(!(/^(?=.*[a-z])(?=.*\d)[^]{8,16}$/.test(pass))){
		alert("密码有误，至少8-16个字符，至少，1个小写字母和1个数字，其他可以是任意字符");  
	}else{
		$.ajax({
			type:'post',
			url:'http://127.0.0.1:3000/register',
			data:{
				iphone,
				pass
			},
			success:(data)=>{
				console.log(JSON.parse(data));
			}
		})
	}
})

