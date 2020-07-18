/*
    obj代表需要做动画对象
    target目标位置
    callback回调函数
*/
function animated(obj,target,callback){
    // 如果多个元素都使用这个动画函数，每次都要var 声明定时器。我们可以给不同的元素使用不同的定时器（自己专门用自己的定时器）。

    // 解决方案就是 让我们元素只有一个定时器执行
    // 先清除以前的定时器，只保留当前的一个定时器执行
    clearInterval(obj.timer);

    // 核心原理:利用 JS 是一门动态语言，可以很方便的给当前对象添加属性
    obj.timer = window.setInterval(function(){
        // 公式: (目标值 - 现在的位置)   /  10   得到步长
        var step =   (target - obj.offsetLeft) / 10 ;
            // 步长值如果是正数,需要向上取整  如果是负数,就需要向下取整
            step =   step >=0 ? Math.ceil(step) :  Math.floor(step)

        if( obj.offsetLeft == target){
            window.clearInterval( obj.timer );
            // 动画执行完毕,如果有回调函数就调用回调函数
            /* if(callback){
                callback();
            } */

            // 等效于上面if
            callback && callback();
        }else{
            obj.style.left = obj.offsetLeft + step + "px";
        }
    },15)
}

// 滚动动画函数
function animated_scroll(obj,target,callback){
    clearInterval(obj.timer);

    obj.timer = window.setInterval(function(){
        var step =   (target - window.pageYOffset) / 10 ;
            step =   step >=0 ? Math.ceil(step) :  Math.floor(step)

        if( window.pageYOffset == target){
            window.clearInterval( obj.timer );
            callback && callback();
        }else{
            window.scroll(0, window.pageYOffset + step )
        }
    },15)
}


