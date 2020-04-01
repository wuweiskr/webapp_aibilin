//进去获取地址
function houqu_dd() {
	let dd = document.querySelector(
		".mui-content #tabbar .content #slider .mui-slider-group .mui-slider-item .mui-table-view .check_dd .dd div"
	);
	let wz = document.querySelector(
		".mui-content #tabbar .content #slider .mui-slider-group .mui-slider-item .mui-table-view .check_dd .wz"
	);

	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition((pos) => {
		var geoc = new BMap.Geocoder();
		geoc.getLocation(pos.point, function(rs) {
			dd.innerHTML = rs.address.split('市')[0];
		})
	})
	wz.ontouchstart = function() {

	}
}
houqu_dd();


//未登录。点击调转登录页面
function login() {
	//个人页面
	let btn = document.querySelector(".mui-content #tabbar-login .login .login-head .login-zc .login-zc-out a ");
	btn.addEventListener('tap', function() {
		mui.openWindow({
			url: './login.html', //通过URL传参
		})
	});
	//心愿单
	let aa = document.querySelector('.mui-content #tabbar-heart .btn');
	aa.addEventListener('tap', function() {
		mui.openWindow({
			url: './login.html', //通过URL传参
		})
	});
	//收件箱
	let bb = document.querySelector('.mui-content #tabbar-email .btn');
	bb.addEventListener('tap', function() {
		mui.openWindow({
			url: './login.html', //通过URL传参
		})
	});
}
login();

//首页轮播图
$.ajax({
	type: 'get',
	url: 'http://127.0.0.1:3000/get_index_banner',
	success: (data) => {
		let datas = JSON.parse(data);
		for (var i = 0; i < datas.length; i++) {
			$('.mui-content #tabbar .banner_search .swiper-wrapper').append("<div class=\"swiper-slide\"><img src=\"" + datas
				[i].img + "\" /></div>");
		}
		var mySwiper = new Swiper('.mui-content #tabbar .banner_search', {
			autoplay: true,
			loop: true,
			scrollbar: {
				el: '.swiper-scrollbar',
				draggable: true,
			},
		})
	}
})

//首页，房源分类，轮播图数据
$.ajax({
	type: 'post',
	url: 'http://127.0.0.1:3000/get_index_housingClassification',
	success: (data) => {
		let datas = JSON.parse(data);
		for (var i = 0; i < datas.data.length; i++) {
			$('.mui-content #tabbar .content .housingClassification .swiper-container .swiper-wrapper')
				.append(`<div class="swiper-slide"><img src="${datas.data[i].img}" /><h3>${datas.data[i].title}</h3></div>`);
		}
		var mySwiper = new Swiper('.mui-content #tabbar .content .housingClassification .swiper-container', {
			direction: 'horizontal',
			loop: true,
			autoplay: 5000,
			slidesPerView: "auto",
			centeredSlides: true,
			spaceBetween: 10,
		})
	}
})

//首页，大城市，数据
$.ajax({
	type: 'post',
	url: 'http://127.0.0.1:3000/get_index_housingSupply',
	success: (data) => {
		let datas = JSON.parse(data);
		let content = document.querySelector('.mui-content #tabbar .content .weeklyRent_content');
		let str = '';
		str += `<div id="tab">`;
		for (let i = 0; i < datas.data.length; i++) {
			if (i == 0) {
				str += `<div>
							<button type="button" class="active">${datas.data[i].title}</button>
						</div>`;
			} else {
				str += `<div>
							<button type="button">${datas.data[i].title}</button>
						</div>`;
			}
		}
		str += `
		</div>
		<div id="tabCon">`;

		for (var j = 0; j < datas.data.length; j++) {
			str += `<div class="tabCon_content">
						<div class="juti">`;
			for (var z = 0; z < datas.data[j].content.length; z++) {
				str +=
					`<div class="juti_content">
							<img src="${datas.data[j].content[z].img}" alt="">
							<h4 class="titel">${datas.data[j].content[z].title}</h4>
							<p>${datas.data[j].content[z].juti}</p>
							<span class="price">
								<i>￥${datas.data[j].content[z].price}</i> /晚
							</span>
							<div class="pf">
								<span class="mui-icon mui-icon-starhalf"></span>
								<i>${datas.data[j].content[z].pf}</i> (71)·超赞房东
							</div>
						</div>`;
			}
			str += `</div>
						<div id="tab_btn">
							<button type="button">显示更多优惠房源</button>
						</div>
					</div>`;
		}
		str += `</div>`;
		content.innerHTML = str;

		//首页，大城市
		function weeklyRent_content() {
			let aList = document.querySelectorAll(".mui-content #tabbar .content .weeklyRent_content #tab div button");
			let aTab = document.querySelectorAll(".mui-content #tabbar .content .weeklyRent_content #tabCon .tabCon_content");
			aList[0].classList.add("active");
			aTab[0].classList.add("on");
			index = 0;
			for (let i = 0; i < aList.length; i++) {
				(function(i) {
					aList[i].ontouchstart = function() {
						aList[index].classList.remove("active");
						aTab[index].classList.remove("on");
						index = i;
						aList[index].classList.add("active");
						aTab[index].classList.add("on");
					}
				})(i);
			}
		}
		weeklyRent_content();
	}
})

//首页，可能去的地方，数据
$.ajax({
	type: 'post',
	url: 'http://127.0.0.1:3000/get_index_possiblePlaces',
	success: (data) => {
		let datas = JSON.parse(data);
		for (let i = 0; i < datas.data.length; i++) {
			$('.mui-content #tabbar .content .possiblePlaces .swiper-container .swiper-wrapper')
				.append(
					`<div class="swiper-slide"><img src="${datas.data[i].img}" ><div class="dd_price"><h3>${datas.data[i].title}</h3><h4>均价 <i>￥${datas.data[i].price}/晚</i></h4></div></div>`
				);
		}
		let mySwiper = new Swiper('.mui-content #tabbar .content .possiblePlaces .swiper-container', {
			direction: 'horizontal',
			loop: true,
			autoplay: 5000,
			slidesPerView: "auto",
			centeredSlides: true,
			spaceBetween: 10,
		})
	}
})

//故事，
$.ajax({
	type: 'post',
	url: 'http://127.0.0.1:3000/get_tabbar_gushi',
	success: (data) => {
		let datas = JSON.parse(data);
		let content = document.querySelector('.mui-content #tabbar-gushi .feilei');
		let str = '';
		str += `<div class="feilei_nav">`;
		for (let i = 0; i < datas.data.length; i++) {
			if (i == 0) {
				str += `<div class="feilei_nav_cont active_feilei">${datas.data[i].title}</div>`;
			} else {
				str += `<div class="feilei_nav_cont">${datas.data[i].title}</div>`;
			}
		}
		str += `
		</div>`;

		for (var j = 0; j < datas.data.length; j++) {
			str += `<div class="feilei_content"><h3>有趣房东</h3><div class="feilei_content_jt">
						<div class="jt">`;
			for (var z = 0; z < datas.data[j].content.length; z++) {
				str +=
					`<div class="juti_content">
							<img src="${datas.data[j].content[z].img}" alt="">
							<p><span>${datas.data[j].content[z].title}</span>${datas.data[j].content[z].juti}</p>
							<div class="user">
								<span class="mui-icon-extra mui-icon-extra-university tx"></span>
								<span class="mui-icon-extra mui-icon-extra-like icon_zan_hua"></span>99+
								<span class="mui-icon-extra mui-icon-extra-comment icon_zan_hua"></span>69
							</div>
						</div>`;
			}
			str +=
				`</div>
						<div id="tab_btn">
							<button type="button">显示更多故事</button>
						</div>
					</div></div>`;
		}
		content.innerHTML = str;

		function www() {
			let nav_cont = document.querySelectorAll(".mui-content #tabbar-gushi .feilei .feilei_nav .feilei_nav_cont");
			let nav_Tab = document.querySelectorAll(".mui-content #tabbar-gushi .feilei .feilei_content");
			num = 0;
			nav_Tab[0].classList.add("on");
			for (let j = 0; j < nav_cont.length; j++) {
				(function(j) {
					nav_cont[j].ontouchstart = function() {
						nav_cont[num].classList.remove("active_feilei");
						nav_Tab[num].classList.remove("on");
						num = j;
						nav_cont[num].classList.add("active_feilei");
						nav_Tab[num].classList.add("on");
					}
				})(j);
			}
		}
		www();

	}
})

//登录界面获取用户信息
$.ajax({
	type: 'get',
	url: 'http://127.0.0.1:3000/get_user_info',
	success: (data) => {
		let data_user = JSON.parse(data);
		console.log(data_user)
		if (data_user.status == 1) {
			$('.mui-content #tabbar-login .login .login-head .login-zc .login-zc-out a').html(data_user.name);
			$('.mui-content #tabbar-login .login .login-head .login-zc .img img').attr('src', data_user.userimg);
		} else {
			console
		}
	}
})
