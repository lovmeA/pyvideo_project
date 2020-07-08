function VideoPlay(descHeight = 200, showWindow = 0, fullWindow = 0) {
    this.index = 0;
    this.videoIndex = 0;

    this.width = 0;
    this.height = 0;
    this.href = undefined;
    this.title = undefined;

    this.videoObj = undefined;
    this.titleIndex = undefined;
    this.fullWindow = fullWindow;
    this.showWindow = showWindow;
    this.descHeight = descHeight;
    this.fullRestoreBox = undefined;

    this.Run();
}

VideoPlay.prototype.routeConfig = function (paths) {
    var me = this;
    paths[paths.length - 1] = me.fullWindow;
    paths[paths.length - 2] = me.showWindow;
    return paths.join('.');
};

// 重置播放窗口高度宽度以及定位
VideoPlay.prototype.heightWidth = function () {
    var me = this;
    var css = {height: me.height, width: me.width};

    $(me.videoObj).css(css);
    $(document.getElementsByClassName('video-window')).css(css);
    $(document.getElementsByClassName('layui-layer-content')).css(css);

    $(document.getElementsByClassName('up-shade')).css('height', me.height - 67);
    $(document.getElementsByClassName('next-shade')).css('height', me.height - 67);

    css['left'] = $(window).width() / 2 - me.width / 2;
    css['top'] = $(window).height() / 2 - me.height / 2;

    $(document.getElementsByClassName('layui-layer')).css(css);
};

// 切换下一个视频
VideoPlay.prototype.nextVideo = function () {
    var me = this;
    me.index++;
    me.videoParams(me.descHeight).heightWidth();

    me.videoObj.src = me.href;
    me.videoObj.load();
    layer.title(me.title, me.titleIndex);
};

// 全屏切换
VideoPlay.prototype.fullRestore = function () {
    var me = this;

    var aObj = me.fullRestoreBox.children('a');
    if (me.fullWindow === 1) {
        aObj.text('○');
        aObj.addClass('text');
        me.fullRestoreBox.attr('title', '还原');
        me.fullRestoreBox.addClass('full-restore-gree');
    } else {
        aObj.text('＋');
        aObj.removeClass('text');
        me.fullRestoreBox.attr('title', '视频窗口最大比例');
        me.fullRestoreBox.removeClass('full-restore-gree');
    }
};

// 获取视频参数
VideoPlay.prototype.videoParams = function (descHeight) {
    var me = this;
    var content = $($('.qingyueheji'));
    this.videoIndex = content.length - 1;

    if (this.videoIndex >= me.index) {
        var video = $(content[me.index]).children('video')[0];
        me.href = video.currentSrc;

        if (me.fullWindow === 1) descHeight = 0;

        me.height = $(window).height() - descHeight;
        me.width = (me.height * video.videoWidth) / video.videoHeight;
        me.title = $(content[me.index]).children('.title').text();
        return me
    } else {
        window.location.href = me.routeConfig($('.next-page').attr('href').split('.'));
    }
};

// 视频播放窗口
VideoPlay.prototype.playVideo = function () {
    var me = this;
    var html = '<div class="video-window" style="height:' + me.height + 'px;"><video id="play_video" src="' + me.href + '" autoplay="autoplay" controls="controls" type="video/mp4" style="height: ' + me.height + 'px;"></video><div class="up-shade" style="height:' + (me.height - 67) + 'px;"></div><div class="next-shade" style="height:' + (me.height - 67) + 'px;"></div></div>';

    layer.msg(html, {
        time: 0,
        title: me.title,
        shadeClose: false,
        area: [me.width + 'px', me.height + 'px'],
        shade: [0.5, '#393D49'],
        success: function (layero, index) {
            me.titleIndex = index;
            $(document.getElementsByClassName('layui-layer-dialog')).append("<div class='full-restore-box'><a href='javascript:void(0)'>＋</a></div><div title='关闭' class='close-box'><a href='javascript:void(0)'>×</a></div>");
            $(document.getElementsByClassName('layui-layer-content')).css('height', me.height);
            me.videoObj = document.getElementById("play_video");
            me.fullRestoreBox = $(document.getElementsByClassName('full-restore-box'));

            $(document.getElementsByClassName('close-box')).click(function () {
                layer.close(index)
            });

            me.fullRestoreBox.on('click', function () {
                if (me.fullWindow === 0) {
                    me.fullWindow = 1;
                    me.videoParams(0).heightWidth();
                } else {
                    me.fullWindow = 0;
                    me.videoParams(me.descHeight).heightWidth();
                }
                me.fullRestore();
            });

            me.fullRestore();

            if (me.fullWindow === 1) {
                me.fullRestoreBox.addClass('full-restore-gree');
                var aObj = me.fullRestoreBox.children('a');
                aObj.text('○');
                aObj.addClass('text');
            }

            me.videoObj.addEventListener('ended', function () {
                me.nextVideo()
            }, false);
        }
    });
};

VideoPlay.prototype.Run = function () {
    var me = this;

    $(window).resize(function () {
        me.videoParams(me.descHeight).heightWidth();
    });

    $('.shade').on('click', function () {
        me.index = $(this).parent('.qingyueheji').index();
        me.videoParams(me.descHeight).playVideo();
    });

    $(document).on('click', '.video-window .next-shade', function () {
        me.nextVideo()
    });

    $(document).on('click', '.video-window .up-shade', function () {
        me.index--;

        if (me.videoIndex >= 0 && me.index >= 0) {
            me.videoParams(me.descHeight).heightWidth();
            me.videoObj.src = me.href;
            me.videoObj.load();
            layer.title(me.title, me.titleIndex);
        } else if (me.index === -1) {
            window.location.href = me.routeConfig($('.up-page').attr('href').split('.'));
        }
    });

    // 页面元素全部加载完成后处理
    document.onreadystatechange = function () {
        if (document.readyState === "complete" && me.showWindow === 1) {
            me.videoParams(me.descHeight).playVideo();
        }
    };
};

$(function () {
    new VideoPlay(maxMinHeight, showWindow, fullWindow);
});
