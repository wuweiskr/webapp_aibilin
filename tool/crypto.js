let crypto = require('crypto');

//将加密封装为函数
function encryption(str) {
	let c = crypto.createHmac('sha256', str).digest('hex');
	return c;
}

module.exports = {
	encryption
}
