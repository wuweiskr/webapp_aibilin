const nodemailer = require("nodemailer");


  function sendMessage(other,content){

    let testAccount = nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: "smtp.qq.com",
        port:465,
        secure: true, // true for 465, false for other ports
        auth: {
        user: '443961712@qq.com', // generated ethereal user
        pass: 'kgtylhjauosfbghj' // generated ethereal password
        }
    });

    let info = transporter.sendMail({
        from: '"Fred Foo 👻" <443961712@qq.com>', // sender address
        to: other, // list of receivers
        subject: "验证码", // Subject line
        text: content, // plain text body
        //html: "<b>Hello world?</b>" // html body
    });
    nodemailer.getTestMessageUrl(info);
}
module.exports = {
    sendMessage
}

