import json

import requests

from BD09MCtoBD09 import BD09MCtoBD09


def get_coord(addr, city='上海市', timeout=30):
    headers = {
        'Connection': 'keep-alive',
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"',
        'sec-ch-ua-mobile': '?0',
        'User-Agent': (
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
            '(KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36'),
        'sec-ch-ua-platform': '"macOS"',
        'Accept': '*/*',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Dest': 'script',
        'Referer': 'https://qhduan.github.io/',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
    }

    params = {
        'qt': 'gc',
        'wd': addr,
        'cn': city,
        'ie': 'utf-8',
        'oue': '1',
        'fromproduct': 'jsapi',
        'res': 'api',
        'ak': 'KOmVjPVUAey1G2E8zNhPiuQ6QiEmAwZu',
        'callback': 'BMap._rd._cbk71739',
        'v': '3.0',
    }

    response = requests.get('https://api.map.baidu.com/', headers=headers, params=params, timeout=timeout)
    s = response.text.index('{')
    e = response.text.rindex('}')
    obj = json.loads(response.text[s:e + 1])['content']['coord']
    coord = [float(obj['x']), float(obj['y'])]
    new_coord = BD09MCtoBD09(coord)
    return {
        'name': addr,
        'lng': new_coord[0],
        'lat': new_coord[1],
    }
