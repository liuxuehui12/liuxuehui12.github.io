//定义一个头部透明度效果的函数
function setHeader(){
    //获取元素
    var nav = document.querySelector(".g_nav");
    //页面滚动事件
    window.onscroll = function(){
        //获取页面超出浏览器的高度
        var top = document.body.scrollTop || document.documentElement.scrollTop;

        //定义一个高度
        var height = 500;

        //定义一个透明度变量
        var opacity = 0;
        if(top > height){
            opacity=1;
        }else{
            opacity = top / height *1;
        }

        //设置头部背景的透明度
        nav.style.backgroundColor = "rgba(231,231,231,"+opacity+")";
    }
}

//调用
setHeader();