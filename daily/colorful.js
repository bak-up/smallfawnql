/*
------------------------------------------
@Author: sm
@Date: 2024.06.07 19:15
@Description:  七彩虹微信小程序 签到&点赞
cron: 30 10 * * *
------------------------------------------
#Notice:   
变量名：colorful
抓取
https://interface.skycolorful.com/api 请求头的authorization去掉Bearer # x-authorization去掉Bearer
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
const $ = new Env("colorful七彩虹");
let ckName = `colorful`;
const strSplitor = "#";
const axios = require("axios");
const defaultUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.31(0x18001e31) NetType/WIFI Language/zh_CN miniProgram"


class Task {
	constructor(env) {
		this.index = $.userIdx++
		this.user = env.split(strSplitor);
		this.token = this.user[0];
		this.token2 = this.user[1];
		this.signStatus = false;
		this.expireFlag = false;
	}

	async run() {
		await this.getTokenExpireTime()
		await this.getUserInfo()
		await this.getSignInfo()

		if (this.signStatus) {
			$.log(`账号[${this.index}]已签到`)
			return
		}
		await this.signInV2()
	}
	async getTokenExpireTime() {
		let options = {
			method: 'POST',
			url: `https://interface.skycolorful.com/api/User/RefreshLoginTime`,
			headers: {
				"accept": "*/*",
				"accept-language": "zh-CN,zh;q=0.9",
				"content-type": "application/json",
				"sec-fetch-dest": "empty",
			},
			data: { "phone": "" }
		}
		let { data: result } = await this.request(options);
		if (result.Code != 0) {
			this.expireFlag = true
		}

	}
	async refreshToken(DATA) {
		let options = {
			method: 'POST',
			url: `https://interface.skycolorful.com/api/User/DecryptPhoneNumber`,
			headers: {
				"accept": "*/*",
				"accept-language": "zh-CN,zh;q=0.9",
				"content-type": "application/json",
				"sec-fetch-dest": "empty",
			},
			data: DATA
		}
		let { data: result } = await this.request(options);
		if (result.Code != 0) {
			this.expireFlag = true
		} else {
			this.token = result.Data.Token
		}
	}
	MD5(str) {
		const crypto = require('crypto');
		return crypto.createHash('md5').update(str).digest('hex');
	}
	request(options) {
		let appid = "815d8026-9a52-4445-a42c-a5443134232e"
		let uuid = $.uuid()
		let timestamp = Date.now()
		let sign = this.MD5(appid + timestamp + uuid + '2b5c01fb-7640-401a-8188-43a13190a626')
		let baseHeaders = {
			"User-Agent": defaultUserAgent,
			"requestid": uuid,
			"appid": appid,
			"ticks": "" + timestamp,
			"sign": sign,
			"authorization": "Bearer " + this.token,
			"x-authorization": "Bearer " + this.token2,
			"source": "Wx",
			"ucsource": "30",
			"user-from": "xcx",


		}
		options.headers = Object.assign(baseHeaders, options.headers)
		return axios.request(options)
	}

	async signInV2() {
		let options = {
			method: 'POST',
			url: `https://interface.skycolorful.com/api/User/SignV2`,
			headers: {
				"accept": "*/*",
				"accept-language": "zh-CN,zh;q=0.9",
				"content-type": "application/json",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "cross-site",
				"xweb_xhr": "1"
			},
			data: {

			}
		};
		let { data: result } = await this.request(options);
		if (result?.Code == '0') {
			//打印签到结果
			$.log(`🌸账号[${this.index}]` + `🕊签到${result.Message}🎉`);
		} else {
			$.log(`🌸账号[${this.index}] 签到-失败:${result.Message}❌`)
		}




	}
	async getSignInfo() {
		let options = {
			method: 'GET',
			url: `https://interface.skycolorful.com/api/User/IsSignV2`,
			headers: {
				"accept": "*/*",
				"accept-language": "zh-CN,zh;q=0.9",
				"content-type": "application/json",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
			}
		}
		let { data: result } = await this.request(options);
		if (result?.Code == '0') {
			//打印签到结果
			this.signStatus = result.Data.IsSign

		} else {
		}
	}
	async getUserInfo() {
		let options = {
			method: 'GET',
			url: `https://interface.skycolorful.com/api/User/GetUserInfo`,
			headers: {
				"accept": "*/*",
				"accept-language": "zh-CN,zh;q=0.9",
				"content-type": "application/json",
				"sec-fetch-dest": "empty",
			}
		}
		let { data: result } = await this.request(options);
		if (result?.Code == '0') {
			//打印签到结果
			$.log(`🌸账号[${this.index}]` + `昵称:${result.Data.NickName}` + `积分:${result.Data.Point}`)
		}
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
			timeout: 3000
		}
		let {
			data: res
		} = await axios.request(options);
		$.log(res)
		return res
	} catch (e) { }

}
