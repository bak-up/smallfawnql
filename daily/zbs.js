/*
------------------------------------------
@Author: sm
@Date: 2024.06.07 19:15
@Description:  植白说小程序
cron: 30 8 * * *
------------------------------------------
#Notice:   
变量名称：zbs
值抓取https://www.kozbs.com/demo 请求头x-dts-token

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
const $ = new Env("植白说小程序");
let ckName = `zbs`;
const strSplitor = "#";
const axios = require("axios");
const defaultUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.31(0x18001e31) NetType/WIFI Language/zh_CN miniProgram"


class Task {
    constructor(env) {
        this.index = $.userIdx++
        this.user = env.split(strSplitor);
        this.token = this.user[0];

    }
    request(options) {
        let baseHeraders = {

            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/json",
            "priority": "u=1, i",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "x-dts-token": "" + this.token,
            "xweb_xhr": "1",

            "User-Agent": defaultUserAgent,
        }
        options.headers = Object.assign(baseHeraders, options.headers)
        return axios.request(options)
    }
    async run() {

        await this.signIn()
    }

    async signIn() {
        let options = {
            method: 'GET',
            url: "https://www.kozbs.com/demo/wx/home/sign?userId=",
            headers: {},

        };
        let { data: result } = await this.request(options);
        if (result?.errno == '0') {
            //打印签到结果
            $.log(`🌸账号[${this.index}]` + `签到成功🎉`);
        } else {
            $.log(`🌸账号[${this.index}] 签到-失败:${result.errmsg}❌`)
        }




    }
    async getPoints() {
        let options = {
            method: 'GET',
            url: "https://www.kozbs.com/demo/wx/user/getUserIntegral?userId=",
            headers: {},

        };
        let { data: result } = await this.request(options);
        if (result?.errno == '0') {
            //打印签到结果
            $.log(`🌸账号[${this.index}]` + `当前积分` + `${result.data.integer}🎉`);
        } else {
            $.log(`🌸账号[${this.index}] 获取积分-失败:${result.errmsg}❌`)
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
            timeout:3000
		}
		let {
			data: res
		} = await axios.request(options);
		$.log(res)
		return res
	} catch (e) {}

}
