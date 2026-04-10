
/*
------------------------------------------
@Author: sm
@Date: 2024.06.07 19:15
@Description:  IQOO社区小程序 积分脚本
cron: 30 8 * * *
------------------------------------------
#Notice:   
变量名iqoo
抓取方法：https://bbs-api.iqoo.com请求头authorization 去掉Bearer
多账户&或换行

⚠️【免责声明】
------------------------------------------
1、此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2、由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3、请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4、此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5、本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6、如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7、所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。
*/

const { Env } = require("../tools/env")
const $ = new Env("iqoo社区");
let ckName = `iqoo`;
const strSplitor = "#";
const axios = require("axios");
const defaultUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.31(0x18001e31) NetType/WIFI Language/zh_CN miniProgram"


class Task {
    constructor(env) {
        this.index = $.userIdx++
        this.user = env.split(strSplitor);
        this.token = this.user[0];
        this.postId = ''
        this.threadId = ''

    }
    request(options) {
        let baseHeaders = {
            sign: this.getSign(options.method, options.url.split('https://bbs-api.iqoo.com')[1].split("?")[0], options.data ? options.data : ''),
            'authorization': 'Bearer ' + this.token,
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090a13) UnifiedPCWindowsWechat(0xf254173b) XWEB/19027",
            "x-platform": "mini",
            "x-visitor": "b89d8b0ffa920e96f3cb4c1f69ec2c66"
        }

        options.headers = Object.assign(baseHeaders, options.headers)


        return axios.request(options)
    }
    async userInfo() {
        let options = {
            method: 'GET',
            url: `https://bbs-api.iqoo.com/api/v3/v3/user?userId=${this.id}`,
            headers: {

            },
            data: {
                userId: this.id
            }
        };
        let { data: result } = await this.request(options);
        if (result?.Code == '0') {
            $.log(`${this.index}账号[${this.index}] 获取用户信息成功`)
        }
    }
    async run() {
        await this.getTreadList()
        if (this.threadId && this.postId) {
            await this.likePost(this.threadId, this.postId)
            await $.wait(5000)
            await this.sharePost(this.threadId)
            await $.wait(5000)

            await this.viewPost(this.threadId)
            await $.wait(5000)

            await this.commonPost(this.threadId)
        }
        await this.getDrawNum()
        await this.signIn()
    }
    async getDrawNum() {
        let options = {
            method: 'GET',
            url: `https://bbs-api.iqoo.com/api/v3/today.draw.count`,
            headers: {

            },
            data: {}
        };
        let { data: result } = await this.request(options);
        if (result?.Code == '0' && result.Data.count == 0) {
            //可以免费抽一次
            await this.draw()
        } else {
            //已签到
            $.log(`${this.index}账号[${this.index}] 抽奖过`)

        }
    }
    async draw() {
        let options = {
            method: 'POST',
            url: `https://bbs-api.iqoo.com/api/v3/luck.draw`,
            headers: {

            },
            data: {}
        };
        let { data: result } = await this.request(options);
        if (result?.Code == '0') {
            $.log(`${this.index}账号[${this.index}] 抽奖成功 获得${result.Data.prize_name}`)
        }
    }
    async signIn() {
        let options = {
            method: 'POST',
            url: `https://bbs-api.iqoo.com/api/v3/sign`,
            headers: {

            },
            data: { "from": "group" }
        };
        let { data: result } = await this.request(options);
        if (result?.Code == '0') {
            //打印签到结果
            $.log(`🌸账号[${this.index}]` + `🕊当前已签到${result.Data.serialDays}天🎉 获得积分${result.Data.score} 当前积分${result.Data.scoreCount}`);
        } else {
            $.log(`🌸账号[${this.index}] 签到-失败:${result.Message}❌`)
        }




    }
    async likePost(threadId, postId) {
        let { data: likeResult } = await this.request({
            method: 'POST',
            url: `https://bbs-api.iqoo.com/api/v3/posts.update`,
            headers: {

            },
            data: { "id": threadId, "postId": postId, "data": { "attributes": { "isLiked": true } } }
        });
        if (likeResult?.Code == '0') {
            $.log(`${this.index}账号[${this.index}] 帖子点赞成功`)
        } else {
            $.log(`${this.index}账号[${this.index}] 帖子点赞失败:${likeResult.Message}❌`)
        }
        let { data: unlikeResult } = await this.request({
            method: 'POST',
            url: `https://bbs-api.iqoo.com/api/v3/posts.update`,
            headers: {
            },
            data: { "id": threadId, "postId": postId, "data": { "attributes": { "isLiked": false } } }
        });
        if (unlikeResult?.Code == '0') {
            $.log(`${this.index}账号[${this.index}] 帖子取消点赞成功`)
        } else {
            $.log(`${this.index}账号[${this.index}] 帖子取消点赞失败:${unlikeResult.Message}❌`)
        }
    }
    async sharePost(threadId) {
        let options = {
            method: 'POST',
            url: `https://bbs-api.iqoo.com/api/v3/thread.share`,
            headers: {

            },
            data: { "threadId": threadId }
        };
        let { data: result } = await this.request(options);
        if (result?.Code == '0') {
            $.log(`${this.index}账号[${this.index}] 帖子分享成功`)
        } else {
            $.log(`${this.index}账号[${this.index}] 帖子分享失败:${result.Message}❌`)
        }

    }
    async viewPost(threadId) {
        let options = {
            method: 'GET',
            url: `https://bbs-api.iqoo.com/api/v3/view.count?threadId=` + threadId + `&type=0`,
            headers: {

            },
            data: { "threadId": threadId, "type": 0 }
        };
        let { data: result } = await this.request(options);
        if (result?.Code == '0') {
            $.log(`${this.index}账号[${this.index}] 帖子浏览成功`)
        } else {
            $.log(`${this.index}账号[${this.index}] 帖子浏览失败:${result.Message}❌`)
        }

    }
    async commonPost(threadId) {
        let options = {
            method: 'POST',
            url: `https://bbs-api.iqoo.com/api/v3/posts.create`,
            headers: {

            },
            data: { "id": threadId, "type": 0, "content": "666", "source": "", "attachments": [] }
        };
        let { data: result } = await this.request(options);
        if (result?.Code == '0') {
            $.log(`${this.index}账号[${this.index}] 帖子评论成功`)
        } else {
            $.log(`${this.index}账号[${this.index}] 帖子评论失败:${result.Message}❌`)
        }

    }
    async getTreadList() {
        let options = {
            method: 'GET',
            url: `https://bbs-api.iqoo.com/api/v3/thread.list?scope=5&page=1&perPage=10&filter[sort]=4&filter[essence]=1&sequence=0`,
            headers: {

            },
            data: { "filter[essence]": 1, "filter[sort]": 4, "page": 1, "perPage": 10, "scope": 5, "sequence": 0 }
        };
        let { data: result } = await this.request(options);

        this.threadId = result.Data.pageData[0].threadId
        this.postId = result.Data.pageData[0].postId
        return

    }

    /**
     * 
     * @param {*} e method 
     * @param {*} t path
     * @param {*} n data
     * @returns 
     */
    getSign(e, t, n) {

        const time = Math.floor(Date.now() / 1e3);
        const crypto = require("crypto-js");
        var o, s, r, a = `${time}`,
            c = "GET" == e ? function (e) {
                var t, o = "", r;
                if (typeof e === 'object' && e !== null) {
                    if (Array.isArray(e)) {
                        r = e.entries();
                    } else {
                        r = Object.entries(e);
                    }
                    try {
                        for (var entry of r) {
                            var a = encodeURIComponent(entry[0]), c = encodeURIComponent(entry[1]);
                            o += "".concat(a, "=").concat(c, "&");
                        }
                    } catch (e) {
                        console.error(e);
                    }
                    return o.slice(0, -1);
                } else {
                    return '';
                }
            }(n) : "";
        let l = "GET" == e ? "" : JSON.stringify(n);
        o = "2618194b0ebb620055e19cf9811d3c13"
        s = e + "&" + t + "&" + c + "&" + l + "&appid=1002&timestamp=" + a
        r = crypto.HmacSHA256(s, o)
        let sign = crypto.enc.Base64.stringify(r)
        return `IQOO-HMAC-SHA256 appid=1002,timestamp=${time},signature=${sign}`
    }









}

!(async () => {
    await getNotice()
    $.checkEnv(ckName);

    for (let user of $.userList) {
        await new Task(user).run();
    }
})()
    .catch((e) => console.log(e))
    .finally(() => $.done());

async function getNotice() {
	try {
		let options = {
			url: `https://ghproxy.net/https://raw.githubusercontent.com/smallfawn/Note/refs/heads/main/Notice.json`,
			headers: {
				"User-Agent": defaultUserAgent,
			},
            timeout:3000
		}
		let {
			data: res
		} = await axios.request(options);
		$.log(res)
		return res
	} catch (e) {}

}

