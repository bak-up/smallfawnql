/*
------------------------------------------
@Author: sm
@Date: 2024.06.07 19:15
@Description:  立乐家会员俱乐部
cron: 30 10 * * *
------------------------------------------
#Notice:   
变量名 lljtoken 填写的是 
域名https://clubwx.hm.liby.com.cn/miniprogram  请求头 unionid # x-wxb9f68ca2da513bb2-token
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

const {
    Env
} = require("../tools/env")
const $ = new Env("立乐家会员俱乐部");
let ckName = `lljtoken`;
const strSplitor = "#";
const axios = require("axios");
const defaultUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.31(0x18001e31) NetType/WIFI Language/zh_CN miniProgram"


class Task {
    constructor(env) {
        this.index = $.userIdx++
        this.user = env.split(strSplitor);
        this.token = this.user[1];
        this.unionid = this.user[0];

    }

    async run() {
        await this.getUserInfo()
        await this.signIn()
    }

    async signIn() {
        let options = {
            method: 'POST',
            url: `https://clubwx.hm.liby.com.cn/miniprogram/benefits/activity/sign/execute.htm?taskId=503`,
            headers: {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "appid": "wxb9f68ca2da513bb2",
                "content-type": "application/json",
                "platformcode": "LiLeJia",
                "priority": "u=1, i",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "unionid": "" + this.unionid,
                "x-wxb9f68ca2da513bb2-token": "" + this.token,
                "xweb_xhr": "1"
            },
            data: {

            }
        };
        let {
            data: result
        } = await axios.request(options);
        if (result?.code == '200') {
            //打印签到结果
            $.log(`🌸账号[${this.index}]` + `签到成功🎉`);
        } else {
            $.log(`🌸账号[${this.index}] 签到-失败:${result.msg}❌`)
        }




    }
    async getUserInfo() {

        let options = {
            url: `https://clubwx.hm.liby.com.cn/b2cMiniApi/me/getUserData.htm`,
            headers: {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "appid": "wxb9f68ca2da513bb2",
                "content-type": "application/json",
                "platformcode": "LiLeJia",
                "priority": "u=1, i",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "unionid": "" + this.unionid,
                "x-wxb9f68ca2da513bb2-token": "" + this.token,
                "xweb_xhr": "1"
            }
        }
        let {
            data: result
        } = await axios.request(options);
        if (result?.code == '200') {
            $.log(`🌸账号[${this.index}]` + `[${result.data.nickName}] 积分` + `[${result.data.integral}]🎉`);
        } else {
            $.log(`🌸账号[${this.index}] 获取用户信息-失败:${result.msg}❌`)
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

