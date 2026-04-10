/*
------------------------------------------
@Author: sm
@Date: 2024.06.07 19:15
@Description:  得物APP 0元抽
cron: 30 11 * * *
------------------------------------------
#Notice:   
得物0元抽 抓https://app.dewu.com/api 请求头的x-auth-token 去掉Bearer 多账户&或换行
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
const CryptoJS = require("crypto-js");
const { Env } = require("../tools/env")
const $ = new Env("得物0元抽");
let ckName = `dwck`;
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
        let sign = this.calculateSign(options.data)
        options.url = options.url + `?sign=${sign}`
        let baseHeaders = {
            "Host": "app.dewu.com",
            "ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_7_15 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148/duapp/5.89.0",
            "device_model": "iPhone 8",
            "platform": "h5",
            "Accept": "*/*",
            "Accept-Encoding": "br;q=1.0, gzip;q=0.9, deflate;q=0.8",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_7_15 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148/duapp/5.89.0",
            "mode": "0",
            "webua": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_7_15 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
            "netSourceType": "1",
            "channel": "App Store",
            "isRoot": "1",
            "brand": "Apple",
            "networktype": "WIFI",
            "dudeviceTrait": "iPhone10,1",
            "Accept-Language": "zh-Hans;q=1.0, en;q=0.9",
            "app_build": "5.89.0.510",
            "x-auth-token": "Bearer " + this.token,
            "countryCode": "CN",
            "appid": "h5",
            "Connection": "keep-alive",
            "Content-Type": "application/json",
            "isProxy": "0",
            "appVersion": "5.89.0",
            "v": "5.89.0",
            "deviceTrait": "iPhone",
            "imei": "",
            "emu": "0",
        }
        options.headers = Object.assign(baseHeaders, options.headers)
        return axios.request(options)
    }
    async run() {

        await this.zeroLottery()
    }

    async zeroLottery() {

        let options = {
            method: "POST",
            url: "https://app.dewu.com/api/v1/h5/oss-platform/hacking-zero-lottery/v1/activity/query-today",
            headers: { "Content-Type": "application/json" },
            data: { "source": "wotab" }
        }
        let { data: result } = await this.request(options)

        if (result.code == 200) {
            for (let i of result.data.activityList) {
                if (i.status == 0) {
                    if ("taskVo" in i) {
                        //需要做任务

                    } else {
                        await this.zeroLotteryJoin(i.id)
                    }
                }
            }
        } else {
            $.log(`❌账号[${this.index}] 获取0元购列表失败[${result.msg}]🎉`)
        }

    }
    async zeroLotteryJoin(id) {

        let options = {
            method: "POST",
            url: "https://app.dewu.com/hacking-zero-lottery/v1/activity/engage-in",
            headers: { "Content-Type": "application/json" },
            data: { "id": id, "source": "wotab", inner: true }
        }
        let { data: result } = await this.request(options)

        if (result.code == 200) {
            $.log(`账号[${this.index}] 参与0元购成功🎉`)
        } else {
            $.log(`账号[${this.index}] 参与 0元购失败[${result.msg}]`)

        }

    }

    /*async DoTask(body) {
        try {
            let taskStatusResult = {};
            let commitBody = {};
            let preStatus = false
            if (body.taskType == 50) {
                taskStatusResult = await this.taskRequest_task("get", `https://app.dewu.com/hacking-task/v1/task/status?taskId=${body.taskId}&taskType=50&sign=94fd23c93d62ae0f75108f94c093b198`)
                if (taskStatusResult.code == 200) {
                    if (taskStatusResult.data.status == 1) {
                        //$.log(`账号[${this.index}] 开始任务成功🎉`)
                        commitBody = { "taskId": body.taskId, "taskType": String(body.taskType), "btd": 0, spuId: 0 }
                        preStatus = true
                    }
                }
            }
            if (body.taskType == 1) {
                if ("classify" in body) {
                    if (body.classify == 2) {
                        taskStatusResult = await this.taskRequest_task("post", `https://app.dewu.com/hacking-task/v1/task/pre_commit?sign=b7382f4d908e04356f9646688afe096c`, { taskId: body.taskId, taskType: body.taskType, btn: 0 })
                        //console.log(taskStatusResult);
                        if (taskStatusResult.code == 200) {
                            if (taskStatusResult.data.isOk == true) {
                                //$.log(`账号[${this.index}] 开始任务成功🎉`)
                                $.log(`延迟${body.countdownTime + 1}秒浏览${body.taskName}`)
                                await $.wait((body.countdownTime + 1) * 1000)
                                commitBody = { "taskId": body.taskId, "taskType": String(body.taskType), "activityType": null, "activityId": null, "taskSetId": null, "venueCode": null, "venueUnitStyle": null, "taskScene": null, "btd": 0 }
                                preStatus = true
                            }
                        } else {
                            $.log(`❌账号[${this.index}] 开始任务失败[${taskStatusResult.msg}]`);
                        }
                    }
                } else {
                    taskStatusResult = await this.taskRequest_task("post", `https://app.dewu.com/hacking-task/v1/task/pre_commit?sign=b7382f4d908e04356f9646688afe096c`, { taskId: body.taskId, taskType: body.taskType, btn: 0 })
                    if (taskStatusResult.code == 200) {
                        if (taskStatusResult.data.isOk == true) {
                            //$.log(`账号[${this.index}] 开始任务成功🎉`)
                            await $.wait(16000)
                            commitBody = { "taskId": body.taskId, "taskType": body.taskType, "activityType": null, "activityId": null, "taskSetId": null, "venueCode": null, "venueUnitStyle": null, "taskScene": null, "btd": 0 }
                            preStatus = true
                        }
                    } else {
                        $.log(`❌账号[${this.index}] 开始任务失败[${taskStatusResult.msg}]`);
                    }
                }


            }
            if (body.taskType == 123 || body.taskType == 124) {
                commitBody = { "taskType": String(body.taskType) }
                preStatus = true
            }
            //console.log(taskStatusResult)
            if (preStatus == true) {
                let commitResult = await this.taskRequest_task("post", `https://app.dewu.com/hacking-task/v1/task/commit?sign=826988b593cd8cd75162b6d3b7dade15`, commitBody)
                //console.log(commitResult)
                if (commitResult.code == 200) {
                    if (commitResult.data.status == 2) {
                        $.log(`账号[${this.index}] [${body.taskName}]任务成功🎉`)
                        return true
                    } else {
                        $.log(`账号[${this.index}] [${body.taskName}]任务失败🎉`)
                    }
                } else {
                    $.log(`账号[${this.index}] [${body.taskName}]任务失败🎉`)
                }
            } else {
                return false
            }
        } catch (e) {
            console.log(e);
        }

    }*/
    generateIds() {
        var Uo = Array(32);
        var oe = "0000000000000000";

        function Ho(e) {
            for (var t = 0; t < 2 * e; t++)
                Uo[t] = Math.floor(16 * Math.random()) + 48,
                    Uo[t] >= 58 && (Uo[t] += 39);
            return String.fromCharCode.apply(null, Uo.slice(0, 2 * e));
        }

        var Mo = "00000000000000000000000000000000"; // Assuming Mo is defined somewhere else in your code

        var generateSpanId = function () {
            return function (e) {
                var t = e(8);
                if (t === oe)
                    return Mo;
                return t;
            }(Ho);
        };

        var generateTraceId = function () {
            return function (e) {
                var t = Math.floor(Date.now() / 1e3).toString(16),
                    n = e(8),
                    r = e(3);
                return "f5" + r + t + n;
            }(Ho);
        };

        return "00-" + generateTraceId() + "-" + generateSpanId() + "-01"
    };

    createEncryptedBody(data) {
        const key2 = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANMGZPlLobHYWoZyMvHD0a6emIjEmtf5Z6Q++VIBRulxsUfYvcczjB0fMVvAnd1douKmOX4G690q9NZ6Q7z/TV8CAwEAAQ==";
        const publicKeyPem = '-----BEGIN PUBLIC KEY-----\n' +
            key2 +
            '-----END PUBLIC KEY-----';

        global["window"] = {}
        const jsencrypt = require("jsencrypt")
        const crypt = new jsencrypt()
        crypt.setKey(publicKeyPem)
        const n = this.randomStr(48, 16);
        const encrypted = crypt.encrypt(n)
        const enBody = CryptoJS.enc.Utf8.parse(data);
        const enResult = CryptoJS.AES.encrypt(enBody, CryptoJS.enc.Utf8.parse(n.substr(10, 16)), {
            iv: CryptoJS.enc.Utf8.parse(n.substr(20, 16)),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        //console.log(encrypted);
        //console.log(hexToBase64(encrypted));
        const newBody = {
            data: encrypted + "​" + enResult.ciphertext.toString().toUpperCase(),
        };
        newBody.sign = this.calculateSign(newBody);
        return { enData: newBody, n };
        function hexToBase64(hexString) {
            const buffer = Buffer.from(hexString, 'hex');
            const base64String = buffer.toString('base64');
            return base64String;
        }
    }
    randomStr(length, charset) { var tmp1, tmp2, data = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""), result = []; if (((charset = charset || data["length"]), length)) for (tmp1 = 0; tmp1 < length; tmp1++)result[tmp1] = data[0 | (Math.random() * charset)]; else for (result[8] = result[13] = result[18] = result[23] = "-", result[14] = "4", tmp1 = 0; tmp1 < 36; tmp1++)result[tmp1] || ((tmp2 = 0 | (16 * Math["random"]())), (result[tmp1] = data[19 === tmp1 ? (3 & tmp2) | 8 : tmp2])); return result["join"]("") }
    decryptResponseBody(result, n) {
        try {
            const de1 = CryptoJS.enc.Hex.parse(result),
                de2 = CryptoJS.enc.Base64.stringify(de1);
            const decrypted = CryptoJS.AES.decrypt(de2, CryptoJS.enc.Utf8.parse(n.substr(10, 16)), {
                iv: CryptoJS.enc.Utf8.parse(n.substr(20, 16)),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            }).toString(CryptoJS.enc.Utf8);
            return decrypted;
        } catch (error) {
            n = "987654321012345678901234567890123456789012345678"
            const de1 = CryptoJS.enc.Hex.parse(result),
                de2 = CryptoJS.enc.Base64.stringify(de1);
            const decrypted = CryptoJS.AES.decrypt(de2, CryptoJS.enc.Utf8.parse(n.substr(10, 16)), {
                iv: CryptoJS.enc.Utf8.parse(n.substr(20, 16)),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            }).toString(CryptoJS.enc.Utf8);
            return decrypted;
        }

    }
    //修复自 修改处理后 空值删除得情况 改为不删除
    calculateSign(requestBody) { const sortedKeys = Object.keys(requestBody).sort(); let signContent = sortedKeys.reduce((acc, key) => { const value = requestBody[key]; if (value === null) { return acc } if (typeof value === 'object' && !Array.isArray(value)) { return acc.concat(key).concat(JSON.stringify(value)) } if (Array.isArray(value)) { if (value.length > 0) { let typeOfFirstItem = typeof value[0]; if (typeOfFirstItem === 'object') { let arrayStr = ''; value.forEach((item, index) => { arrayStr += JSON.stringify(item) + (index !== value.length - 1 ? ',' : '') }); return acc.concat(key).concat(arrayStr) } } return acc.concat(key).concat(value.toString()) } return acc.concat(key).concat(value.toString()) }, ''); const secretKey = "048a9c4943398714b356a696503d2d36"; const hashedContent = CryptoJS.MD5(signContent.concat(secretKey)).toString(); return hashedContent }




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
