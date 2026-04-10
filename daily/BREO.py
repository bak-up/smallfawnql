#by:哆啦A梦
#入口:http://mx.qrurl.net/h5/wxa/link?sid=26407uif5Oq
#抓包breoplus.breo.cn的域名下的token，多账号换行分割
#账号变量名:BREO
#new Env("BREO")
#cron 8 9,10,11 * * *


import requests
import json
import os
import time

def get_random_one_word():
    try:
        response = requests.get("https://uapis.cn/api/say")
        if response.status_code == 200:
            return response.text.strip()
        else:
            return "无法获取一言"
    except Exception as e:
        print(f"获取一言时出错: {e}")
        return "无法获取一言"

def get_proclamation():
    primary_url = "https://github.com/3288588344/toulu/raw/refs/heads/main/tl.txt"
    backup_url = "https://tfapi.cn/TL/tl.json"
    try:
        response = requests.get(primary_url, timeout=10)
        if response.status_code == 200:
            print("\n" + "=" * 50)
            print("📢 公告信息")
            print("=" * 35)
            print(response.text)
            print("=" * 35 + "\n")
            print("公告获取成功，开始执行任务...\n")
            return
    except requests.exceptions.RequestException as e:
        print(f"获取公告时发生错误: {e}, 尝试备用链接...")

    try:
        response = requests.get(backup_url, timeout=10)
        if response.status_code == 200:
            print("\n" + "=" * 50)
            print("📢 公告信息")
            print("=" * 35)
            print(response.text)
            print("=" * 35 + "\n")
            print("公告获取成功，开始执行任务...\n")
        else:
            print(f"⚠️ 获取公告失败，状态码: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"⚠️ 获取公告时发生错误: {e}, 可能是网络问题或链接无效。")

def post_to_breo(token, content, title):
    url = "https://breoplus.breo.cn/breo-app/communityBaseInfo/releasePost"
    headers = {
        "token": token,
        "device-type": "Xiaomi",
        "device-version": "10",
        "channel": "Breo",
        "version_code": "30201",
        "version": "3.2.1",
        "encrypt": "1",
        "Content-Type": "application/json; charset=UTF-8"
    }
    data = {
        "anonymoused": 1,
        "content": content,
        "expressText": "",
        "images": [],
        "subTitle": "",
        "title": title,
        "topicText": ""
    }
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        if response.status_code == 200:
            result = response.json()
            if result.get("success", False):
                print("✅ 发帖成功！")
                print(f"帖子 ID: {result['result']['id']}")
                print(f"帖子标题: {result['result']['title']}")
                return result["result"]["id"]
            else:
                print(f"❌ 发帖失败，错误信息：{result.get('message', '未知错误')}")
                return None
        else:
            print(f"❌ 请求失败，状态码：{response.status_code}")
            return None
    except Exception as e:
        print(f"❌ 请求错误: {e}")
        return None

def collect_post(token, post_id):
    url = "https://breoplus.breo.cn/breo-app/communityBaseInfo/collect"
    headers = {
        "token": token,
        "device-type": "Xiaomi",
        "device-version": "10",
        "channel": "Breo",
        "version_code": "30201",
        "version": "3.2.1",
        "encrypt": "1",
        "Content-Type": "application/json; charset=UTF-8"
    }
    data = {
        "postId": post_id
    }
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        if response.status_code == 200:
            result = response.json()
            if result.get("success", False):
                print("✅ 收藏成功！")
                print(f"获得点数: {result['result']['point']}")
                print(f"成长值: {result['result']['grow']}")
            else:
                print(f"❌ 收藏失败，错误信息：{result.get('message', '未知错误')}")
        else:
            print(f"❌ 请求失败，状态码：{response.status_code}")
    except Exception as e:
        print(f"❌ 请求错误: {e}")

def comment_post(token, post_id):
    for _ in range(2):  # 评论2次
        comment_content = get_random_one_word()  # 使用随机一言作为评论内容
        url = "https://breoplus.breo.cn/breo-app/communityBaseInfo/comment"
        headers = {
            "token": token,
            "device-type": "Xiaomi",
            "device-version": "10",
            "channel": "Breo",
            "version_code": "30201",
            "version": "3.2.1",
            "encrypt": "1",
            "Content-Type": "application/json; charset=UTF-8"
        }
        data = {
            "anonymoused": 0,
            "commentText": comment_content,
            "postId": post_id
        }
        try:
            response = requests.post(url, headers=headers, data=json.dumps(data))
            if response.status_code == 200:
                result = response.json()
                if result.get("success", False):
                    print("✅ 评论成功！")
                    print(f"评论内容: {result['result']['rootOutVO']['commentText']}")
                    print(f"获得点数: {result['result']['point']}")
                    print(f"成长值: {result['result']['grow']}")
                else:
                    print(f"❌ 评论失败，错误信息：{result.get('message', '未知错误')}")
            else:
                print(f"❌ 请求失败，状态码：{response.status_code}")
        except Exception as e:
            print(f"❌ 请求错误: {e}")
        time.sleep(1)  # 避免频繁请求

def browse_mall(token):
    url = "https://breoplus.breo.cn/breo-app/user/po-task-info/mall"
    headers = {
        "token": token,
        "device-type": "Xiaomi",
        "device-version": "10",
        "channel": "Breo",
        "version_code": "30201",
        "version": "3.2.1",
        "encrypt": "1"
    }
    try:
        response = requests.post(url, headers=headers)
        if response.status_code == 200:
            result = response.json()
            if result.get("success", False):
                print("✅ 浏览商城成功！")
                print(f"获得点数: {result['result']['point']}")
                print(f"成长值: {result['result']['grow']}")
            else:
                print(f"❌ 浏览商城失败，错误信息：{result.get('message', '未知错误')}")
        else:
            print(f"❌ 请求失败，状态码：{response.status_code}")
    except Exception as e:
        print(f"❌ 请求错误: {e}")

def punch_in(token):
    url = "https://breoplus.breo.cn/breo-app/user/po-task-info/punch"
    headers = {
        "Host": "breoplus.breo.cn",
        "Connection": "keep-alive",
        "Content-Length": "0",
        "content-type": "application/json",
        "token": token,
        "charset": "utf-8",
        "Referer": "https://servicewechat.com/wx61457400e4212cec/304/page-frame.html",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/134.0.6998.136 Mobile Safari/537.36 XWEB/1340043 MMWEBSDK/20241202 MMWEBID/3628 MicroMessenger/8.0.56.2800(0x2800385E) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android",
        "Accept-Encoding": "gzip, deflate, br"
    }
    try:
        response = requests.post(url, headers=headers)
        if response.status_code == 200:
            result = response.json()
            if result.get("success", False):
                print("✅ 签到成功！")
                print(f"获得点数: {result['result']['point']}")
                print(f"成长值: {result['result']['grow']}")
            else:
                print(f"❌ 签到失败，错误信息：{result.get('message', '未知错误')}")
        else:
            print(f"❌ 请求失败，状态码：{response.status_code}")
    except Exception as e:
        print(f"❌ 请求错误: {e}")

if __name__ == "__main__":
    # 获取公告
    #get_proclamation()

    # 从环境变量读取 token
    tokens = os.getenv("BREO", "").splitlines()

    if not tokens:
        print("❌ 未检测到 账号信息，退出脚本。")
    else:
        print("=============== 开始执行任务 ===============")
        for i, token in enumerate(tokens, 1):
            if token.strip():  # 跳过空行
                print(f"\n-------------- 账号 {i} 开始 --------------")
                print("🚀 正在签到...")
                punch_in(token)

                print("\n📝 正在发布帖子...")
                post_id = post_to_breo(token, "这是一个自动发布的帖子", "自动化测试")
                if post_id:
                    print("\n⭐ 正在收藏帖子...")
                    collect_post(token, post_id)

                    print("\n💬 正在评论帖子...")
                    comment_post(token, post_id)
                else:
                    print("❌ 发帖失败，跳过后续操作。")

                print("\n🛒 正在浏览商城...")
                browse_mall(token)

                print(f"-------------- 账号 {i} 结束 --------------")

        print("\n=============== 所有任务执行完毕 ===============")