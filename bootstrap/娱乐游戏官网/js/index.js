//定义设置头部的透明度效果的 函数
function setHeaderFunc(){
	//步骤
	//1. 获取相关的元素
	var ele = document.querySelector(".yl_nav")
	//2.监听页面的滚动事件
	window.onscroll = function(){
		//3.获取页面超出浏览器的高度
		//  '|| ' 这个运算符   或
		var t = document.body.scrollTop || document.documentElement.scrollTop;
		//4.定义一个高度 
		var h = 500;
		//5.定义一个透明变量
		var opacity = 0 ;
		if(t > h){
			opacity =1 ;
		}else {
			opacity = t / h * 1;
		}
		
		//设置头部的背景透明度
		ele.style.backgroundColor="rgba(231,231,231,"+opacity+")";
	}
}

//调用函数
setHeaderFunc()
