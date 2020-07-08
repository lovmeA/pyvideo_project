# coding: utf-8
# +-------------------------------------------------------------------
# | Project     : f2d6
# | Author      : 晴天雨露
# | QQ/Email    : 184566608<qingyueheji@qq.com>
# | Time        : 2020-02-06 21:46
# | Describe    : utils
# +-------------------------------------------------------------------
import os

import requests
from django.conf import settings


def get_html(url):
    try:
        headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,und;q=0.7',
            'Cache-Control': 'max-age=0',
            'Connection': 'keep-alive',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36'
        }
        reponse = requests.get(url=url, headers=headers)
        reponse.encoding = 'utf8'
        if reponse.status_code == 200:
            return reponse.json().get('data').get('info')
        return None
    except:
        return None


class GetVideos:
    def __init__(self):
        self._videos_list = []

        self._get_videos(os.path.join(settings.BASE_DIR, 'static', 'videos'))

    def _get_videos(self, path):
        for video in os.listdir(path):
            s_path = os.path.join(path, video)
            if os.path.isdir(s_path):
                self._get_videos(s_path)
            else:
                ss_path = s_path.replace(settings.BASE_DIR, '').replace('\\', '/')
                self._videos_list.append({
                    'path': ss_path,
                    'title': ss_path.split('/')[-1]
                })

    @property
    def videos(self):
        return self._videos_list


# --insecure
