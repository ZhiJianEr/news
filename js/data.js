var data,
    myScroll,
    pullDownEl, pullDownOffset,
    pullUpEl, pullUpOffset,
    generatedCount = 0;

//上拉刷新
function pullDownAction() {
    $.ajax({
        url:'http://api.iclient.ifeng.com/ClientNews?id=SYLB10,SYDT10&gv=5.4.0&os=ios&uid=8jWzrXDWQeep2Nw4AZYzmHxkbneHy4Fj&action=down',
        type:'get',
        dataType:'jsonp',
        jsonp:'callback',
        success:function(data){
            console.log(data)
        }
    });



    $.getJSON('/uploads/rs/200/ptvnx6ur/test.json', function (data, state) {
        if (data && data.state == 1 && state == 'success') {
            //本地测试，为了看到加载中效果故加上定时器
            setTimeout(function () {
                $('#news-lists').before(data.data);
                myScroll.refresh();
            }, 600);
        }
    });
}
//下拉加载
function pullUpAction() {
    $.getJSON('/uploads/rs/200/ptvnx6ur/test.json', function (data, state) {
        if (data && data.state == 1 && state == 'success') {
            //本地测试，为了看到加载中效果故加上定时器
            setTimeout(function () {
                $('#news-lists').append(data.data);
                myScroll.refresh();
            }, 600);
        }
    });
}

//初始化绑定iScroll控件
document.addEventListener('touchmove', function (e) {
    e.preventDefault();
}, false);
document.addEventListener('DOMContentLoaded', loaded, false);

function loaded() {
    pullDownEl = document.getElementById('pullDown');
    pullDownOffset = pullDownEl.offsetHeight;
    pullUpEl = document.getElementById('pullUp');
    pullUpOffset = pullUpEl.offsetHeight;

    /**
     * 初始化iScroll控件
     * onRefresh
     * onScrollMove
     * onScrollEnd
     */
    myScroll = new iScroll('wrapper', {
        vScrollbar: false,
        topOffset: pullDownOffset,
        onRefresh: function () {
            if (pullDownEl.className.match('loading')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
            } else if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
            }
        },
        onScrollMove: function () {
            if (this.y > 5 && !pullDownEl.className.match('flip')) {
                pullDownEl.className = 'flip';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
                this.minScrollY = 0;
            } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
            }
        },
        onScrollEnd: function () {
            if (pullDownEl.className.match('flip')) {
                pullDownEl.className = 'loading';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
                pullDownAction();
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                pullUpAction();
            }
        }
    });
}