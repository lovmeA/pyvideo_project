# coding: utf-8
# +-------------------------------------------------------------------
# | Project     : f2d6
# | Author      : 晴天雨露
# | QQ/Email    : 184566608<qingyueheji@qq.com>
# | Time        : 2020-02-06 21:22
# | Describe    : views
# +-------------------------------------------------------------------
from django.conf import settings
from django.shortcuts import render, redirect, reverse

from root.views.utils import GetVideos


def index(request):
    return redirect(reverse('like', args=(1, 200, 1, 1))+"?host=")


def video(request, p, height, window, full):
    videos = GetVideos()
    data_lens = (str(len(videos.videos) / 10)).split('.')

    if p <= 0:
        return redirect(reverse('like', args=(1, height, window, full)))
    if int(data_lens[1]) == 0 and p > int(data_lens[0]):
        return redirect(reverse('like', args=(int(data_lens[0]), height, 0, full)))
    if int(data_lens[1]) > 0 and p > (int(data_lens[0]) + 1):
        return redirect(reverse('like', args=(int(data_lens[0]) + 1, height, 0, full)))

    context = {
        'up': p - 1,
        'down': p + 1,
        'datas': videos.videos[((p - 1) * 10):(10 * p)],
        'title': '视频首页',
        'height': height,
        'window': window,
        'full': full,
        'host': request.GET.get('host', '')
    }
    return render(request, 'index.html', context=context)
