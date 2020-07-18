var playList = [
    {
        id: 169185,
        name: "认真的雪",
        artists: "薛之谦",
        picUrl:
            "https://p2.music.126.net/yWtj0UXRJBCT9YI7csmAcw==/109951164190741294.jpg",
        playSrc: "https://music.163.com/song/media/outer/url?id=id.mp3",
    },
    {
        id: 5253734,
        name: "恋爱达人",
        artists: "罗志祥",
        picUrl:
            "https://p1.music.126.net/n4YTVSO7QK1VRQMCEeOPqA==/80264348845281.jpg",
        playSrc: "https://music.163.com/song/media/outer/url?id=id.mp3",
    },
    {
        id: 277302,
        name: "爱",
        artists: "莫文蔚",
        picUrl:
            "https://p1.music.126.net/hcY73QYZt36DeGf91euboQ==/18921495602636668.jpg",
        playSrc: "https://music.163.com/song/media/outer/url?id=id.mp3",
    },
];

var list = document.querySelector(".list");
var lis;
playList.forEach(function (element, index) {
    var node = document.createElement("li");
    node.innerHTML =
        "<span><img src='./img/喇叭.png' alt=''></span>" + element.name;
    node.dataset.id = element.id;

    list.appendChild(node);
    lis = list.querySelectorAll(".list li");
    lis[0].classList.add("play");

    //点击li切换歌曲
    node.addEventListener("click", function () {
        // console.log(this.dataset.id);
        //audio 路径替换
        var songId = this.dataset.id;
        // audio.src =
        //     "https://music.163.com/song/media/outer/url?id=" + songId + ".mp3";

        // //根据id查找歌曲对象
        // var n = playList.filter(function (element, index) {
        //     return element.id == songId;
        // });

        // // console.log(n);
        // document.querySelector(".mask").style.backgroundImage =
        //     "url('" + n[0].picUrl + "')";
        // document.querySelector(".glue img").src = n[0].picUrl;
        // document.querySelector(".info h3").innerText = n[0].name;
        // document.querySelector(".info h5").innerText = n[0].artists;
        change(songId);

        // console.log(lis);
        for (var i = 0; i < lis.length; i++) {
            lis[i].classList.remove("play");
        }
        this.classList.add("play");
    });
});

function change(songId) {
    audio.src =
        "https://music.163.com/song/media/outer/url?id=" + songId + ".mp3";

    //根据id查找歌曲对象
    var n = playList.filter(function (element, index) {
        return element.id == songId;
    });

    // console.log(n);
    document.querySelector(".mask").style.backgroundImage =
        "url('" + n[0].picUrl + "')";
    document.querySelector(".glue img").src = n[0].picUrl;
    document.querySelector(".info h3").innerText = n[0].name;
    document.querySelector(".info h5").innerText = n[0].artists;
}

var audio = document.querySelector("audio");

var progress = document.querySelector(".progress input");
var slider = document.querySelector(".progress .slider");

audio.addEventListener("durationchange", function () {
    // console.log(audio.duration);

    //调整input最大值
    progress.max = audio.duration;
});

//播放进行中 当前的时间发生变化
audio.addEventListener("timeupdate", function () {
    // console.log(audio.currentTime);

    // console.log("inputing",inouting);
    if (inputing) {
        return;
    }

    // 调整slider当前位置
    slider.style.width = (audio.currentTime / audio.duration) * 100 + "%";
});

var inputing = false;
//input滑动时
progress.addEventListener("input", function () {
    inputing = true;
    //  console.log(this.value);

    //设置滑块位置
    slider.style.width = (this.value / this.max) * 100 + "%";
});

progress.addEventListener("change", function () {
    //设置 歌曲播放位置
    audio.currentTime = this.value;
    inputing = false;
});

var num = 0;

var stage = document.querySelector(".stage");
audio.addEventListener("play", function () {
    stage.classList.add("playing");
    img.src = "./img/暂停.png";
    stage.classList.add("playing");
});
audio.addEventListener("pause", function () {
    stage.classList.remove("playing");
    img.src = "./img/播放.png";
    stage.classList.remove("playing");
});

var count = 0;

var img = document.querySelector(".controls .left ul .ok img");
var control = document.querySelectorAll(".controls .left ul li");
control.forEach(function (element, index) {
    element.addEventListener("click", function () {
        // console.log(index);
        // 上一曲
        if (index == 0) {
            count--;
            if (count < 0) {
                count = lis.length - 1;
            }
            change(lis[count].dataset.id);
            for (var i = 0; i < lis.length; i++) {
                lis[i].classList.remove("play");
            }
            lis[count].classList.add("play");
        }

        // 暂停

        if (index == 1) {
            num++;
            if (num % 2 == 0) {
                img.src = "./img/播放.png";
                stage.classList.remove("playing");
                audio.pause();
            }
            if (num % 2 == 1) {
                img.src = "./img/暂停.png";
                stage.classList.add("playing");
                audio.play();
            }
        }

        // 下一曲
        if (index == 2) {
            count++;
            if (count > lis.length - 1) {
                count = 0;
            }
            change(lis[count].dataset.id);
            for (var i = 0; i < lis.length; i++) {
                lis[i].classList.remove("play");
            }
            lis[count].classList.add("play");
        }
    });
});
