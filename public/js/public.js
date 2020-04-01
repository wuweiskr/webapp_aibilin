//适配
// document.addEventListener('touchend', function(ev) {
// 	ev.preventDefault();
// })

function rem() {
	var html = $('html');
	let iW = window.innerWidth;
	let font = iW / 12.8;
	html.css({
		fontSize: font
	});

	$('body').css({
		width: '100vw',
		minHeight: '100vh',
	})
}
rem();
window.onresize = function() {
	rem();
}
