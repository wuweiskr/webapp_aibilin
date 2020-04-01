function codeFn(){

    let arr = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D'];

    // 随机打乱顺序
    arr.sort(function(){
        return Math.random - 0.5;
    })

    return ''+arr[0]+arr[1]+arr[2]+arr[3]+arr[4]+arr[5];
    
}


module.exports = {
    codeFn
}


