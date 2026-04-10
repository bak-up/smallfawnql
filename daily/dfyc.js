/*
------------------------------------------
@Author: sm
@Date: 2024.06.07 19:15
@Description: 东方烟草报App 积分换实物
cron: 10 8 * * *
------------------------------------------
#Notice:   
变量名:dfycToken
POST请求任意链接包含https://eapp.eastobacco.com/index.php body中的token  多账号&分割或者换行

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
const $ = new Env("东方烟草报");
let ckName = `dfycToken`;
const strSplitor = "#";
const axios = require("axios");
const defaultUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.31(0x18001e31) NetType/WIFI Language/zh_CN miniProgram"


class Task {
    constructor(env) {
        this.index = $.userIdx++;
        this.ck = env.split(strSplitor)[0]; //单账号多变量分隔符
        this.ckStatus = true;
        this.artList = []
    }
    async run() {
        await this.user_info();
        if (this.ckStatus) {
            await this.task_daka()
            await this.art_list()
            if (this.artList.length !== 0) {
                for (let i = 0; i < 3; i++) {
                    await this.task_read(this.artList[i].id, this.artList[i].catid)
                    await this.task_share(this.artList[i].id, this.artList[i].catid)
                    await this.task_like(this.artList[i].id, this.artList[i].catid)
                }
            }
        }
    }
    async user_info() {
        try {
            let options = {
                method: "post",
                url: `https://eapp.eastobacco.com/index.php?m=api&c=user&a=userinfo`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: `platform=android&token=${this.ck}&timestamp=${Date.now()}&api_version=4`
            }
            let { data: result } = await axios.request(options);
            //console.log(options);
            //console.log(result);
            if (result.code == 200) {
                $.log(`✅账号[${this.index}]  积分[${result.data.point}]🎉`)
                this.ckStatus = true;
            } else {
                console.log(`❌账号[${this.index}]  用户查询: 失败`);
                this.ckStatus = false;
                console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async task_daka() {
        try {
            let options = {
                method: "post",
                url: `https://eapp.eastobacco.com/index.php?m=api&c=user&a=daka`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: `platform=android&token=${this.ck}&timestamp=${Date.now()}&api_version=4`
            }
            let { data: result } = await axios.request(options);
            //console.log(options);
            //console.log(result);
            $.log(`✅账号[${this.index}]  打卡[${result.message}]🎉`)
        } catch (e) {
            console.log(e);
        }
    }

    async art_list() {
        try {
            let options = {
                method: "post",
                url: `https://eapp.eastobacco.com/index.php?m=api&c=content&a=newsList_pub`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: `catid=1&num=20&page=1&api_version=4&platform=android&token=${this.ck}&timestamp=${Date.now()}`
            }
            let { data: result } = await axios.request(options);
            //console.log(options);
            //console.log(result);
            if (result.data.news) {
                for (let news of result.data.news) {
                    this.artList.push(
                        {
                            id: news.id,
                            catid: news.catid,
                            title: news.title
                        }
                    )
                }
                console.log(`获取文章成功`);
            } else {
                console.log(`获取文章失败`);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async task_read(id, catid) {
        try {
            let options = {
                method: "post",
                url: `https://eapp.eastobacco.com/index.php?m=api&c=content&a=addvisite`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: `platform=android&token=${this.ck}&timestamp=${Date.now()}&api_version=4&newsid=${id}&catid=${catid}`
            }
            let { data: result } = await axios.request(options);
            //console.log(options);
            //console.log(result);
            if (result.code == 200) {
                $.log(`✅账号[${this.index}]  阅读[${id}]成功🎉`)

            } else {
                $.log(`❌账号[${this.index}]  阅读[${id}]失败`)
            }
        } catch (e) {
            console.log(e);
        }
    }

    async task_share(id, catid) {
        try {
            let options = {
                method: "post",
                url: `https://eapp.eastobacco.com/index.php?m=api&c=user&a=addScoreZf`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: `platform=android&token=${this.ck}&timestamp=${Date.now()}&api_version=4&id=${id}&catid=${catid}`
            }
            let { data: result } = await axios.request(options);
            //console.log(options);
            //console.log(result);
            if (result.code == 200) {
                $.log(`✅账号[${this.index}]  分享[${id}]成功🎉`)

            } else {
                $.log(`❌账号[${this.index}]  分享[${id}]失败`)
            }
        } catch (e) {
            console.log(e);
        }
    }

    async task_like(id, catid) {
        try {
            let options = {
                method: "post",
                url: `https://eapp.eastobacco.com/index.php?m=api&c=content&a=dingcai`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: `platform=android&token=${this.ck}&timestamp=${Date.now()}&api_version=4&newsid=${id}&catid=${catid}`
            }
            let { data: result } = await axios.request(options);
            //console.log(options);
            //console.log(result);
            if (result.code == 200) {
                $.log(`✅账号[${this.index}]  点赞[${id}]成功🎉`)

            } else {
                $.log(`❌账号[${this.index}]  点赞[${id}]失败`)
            }
        } catch (e) {
            console.log(e);
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
