/*
------------------------------------------
@Author: sm
@Date: 2024.06.07 19:15
@Description: 测试
cron 8 10 * * *
------------------------------------------
#Notice:
 变量名kekoukeleba   抓小程序可口可乐吧 member-api.icoke.cn/api  Headers中 authorization  去掉Bearer   多账号&连接
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
const { Env } = require('../tools/env');
const $ = new Env("可口可乐吧");
let ckName = `kekoukeleba`;
const strSplitor = "#";
const axios = require("axios");
const defaultUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.31(0x18001e31) NetType/WIFI Language/zh_CN miniProgram"

class Public {
	request(options) {
		return axios.request(options);
	}
}
class Task extends Public {
	constructor(env) {

		super();
		this.index = $.userIdx++
		let user = env.split(strSplitor);
		this.token = user[0];
		this.isSign = false;
	}
	async addSign() {
		let options = {
			method: "GET",
			url: "https://member-api.icoke.cn/api/icoke-sign/icoke/mini/sign/main/sign",
			headers: {
				"accept": "application/json, text/plain, */*",
				"accept-language": "zh-CN,zh;q=0.9",
				"authorization": "" + this.token,
				"content-type": "application/json",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "cross-site",
				"xweb_xhr": "1",
				"Referer": "https://servicewechat.com/wxa5811e0426a94686/421/page-frame.html",
				"Referrer-Policy": "unsafe-url"
			},

		}
		try {
			let { data: res } = await this.request(options);
			if (res.success == true) {
				$.log(`签到成功 获得【${res.point}】快乐瓶`)
			} else {
				$.log(`签到失败`)
				console.log(res);
			}
		} catch (e) {
			console.log(e);

		}
	}
	async userInfo() {
		let options = {
			method: "GET",
			url: "https://member-api.icoke.cn/api/icoke-customer/icoke/mini/customer/main/points",
			headers: {
				"accept": "application/json, text/plain, */*",
				"accept-language": "zh-CN,zh;q=0.9",
				"authorization": "" + this.token,
				"content-type": "application/json",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "cross-site",
				"xweb_xhr": "1",
				"Referer": "https://servicewechat.com/wxa5811e0426a94686/421/page-frame.html",
				"Referrer-Policy": "unsafe-url"
			},

		}
		try {
			let { data: res } = await this.request(options);
			$.log(`目前还剩【${res.point}】瓶 `)

		} catch (e) {
			console.log(e);

		}
	}
	async run() {

		await this.userInfo();

		await this.addSign();



	}


}







!(async () => {
	await getNotice()
	$.checkEnv(ckName);

	for (let user of $.userList) {
		//

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


