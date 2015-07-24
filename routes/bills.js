/**
 * Created by rongQ on 7/22/15.
 */
var mysql = require('./mysql');

var bills = {};

bills.getBills = function (req, res) {

    

};


bills.createBills = function (req, res) {

    var now_date=new Date();
    if(now_date.getDate()==1){
        var month_billing_date=geMonthBillingDate(now_date);

    }
    var sqlStr = "select emulator.id, username, version, cpu, ram, disk, TIMESTAMPDIFF(MINUTE,start_time,end_time) AS runtime, ip_port, status from user, emulator where user.id=emulator.user_id";
    var sqlStr = "select id, name, create_datetime,terminate_datetime, status from emulator where ";

    console.log("Query is:" + sqlStr);

    var params = [];
    query.execQuery(sqlStr, params, function (err, rows) {

        console.log(rows.length);
        if (rows.length !== 0) {

            res.json({'emulators': rows});

        } else {
            //res.send({'errorMessage': "Please enter a valid email and password"});
            console.log("no emulators");
            //res.render('signin', {errorMessage: 'Please enter a valid email and password'});
        }
    });


};

var getMonthBillingDate=function(end_bill_date){

//起止日期數組

    var startStop=new Array();

//獲取月初時間

    var end_billing_date=end_bill_date;

    //一天的毫秒數

    var millisecond=1000*60*60*24;


//求出上月的最後一天

    var last_month_last_day=new Date(end_billing_date.getTime()-millisecond);

    var start_billing_date=new Date(last_month_last_day.getFullYear(),last_month_last_day.getMonth(),"1");


//添加至數組中返回

    startStop.push(start_billing_date);

    startStop.push(end_billing_date);

//返回

    return startStop;

};

module.exports = bills;