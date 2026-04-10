/*
------------------------------------------
@Author: sm
@Date: 2024.06.07 19:15
@Description:  海尔智家
cron: 30 7 * * *
------------------------------------------
#Notice:   
变量名hezj
抓取https://zjrs.haier.net请求头accounttoken 多账户&或换行

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
const $ = new Env("海尔智家");
let ckName = `hezj`;
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
        let baseHeaers = {
            "host": "zj.haier.net",
            "content-type": "application/json",
            "accounttoken": this.token,
            "appid": "MB-UZHSH-0001",
            "accept": "*/*",
            "sec-fetch-site": "same-site",
            "appversion": "10.18.0",
            //"clientid": "5D6FD623-11A7-4B62-88AD-D3D62D07B72F",
            "accept-language": "zh-CN,zh-Hans;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            "sec-fetch-mode": "cors",
            "origin": "https://zjrs.haier.net",
            "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_7_15 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko)  Hainer/Haier Simulation/Nebula  App/Uplus Nebula mPaaSClient",
            "referer": "https://zjrs.haier.net/",
            "sec-fetch-dest": "empty"
        }
        options.headers = Object.assign(baseHeaers, options.headers)
        return axios.request(options)
    }

    async run() {

        await this.pointInfo()
        await this.signIn()
    }
    async pointInfo() {
        let options = {
            method: 'POST',
            url: `https://zj.haier.net/zjapi/zjBaseServer/signDetail/getUserPointsAndWallet`,
            headers: {},
            data: {

            }
        };
        let { data: result } = await this.request(options);

        if (result.retCode == '00000') {
            $.log(`海贝：${result.data.haiBeiTotal}`)
            $.log(`红包：${result.data.wallet}`)
        } else {
            $.log(`查询余额失败: ${result.retInfo}`)
        }
    }

    async signIn() {
        let options = {
            method: 'POST',
            url: `https://zj.haier.net/api-gw/zjBaseServer/daily/sign`,
            headers: {},
            data: {

            }
        };
        let { data: result } = await this.request(options);
        if (result?.retCode == '00000') {
            //打印签到结果
            $.log(`🌸账号[${this.index}]` + `🕊当前已签到${result.data.totalSignDay}天🎉`);
        } else {
            $.log(`🌸账号[${this.index}] 签到-失败:${result.retInfo}❌`)
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
