let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let bodys = bodyParser.urlencoded({extended:false});
let multer = require('multer');
let mongoose = require('mongoose');
let db = require('../db/index.js');
let tool = require('../tool/index.js');
let sendMessage = require('../tool/malie.js');

// 实力模板，把集合实力出来
let users = mongoose.model('users',db.users);//用户
let index_banner = mongoose.model('index_banner',db.index_banner);//首页轮播图
let codeNum = mongoose.model('codeNum',db.code);// 实力验证码的集合
let top = mongoose.model('top',db.top);
let notepad = mongoose.model('notepad',db.notepad);
// let crypto = require('../tool/crypto.js');   //加密
let cookies = require('cookies');


// 把前端发送的二进制存储在本机的某个文件夹
let storage = multer.diskStorage({
    // 存储路径
    destination:(req,file,cb)=>{
        // 告诉它存储的具体位置      
        cb(null,'./public/imgages');
    },
    filename:function(req,file,cb){
        // 把前端发送的图片重新去一个名字
        cb(null,''+new Date().getTime()+file.originalname);
    }
});

// 可以处理多个文件的对象
let upload = multer({
    storage:storage
})

// 登录接口
router.post('/login',bodys,function(req,res){
    // 拿到前端发送的信息
    let iphone = req.body.iphone;
    let pass = req.body.pass;
	// console.log(iphone,pass)
	// 判断前端的请求是否带有账户和秘密的参数
    if(iphone.trim()&&pass.trim()){ 
        // 说明前端请求带参数
        // 进一步验证此用户是否存在
        users.find({
            iphone,
            pass
        }).then((data)=>{
            if(data.length == 0){
                res.json({
					status:0,
                    msg:'账户不存在',
                    err:1
                });
            }else{
				//当登录成功时，除了给前端发送数据外，再给前端发一个cookie值
				//下次http请求时，再同一个域里面，就会带上cooki值
				
				req.cookies.set('iphone',iphone);
                res.json({
					status:1,
                    // msg:JSON.stringify(data),
					msg:'登录成功',
					id:data[0]._id,
                    err:0
                });
            }
        })
    }else{
        res.json({
			status:0,
            msg:'登录失败',
            err:1
        });
    }
})

//获取用户信息的接口
router.get('/get_user_info',function(req,res){
	let iphone = req.cookies.get("iphone");
	if(iphone){
		//再数据库里面根据name查找数据
		users.find({
			iphone
		}).then((data)=>{
			if(data.leng != 0){
				res.json({
					status:1,
				    msg:'已登录',
				    err:0,
					name:data[0].name,
					userimg:data[0].userimg
				});
			}else{
				res.json({
					status:0,
				    msg:'未登录',
				    err:1
				});
			}
		})
	}else{
		res.json({
			status:0,
		    msg:'未登录',
		    err:1
		});
	}
});

// 获取验证码的接口
router.post('/get_code',bodys,function(req,res){

    // 获取前端发送过来的邮箱号码
    let maileCode = req.body.maileCode;
    // 随机生成一个验证码号，发送给邮箱
    let code = tool.codeFn(); // 验证码

    sendMessage.sendMessage(maileCode,code);
    // 判断邮箱是否已经发送过，并且还没有解决
   
    // 把验证码存储到集合里面
    codeNum.create({
        username:maileCode,
        code:code
    }).then((data)=>{
        if(data){
            res.json({
                msg:'验证码发送成功',
                err:0
            });
        }else{
            res.json({
                msg:'验证码发送失败',
                err:0
            });
        }
    })

})

//注册的接口
router.post('/register',bodys,function(req,res){

   let iphone = req.body.iphone;
   let pass = req.body.pass;
   console.log(iphone,pass)
    if(iphone.trim() && pass.trim()){  // 判断前端参数
        //判断严重码是否正确
        users.find({
            iphone
        }).then((data)=>{
            if(data.length != 0){
                res.json({
                    msg:'该账号已被注册！',
                    err:3
                });
            }else{
                // 把数据添加到用户的集合里面
                users.create({
					iphone,
                    pass
                }).then((data)=>{
                    // 存储的信息
                    if(data){
                        // 数据库存储成功
                        res.json({
                            msg:'注册成功',
                            err:0
                        });
                    }else{
                        res.json({
                            msg:'注册失败',
                            err:1
                        });
                    }
                })
            }
        })
    }else{
        res.json({
            msg:'注册失败',
            err:1
        });
    }
})

// 接口，获取首页轮播图的数据
router.get('/get_index_banner',function(req,res){
    index_banner.find().then((data)=>{ // 查找数据库
        res.send(JSON.stringify(data)) // 把找到的数据传给前端
    })
})

// 接口，获取顶部的数据
router.get('/get_top',function(req,res){
    top.find().then((data)=>{ // 查找数据库

        res.send(JSON.stringify(data)) // 把找到的数据传给前端
    })
})


router.get('/get_notepad',function(req,res){
    notepad.find().then((data)=>{
        res.json({
            err:0,
            msg:'ok',
            data:data
         })
    })
    
})

router.post('/get_notepad_updata',bodys,function(req,res){
   
    let list = JSON.parse(req.query.list);
    console.log(list);
    notepad.remove({}).then((data)=>{

        notepad.insertMany(list).then((data)=>{
            res.json({
                err:0,
                msg:'ok'
             })
        })
    })
})




// ------------------------第三次项目-----------------------------

//首页轮播图数据
// router.get('/get_index_banner',function(req,res){
//     res.json({
//         err:0,
//         msg:'ok',
//         data:[
//            {
// 			   img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584183727521&di=f0fa6bfe72e1def1973cecfd1eb4ee7c&imgtype=0&src=http%3A%2F%2Fwww.seaguy.com.cn%2Fuploads%2Fallimg%2F160122%2F1-160122154J1.jpg"
// 		   },
// 		   {
// 			   img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584183976813&di=4ec1f58f7cf803254e2196a184891820&imgtype=0&src=http%3A%2F%2Fimage.sonhoo.com%2Fserver18%2Fphotos%2Fphoto%2F1561510518%2F20197175756951.jpg"
// 		   },
// 		   {
// 			   img:"https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3319250955,2922975591&fm=11&gp=0.jpg"
// 		   },
// 		   {
// 			   img:"https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2497087375,1054147526&fm=26&gp=0.jpg"
// 		   },
// 		   {
// 			   img:"https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=701114191,2264623006&fm=11&gp=0.jpg"
// 		   }
//         ]
//     })
// })

//首页，房源分类，轮播图数据
router.post('/get_index_housingClassification',function(req,res){
    res.json({
        err:0,
        msg:'ok',
        data:[
           {
			   title:'可以做饭',
			   img:"https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2932194566,2686478204&fm=26&gp=0.jpg"
		   },
		   {
			   title:'整个房源',
			   img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584251495053&di=e562d31d241be108a2296bd966c625f7&imgtype=jpg&src=http%3A%2F%2Fimg1.imgtn.bdimg.com%2Fit%2Fu%3D1196102966%2C3510939580%26fm%3D214%26gp%3D0.jpg"
		   },
		   {
			   title:'周租月租',
			   img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584251446934&di=b5871ceedfe4ca2aa36c4e91d1bfee01&imgtype=jpg&src=http%3A%2F%2Fimg2.imgtn.bdimg.com%2Fit%2Fu%3D1745739937%2C234549628%26fm%3D214%26gp%3D0.jpg"
		   },
		   {
			   title:'本地体验',
			   img:"https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2932591622,417649096&fm=26&gp=0.jpg"
		   },
		   {
			   title:'赢9折券',
			   img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584251600000&di=ff8186ac16a37552c741286bca42090f&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F6cd365f26ab4ac47e71544100d9a3fd7e2d5a06c47a7-fI7U4l_fw658"
		   }
        ]
    })
})

//首页，房源具体数据
router.post('/get_index_housingSupply',function(req,res){
	res.json({
	    err:0,
	    msg:'ok',
	    data:[
			{
				title:'成都',
				content:[
					{
						title:'整套房子·成都',
						juti:'近外滩全新装修，南京东路3分钟',
						price:166,
						pf:4.69,
						img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584361538224&di=47634f9ae6b2c9b29813e2919e43faa5&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181010%2Fbd31ee1e37434ef2896f3964a0c8524d.jpg"
					},
					{
						title:'整套房子·成都',
						juti:'近外滩全新装修，南京东路3分钟',
						price:166,
						pf:4.69,
						img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584361538224&di=47634f9ae6b2c9b29813e2919e43faa5&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181010%2Fbd31ee1e37434ef2896f3964a0c8524d.jpg"
					},
					{
						title:'整套房子·成都',
						juti:'近外滩全新装修，南京东路3分钟',
						price:166,
						pf:4.69,
						img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584361538224&di=47634f9ae6b2c9b29813e2919e43faa5&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181010%2Fbd31ee1e37434ef2896f3964a0c8524d.jpg"
					},
					{
						title:'整套房子·成都',
						juti:'近外滩全新装修，南京东路3分钟',
						price:166,
						pf:4.69,
						img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584361538224&di=47634f9ae6b2c9b29813e2919e43faa5&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181010%2Fbd31ee1e37434ef2896f3964a0c8524d.jpg"
					}
				]
			},
			{
				title:'上海',
				content:[
					{
						title:'整套房子·上海',
						juti:'近外滩全新装修，南京东路3分钟',
						price:166,
						pf:4.69,
						img:"https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3251279264,3464384023&fm=26&gp=0.jpg"
					},
					{
						title:'整套房子·上海',
						juti:'近外滩全新装修，南京东路3分钟',
						price:166,
						pf:4.69,
						img:"https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3251279264,3464384023&fm=26&gp=0.jpg"
					},
					{
						title:'整套房子·上海',
						juti:'近外滩全新装修，南京东路3分钟',
						price:166,
						pf:4.69,
						img:"https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3251279264,3464384023&fm=26&gp=0.jpg"
					},
					{
						title:'整套房子·上海',
						juti:'近外滩全新装修，南京东路3分钟',
						price:166,
						pf:4.69,
						img:"https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3251279264,3464384023&fm=26&gp=0.jpg"
					}
				]
			},
			{
				title:'北京',
				content:[
					{
						title:'整套房子·北京',
						juti:'近外滩全新装修，南京东路3分钟',
						price:166,
						pf:4.69,
						img:"https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1681344291,2278567894&fm=26&gp=0.jpg"
					},
					{
						title:'整套房子·北京',
						juti:'近外滩全新装修，南京东路3分钟',
						price:166,
						pf:4.69,
						img:"https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1681344291,2278567894&fm=26&gp=0.jpg"
					},
					{
						title:'整套房子·北京',
						juti:'近外滩全新装修，南京东路3分钟',
						price:166,
						pf:4.69,
						img:"https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1681344291,2278567894&fm=26&gp=0.jpg"
					},
					{
						title:'整套房子·北京',
						juti:'近外滩全新装修，南京东路3分钟',
						price:166,
						pf:4.69,
						img:"https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1681344291,2278567894&fm=26&gp=0.jpg"
					}
				]
			},
			{
				title:'广州',
				content:[
					{
						title:'整套房子·广州',
						juti:'近外滩全新装修，南京东路3分钟',
						price:166,
						pf:4.69,
						img:"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1921268840,2459009760&fm=26&gp=0.jpg"
					},
					{
						title:'整套房子·广州',
						juti:'近外滩全新装修，南京东路3分钟',
						price:166,
						pf:4.69,
						img:"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1921268840,2459009760&fm=26&gp=0.jpg"
					},
					{
						title:'整套房子·广州',
						juti:'近外滩全新装修，南京东路3分钟',
						price:166,
						pf:4.69,
						img:"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1921268840,2459009760&fm=26&gp=0.jpg"
					},
					{
						title:'整套房子·广州',
						juti:'近外滩全新装修，南京东路3分钟',
						price:166,
						pf:4.69,
						img:"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1921268840,2459009760&fm=26&gp=0.jpg"
					}
				]
			}
		]
	})
})

//首页，可能去的地方，数据
router.post('/get_index_possiblePlaces',function(req,res){
	res.json({
	    err:0,
	    msg:'ok',
		data:[
			{
				title:'长沙',
				price:157,
				img:"https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1076012216,3140751610&fm=26&gp=0.jpg"
			},
			{
				title:'西安',
				price:147,
				img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584448121542&di=a596025acb334eac80801e5ac8da6d4a&imgtype=0&src=http%3A%2F%2Fpic.people.com.cn%2FNMediaFile%2F2014%2F0721%2FMAIN201407211547000387316565303.jpg"
			},
			{
				title:'北京',
				price:125,
				img:"https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2297283497,2140518517&fm=26&gp=0.jpg"
			},
			{
				title:'成都',
				price:230,
				img:"https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1457343021,3861175008&fm=26&gp=0.jpg"
			},
			{
				title:'上海',
				price:320,
				img:"https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2679324262,4099903857&fm=26&gp=0.jpg"
			}
		]
	})
})

//故事，
router.post('/get_tabbar_gushi',function(req,res){
	res.json({
	    err:0,
	    msg:'ok',
	    data:[
			{
				title:'民宿',
				content:[
					{
						title:'清迈',
						juti:'近外滩全新装修，南京东路3分钟',
						img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585388442797&di=e75dc7da0e0e865af0e2861ae8d83298&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20171119%2Fdb97bda6a1d34976b003b77ace34cdda.jpeg"
					},
					{
						title:'马尔代夫',
						juti:'近外滩全新装修，南京东路3分钟',
						img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585388462231&di=c1367e6d9f98fa3cb3dcfe669df7de76&imgtype=0&src=http%3A%2F%2Ffuyang.zxdyw.com%2FU_Image%2F2018%2F0110%2Fe%2F20180110111456_3721.jpg"
					},
					{
						title:'纽约',
						juti:'近外滩全新装修，南京东路3分钟',
						img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585388481658&di=017c8a7c668eed194c808816d5712fdf&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn15%2F0%2Fw960h640%2F20181121%2Fa9c3-hmhhnqt2809456.jpg"
					},
					{
						title:'英国',
						juti:'近外滩全新装修，南京东路3分钟',
						img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585388507968&di=afedd21571b4f7fc965c82eda56d5191&imgtype=0&src=http%3A%2F%2Fwww.kaixian.tv%2Fgd%2Fd%2Ffile%2F201509%2F24%2F11982eab1e3cda794834905c2498b785.jpg"
					}
				]
			},
			{
				title:'美食',
				content:[
					{
						title:'清迈',
						juti:'近外滩全新装修，南京东路3分钟',
						img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585388170189&di=0c7ee048a9808a0306197773288a6e52&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180703%2F056354d7d1e7459c87e766ffab876c89.jpeg"
					},
					{
						title:'普及',
						juti:'近外滩全新装修，南京东路3分钟',
						img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585388308521&di=7577c58f1d5ea0ee0354badfed8a1297&imgtype=0&src=http%3A%2F%2Fimg.improve-yourmemory.com%2Fpic%2F72071791ca96de6e8983c1310190e0fa-2.jpg"
					},
					{
						title:'首尔',
						juti:'近外滩全新装修，南京东路3分钟',
						img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585388331644&di=7a81b8f97cd85e79fef63b2c961277ed&imgtype=0&src=http%3A%2F%2Fimg.mp.itc.cn%2Fupload%2F20161128%2F3e2f7710c7354ddb91785c3db1fba025_th.jpeg"
					},
					{
						title:'台北',
						juti:'近外滩全新装修，南京东路3分钟',
						img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585388369982&di=06100985149c84a8ac6c28780ead4237&imgtype=0&src=http%3A%2F%2Fpic75.nipic.com%2Ffile%2F20150730%2F18252322_180357801001_2.jpg"
					},
					{
						title:'成都',
						juti:'近外滩全新装修，南京东路3分钟',
						img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585388394925&di=fd5179e5d3b5ea6797a86e37cf6b6fb6&imgtype=0&src=http%3A%2F%2Fpic41.nipic.com%2F20140501%2F2531170_200443732000_2.jpg"
					}
				]
			},
			{
				title:'景点',
				content:[
					{
						title:'成都',
						juti:'近外滩全新装修，南京东路3分钟',
						img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585388576319&di=2949e50ba64e35eb48959cf1a2b6f16a&imgtype=0&src=http%3A%2F%2Fvsd-picture.cdn.bcebos.com%2Fd38a4d770b4e1a2ebd85fbea9c55e00407696b26.jpg"
					},
					{
						title:'首尔',
						juti:'近外滩全新装修，南京东路3分钟',
						img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585388621718&di=413958f1ce79d2d860b61da842707742&imgtype=0&src=http%3A%2F%2Fyouimg1.c-ctrip.com%2Ftarget%2Ftg%2F859%2F398%2F783%2F4a2156970155436f96eebade03ae0b45.jpg"
					},
					{
						title:'上海',
						juti:'近外滩全新装修，南京东路3分钟',
						img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585388648344&di=c8991f89ff2592f27bb989e6f40599d9&imgtype=0&src=http%3A%2F%2Fyouimg1.c-ctrip.com%2Ftarget%2Ftg%2F688%2F129%2F304%2F0ac56612decc4ef0bab3ad823f549062.jpg"
					},
					{
						title:'云南',
						juti:'近外滩全新装修，南京东路3分钟',
						img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585388677074&di=a64ebf68107114582e79a62b3a956fe8&imgtype=0&src=http%3A%2F%2Fyouimg1.c-ctrip.com%2Ftarget%2Ftg%2F170%2F281%2F076%2Fbe2d4896754a47c1b1186da72722375b.jpg"
					}
				]
			},
			{
				title:'艺术',
				content:[
					{
						title:'清迈',
						juti:'近外滩全新装修，南京东路3分钟',
						img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585388753148&di=e4904bbe1a12debc962e9ab37fe361af&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fcfd036e912365cdca41c89db0e85be24b740d59e3e569-hPwhXl_fw658"
					},
					{
						title:'马尔代夫',
						juti:'近外滩全新装修，南京东路3分钟',
						img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585388772148&di=df747d00e55e65ece36598124ee8b3e4&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201705%2F15%2F20170515234048_zJmvR.jpeg"
					},
					{
						title:'纽约',
						juti:'近外滩全新装修，南京东路3分钟',
						img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585388807282&di=23c2c10aedabec1c23db4fb2ea303f65&imgtype=0&src=http%3A%2F%2Fupload.art.ifeng.com%2F2018%2F0821%2F1534838143138.jpg"
					},
					{
						title:'英国',
						juti:'近外滩全新装修，南京东路3分钟',
						img:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585388824752&di=ba889f73c1527e7f87a079917b2770df&imgtype=0&src=http%3A%2F%2Fi8.qhimg.com%2Fdmsmty%2F350_200_%2Ft019ca0e0e01bc6fa41.jpg"
					}
				]
			}
		]
	})
})

module.exports = router;