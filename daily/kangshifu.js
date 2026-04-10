/*
------------------------------------------
@Author: sm
@Date: 2024.06.07 19:15
@Description:  康师傅畅饮社
cron: 30 10 * * *
------------------------------------------
#Notice:   
康师傅畅饮社小程序
变量名 ksfcys
账号格式：抓https://club.biqr.cn/api/请求头token 多账户&或换行
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
const $ = new Env("康师傅畅饮社");
let ckName = `ksfcys`;
const strSplitor = "#";

const axios = require("axios");
const defaultUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.31(0x18001e31) NetType/WIFI Language/zh_CN miniProgram"


class Task {
	constructor(env) {
		this.index = $.userIdx++
		this.user = env.split(strSplitor);
		this.token = this.user[0];

	}

	async run() {

		await this.signIn()
	}

	async signIn() {
		let options = {
			url: `https://club.biqr.cn/api/signIn/integralSignIn`,
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090a13) UnifiedPCWindowsWechat(0xf254173b) XWEB/19027',
				'Accept': 'application/json, text/plain, */*',
				'xweb_xhr': '1',
				'Content-Type': 'application/x-www-form-urlencoded;',
				'Token': '' + this.token,
				'Sec-Fetch-Site': 'cross-site',
				'Sec-Fetch-Mode': 'cors',
				'Sec-Fetch-Dest': 'empty',
				'Referer': 'https://servicewechat.com/wx54f3e6a00f7973a7/795/page-frame.html',
				'Accept-Language': 'zh-CN,zh;q=0.9'
			},
			method: 'POST',
			data: {

			}
		}
		let { data: result } = await axios.request(options);
		if (result.code == 0) {
			$.log(`账号[${this.index}]【${this.name}】 签到成功`);
		} else {
			$.log(result);

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
