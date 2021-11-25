
var storage = storages.create("OPPO商城小铺");


var UA = storage.get("ua");
var mypassword = storage.get("password");
http.__okhttp__.setTimeout(10000);

if(storage.get("ck")!=null){
if(storage.get("ck").indexOf('Op_lpvt_f18367c55fd7569d9000cd9986846577=')!=-1&&storage.get("ck").indexOf('Op_lvt_f18367c55fd7569d9000cd9986846577=')!=-1){
var time1=storage.get("ck").split("Op_lpvt_f18367c55fd7569d9000cd9986846577=")[1].split(';')[0];
var time2=storage.get("ck").split("Op_lvt_f18367c55fd7569d9000cd9986846577=")[1].split(';')[0];
var COOKIE=storage.get("ck").replace(time1,Math.round(new Date().getTime()/1000)).replace(time2,Math.round(new Date().getTime()/1000-10000)+','+Math.round(new Date().getTime()/1000));
}else{
var COOKIE=storage.get("ck");
}
}


var headers = {
    "Host": "store.oppo.com",
    "Connection": "keep-alive",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent": UA,
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Origin": "https://hd.oppo.com",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Dest": "empty",
    "Referer": "https://store.oppo.com/cn/app/cashRedEnvelope?activityId=1&us=qiandao&um=task",
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "Cookie": COOKIE,

};



if(storage.get("[任务]现金任务") == "true"){
    report("日志", "--------" +"现金任务"+ "--------");

    开始();
}

function 开始(){
main();
}


function main() {

     ret = http.get("https://store.oppo.com/cn/oapi/omp-web/web/dailyCash/queryActivityReward?activityId=1", {
            headers:headers,
        }).body.json();
        if (ret['code'] == 200) {
            sleep(1500);
            if (ret['data']['timingRewardList'][0]['hasDraw'] == false) {
                getcash(ret['data']['timingRewardList'][0]['id'])
            }
            sleep(1500);
            for (var i = 0; i < ret['data']['timingRewardList'].length; i++) {
                if (ret['data']['timingRewardList'][i]['hasDraw'] == true && ret['data']['timingRewardList'][i + 1]['hasDraw'] == false) {
                    getcash(ret['data']['timingRewardList'][i + 1]['id'])
                }
            }
            sleep(1500);
            for (var k = 0; k < ret['data']['phaseRewardList'].length; k++) {
                if (ret['data']['phaseRewardList'][k]['hasDraw'] == false) {
                    get(ret['data']['phaseRewardList'][k]['id'])
                }
            }
            sleep(1500);
            if (ret['data']['inviteRewardList'][0] != null) {
                for (var j = 0; j < ret['data']['inviteRewardList'].length; j++) {
                    if (ret['data']['inviteRewardList'][j]['hasDraw'] == false) {
                        iiiida(ret['data']['inviteRewardList'][j]['invitedId'], ret['data']['inviteRewardList'][j]['invitedName'])
                    }
                }
            }
            sleep(1500);
            for(var e=0;e<ret['data']['taskRewardList'].length;e++){
                if(ret['data']['taskRewardList'][e]['taskStatus']==0||ret['data']['taskRewardList'][e]['taskStatus']==1){
                    dailyCash(ret['data']['taskRewardList'][e]['id']);
                    心跳包();
                    award(ret['data']['taskRewardList'][e]['id']);
                }
            }

        }else if(ret['code']==1000001){
        award();
        sleep(1500);
        main();
        }



}

function iiiida(n, m) {

    sleep(2000);

    retnm = http.post("https://store.oppo.com/cn/oapi/omp-web/web/dailyCash/drawReward", {
        "activityId": "1",
        "channel": "2",
        "invitedId": n,
        "saDistinctId": "",

    }, {
        headers:headers,
    }).body.json();
    if (retnm['code'] == 200) {
        report("日志","来自" + "[" + m + "]" + "的助力,获得:" + retnm['data']['amount']);
    }


}

function getcash(z) {

    sleep(2000);

    mm = http.post("https://store.oppo.com/cn/oapi/omp-web/web/dailyCash/drawReward", {
        "channel": "1",
        "channelRewardId": z,
        "activityId": "1"
    }, {
        headers:headers,
    }).body.json();
    if (mm['code'] == 200) {
        report("日志","第" + z + "次领取现金:" + mm['data']['amount']);
    }

}




function get(id) {
    sleep(1500);
    var url = "https://store.oppo.com/cn/oapi/omp-web/web/dailyCash/drawReward";
    retg = http.post(url, {
        "activityId": "1",
        "channel": "4",
        "channelRewardId": id,
    }, {
        headers:headers,
    }).body.json();
    if (retg['code'] == 200) {
        report("日志","[领取红包]:获得" + retg['data']['credits'] + "积分")
    }
}



function 心跳包() {
    
    retcc = http.get("https://store.oppo.com/cn/oapi/omp-web/web/dailyCash/queryActivityReward?activityId=1", {
        headers:headers,
    });

}

function award(id) {


    retaa = http.request("https://store.oppo.com/cn/oapi/omp-web/web/dailyCash/drawReward", {
        method: "POST",
        contentType: "application/x-www-form-urlencoded",
        body: "activityId=1&channelRewardId=" + id + "&channel=3",
        headers:headers,
    }).body.json();
    sleep(1500);
    if (retaa['code'] == 200) {
        report("日志","获得现金:" + retaa['data']['amount'])

    } else {
        report("日志","错误提示:" + retaa['errorMessage'])
    }

}


function award() {


    retaa = http.request("https://store.oppo.com/cn/oapi/omp-web/web/dailyCash/drawReward", {
        method: "POST",
        contentType: "application/x-www-form-urlencoded",
        body: "activityId=1&channelRewardId=0&channel=0",
        headers:headers,
    }).body.json();
    sleep(1500);
    if (retaa['code'] == 200) {
        report("日志","初始现金:" + retaa['data']['amount'])

    }

}


function dailyCash(a) {
    
    retbb = http.get("https://store.oppo.com/cn/oapi/credits/web/dailyCash/reportDailyTask?taskType=0&taskId=dailyCash" + a, {
        headers:headers,
    }).body.json();

}


function report(X, Y) {
    Y = Y || false;
    events.broadcast.emit("日志", {
        name: X,
        data: Y
    });
}

mainEngine.emit("control",index);
