///**
// * Created by rongQ on 7/22/15.
// */
var query = require('./../services/mysql');

var emulator_count = 1000000;
var device_count = 1000000;
var hub_count = 1000000;


var emulator_rt_count;
var device_rt_count;
var hub_rt_count;


var billing_price = {
    'month_flat_rate': 50,
    'armeabi-v7a': 0.049800,
    'x86': 0.030000,
    'x86_64': 0.040000,
    'ram': 0.000780,
    'disk': 0.000156,
    '5': 0.001,
    '10': 0.002,
    '15': 0.0025,
    'Samsung_S2': 0.1

};

var emulators = [];
var devices = [];
var hubs = [];


var bills = {};

var emu_cost = 0;
var device_cost = 0;
var hub_cost = 0;

var bill_sum = {};
var bill_detail = {};

exports.getBillPlan = function (req, res) {

    var sqlStr = "select curr_plan, next_plan from user where id=?";

    //  var params=[req.session.user_id];
    var params = [req.user.id];

    query.execQuery(sqlStr, params, function (err, rows) {
        console.log(rows.length);
        if (rows.length > 0) {

            res.json(rows[0]);

        }
        else {

            console.log('no record of plan found');
        }
    });

};

exports.changeBillPlan = function (req, res) {
    var sqlStr = "update user set next_plan=? where id=?";

    //  var params = [req.param('select_plan'), req.session.user_id];
    var params = [req.param('select_plan'), req.user.id];
    query.execQuery(sqlStr, params, function (err, rows) {
            if (err) {
                //res.send({'errorMessage': "Please enster a valid email and password"});
                console.log("ERROR: " + err.message);
                //res.render({errorMessage: 'Sign Up Fail!'});

            } else {

                res.json("ok");


            }
        }
    );
};

exports.getMonthBills = function (req, res) {

    var emulator = [];
    var device = [];
    var hub = [];
    var year_month = req.param('year_month');
    console.log(year_month);
    var invoice_id = year_month + '_' + req.user.id;
    console.log(invoice_id);

    var sqlStr = "select * from invoice where id =?";

    var params = [invoice_id];
    query.execQuery(sqlStr, params, function (err, rows) {
        console.log(rows.length);

        if (rows.length > 0) {
            bill_sum = rows[0];

            var sqlStr = "select * from invoice_detail where invoice_id =?";
            params = [invoice_id];
            query.execQuery(sqlStr, params, function (err, rows) {
                console.log(rows.length);

                if (rows.length > 0) {
                    emulator = rows.filter(function (el) {
                        return (el.resource === "emulator");
                    });
                    device = rows.filter(function (el) {
                        return (el.resource === "device");
                    });
                    hub = rows.filter(function (el) {
                        return (el.resource === "hub");
                    });

                    console.log("emulator length:" + emulator.length);

                    bill_detail.emulator = emulator;
                    bill_detail.device = device;
                    bill_detail.hub = hub;

                    bills.bill_sum = bill_sum;
                    bills.bill_detail = bill_detail;
                    res.json(bills);

                }
                else {
                    console.log("no invoice bills");
                    //res.json(bills);
                }

                /*var sqlStr="select * from invoice where id =? and resource=?" ;
                 params=[invoice_id,'emulator'];
                 query.execQuery(sqlStr, params, function (err, rows) {
                 console.log(rows.length);

                 if (rows.length > 0) {
                 emulator = rows[0];

                 }
                 else {
                 console.log("no emulator bills");
                 }
                 });*/
            });
        }

    });
};


exports.getRealTimeBills = function (req, res) {
    //var now_date=req.param('now_date');

    bill_sum = {};
    bill_detail = {};
    bill = {};
    emulators = [];
    devices = [];
    hubs = [];

    emu_cost = 0;
    device_cost = 0;
    hub_cost = 0;


    emulator_rt_count = 1000000;
    device_rt_count = 1000000;
    hub_rt_count = 1000000;


    var curr_plan = req.param('curr_plan');
    //var curr_plan=req.params.curr_plan;
    console.log(curr_plan);

    var end_bill_time = new Date();
    var start_bill_time = new Date(end_bill_time.getFullYear(), end_bill_time.getMonth(), "1");

    var str_date = (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1) + '-1' + ' ' + '00:00:00';


    //var e_date=new Date();
    //var s_date=new Date(e_date.getFullYear(), e_date.getMonth(), "1");

    //var start_bill_time = new Date(Date.UTC(e_date.getFullYear(), 11, 1, 0, 0, 0));

    //var end_bill_time = e_date.toISOString();
    //var start_bill_time = s_date.toISOString();

    console.log(start_bill_time);
    console.log(end_bill_time);
    var user_id=req.user.id;

    getRealTimeEmuBills(start_bill_time, end_bill_time, curr_plan, str_date,user_id);

    getRealTimeDeviceBills(start_bill_time, end_bill_time, curr_plan, str_date,user_id);

    getRealTimeHubBills(start_bill_time, end_bill_time, curr_plan, str_date,user_id);

    var senddata = setInterval(function () {

        console.log("emu_num:" + emulator_rt_count + ',' + device_rt_count + ',' + hub_rt_count);
        if (emulator_rt_count == 0 && device_rt_count == 0 && hub_rt_count == 0) {

            console.log("done: " + emu_cost);
            if (curr_plan == 'pay_as_hour_go')

                bill_sum.amount = Math.round((emu_cost + device_cost + hub_cost) * 1000) / 1000;
            else
                bill_sum.amount = billing_price['month_flat_rate'];
            bill_sum.plan = curr_plan;

            bill_sum.start_datetime = start_bill_time;

            bill_sum.end_datetime = end_bill_time;
            bill_sum.pay_status = "unpaid";
            bill_detail.emulator = emulators;
            bill_detail.device = devices;
            bill_detail.hub = hubs;

            bills.bill_sum = bill_sum;
            bills.bill_detail = bill_detail;
            bills.emu_cost = emu_cost;
            bills.device_cost = device_cost;
            bills.hub_cost = hub_cost;
            clearInterval(senddata);
            res.json(bills);

        }

    }, 100);


};


var getRealTimeEmuBills = function (start_bill_time, end_bill_time, curr_plan, str_date,user_id) {

    emu_cost = 0;


    //var sqlStr = "select * from emulator where (status='running') or (status='processing') or (status in ('terminated','terminating') and terminate_datetime >'" +str_date+"')";
    var sqlStr = "select * from emulator where user_id="+user_id+" and((status='running') or (status='processing') or (status in ('terminated','terminating') and UNIX_TIMESTAMP(terminate_datetime) >UNIX_TIMESTAMP('" + str_date + "')))";


    console.log(sqlStr);
    var params = [];
    query.execQuery(sqlStr, params, function (err, rows) {
        console.log(rows.length);


        var emulator_bill = rows;
        emulator_rt_count = rows.length;
        // emulators.length=emulator_rt_count;

        if (rows.length !== 0) {
            var start_time = null;
            var end_time = null;

            for (var i = 0; i < emulator_bill.length; i++) {
                console.log('create time');
                console.log(emulator_bill[i].create_datetime);
                console.log('terminate time');
                console.log(emulator_bill[i].terminate_datetime);
                console.log('start time');
                console.log(start_bill_time);
                console.log('end time');
                console.log(end_bill_time);

                console.log(emulator_bill[i]);
                console.log(emulator_bill[i].ram);
                console.log(emulator_bill[i].disk);
                if (emulator_bill[i].status != 'terminated' && emulator_bill[i].status != 'terminating') {
                    if (emulator_bill[i].create_datetime < start_bill_time) {
                        start_time = start_bill_time;
                    } else {
                        start_time = emulator_bill[i].create_datetime;
                    }

                    end_time = end_bill_time;
                } else if (emulator_bill[i].status == 'terminated' || emulator_bill[i].status == 'terminating') {
                    if (emulator_bill[i].create_datetime < start_bill_time) {
                        start_time = start_bill_time;
                    } else {
                        start_time = emulator_bill[i].create_datetime;
                    }

                    end_time = emulator_bill[i].terminate_datetime;

                    /*if(emulator_bill[i].terminate_datetime<end_bill_time ){
                     end_time=emulator_bill[i].terminate_datetime;
                     }
                     else{

                     end_time = end_bill_time;

                     }*/

                } else {

                }


                if (start_time !== null & end_time !== null) {

                    var total_hour_time = (end_time - start_time) / (1000 * 60 * 60);

                    emulators[i] = {};
                    emulators[i] = emulator_bill[i];
                    emulators[i].resource_id = emulator_bill[i].id;
                    emulators[i].start_datetime = start_time;
                    emulators[i].end_datetime = end_time;
                    emulators[i].running_time = Math.round(total_hour_time * 1000) / 1000;
                    /* emulators[i]={};
                     emulators[i].resource_id=emulator_bill[i].id;
                     emulators[i].name=emulator_bill[i].name;
                     emulators[i].start_datetime=start_time;
                     emulators[i].end_datetime=end_time;
                     emulators[i].running_time=Math.round(total_hour_time * 1000) / 1000;*/
                    // total_hour_time = emulators[i].running_time;
                    if (curr_plan == 'pay_as_hour_go') {

                        var cost = (billing_price[emulator_bill[i].cpu] + billing_price['ram'] * emulator_bill[i].ram + billing_price['disk'] * emulator_bill[i].disk) * emulators[i].running_time;

                        cost = Math.round(cost * 1000) / 1000;

                        console.log(typeof cost);
                        emulators[i].cost = cost;

                        console.log(emulators[i]);
                        emu_cost = emu_cost + cost;
                        console.log(typeof emu_cost);
                        console.log(emu_cost);

                        emulator_rt_count--;
                        console.log(emulator_rt_count);


                        /* if (curr_plan == 'pay_as_hour_go') {

                         var sqlStr = "select price from billingrule where resource in (?,?,?)";
                         params = [emulator_bill[i].cpu, 'ram', 'disk',total_hour_time,i];

                         console.log();
                         query.execQuery(sqlStr, params, function (err, data) {
                         console.log(data.length);
                         if (data.length !== 0) {

                         console.log(emulator_bill[ params[params.length-1]].ram);

                         var cost = (data[0].price + data[1].price *emulator_bill[ params[params.length-1]].ram + data[2].price * emulator_bill[params[params.length-1]].disk) * params[params.length-2];

                         cost=parseFloat(Math.round(cost * 1000) / 1000).toFixed(3)
                         emulators[params[params.length-1]].cost=cost;
                         console.log(emulators[params[params.length-1]]);
                         emu_cost=emu_cost+cost;
                         console.log(emu_cost);

                         }

                         emulator_rt_count--;
                         console.log(emulator_rt_count);

                         });  */
                    } else if (curr_plan == 'month_flat_rate') {

                        emulator_rt_count--;

                    }

                }
            }
        }
    });
};

var getRealTimeDeviceBills = function (start_bill_time, end_bill_time, curr_plan, str_date,user_id) {

    device_cost = 0;

    //sqlStr = "select * from device where (status='running') or (status='processing') or (status in ('terminated','terminating') and terminate_datetime >'" + str_date+"')";
    //var sqlStr = "select * from device where ((status='running') or (status='processing') or (status in ('terminated','terminating') and UNIX_TIMESTAMP(terminate_datetime) >UNIX_TIMESTAMP('" + str_date + "')))";
    var sqlStr = "select * from device where user_id="+user_id+" and((status='running') or (status='processing') or (status in ('terminated','terminating') and UNIX_TIMESTAMP(terminate_datetime) >UNIX_TIMESTAMP('" + str_date + "')))";

    console.log(sqlStr);
    var params = [];
    query.execQuery(sqlStr, params, function (err, rows) {
        console.log(rows.length);

        var device_bill = rows;
        device_rt_count = rows.length;


        if (rows.length !== 0) {
            var start_time = null;
            var end_time = null;

            for (var i = 0; i < device_bill.length; i++) {

                console.log(device_bill[i].ram);
                console.log(device_bill[i].disk);
                if (device_bill[i].status != 'terminated' && device_bill[i].status != 'terminating') {
                    if (device_bill[i].create_datetime < start_bill_time) {
                        start_time = start_bill_time;
                    } else {
                        start_time = device_bill[i].create_datetime;
                    }
                    end_time = end_bill_time;
                } else if (device_bill[i].status == 'terminated' || device_bill[i].status == 'terminating') {
                    if (device_bill[i].create_datetime < start_bill_time) {
                        start_time = start_bill_time;
                    } else {
                        start_time = device_bill[i].create_datetime;
                    }
                    if (device_bill[i].terminate_datetime < end_bill_time) {
                        end_time = device_bill[i].terminate_datetime;
                    }
                    else {

                        end_time = end_bill_time;

                    }
                } else {

                }


                if (start_time !== null & end_time !== null) {

                    var total_hour_time = (end_time - start_time) / (1000 * 60 * 60);

                    devices[i] = {};
                    devices[i] = device_bill[i];
                    devices[i].resource_id = device_bill[i].id;
                    devices[i].start_datetime = start_time;
                    devices[i].end_datetime = end_time;
                    devices[i].running_time = Math.round(total_hour_time * 1000) / 1000;
                    /* devices[i]={};
                     devices[i].resource_id=device_bill[i].id;
                     devices[i].start_datetime=start_time;
                     devices[i].end_datetime=end_time;
                     devices[i].running_time=Math.round(total_hour_time * 1000) / 1000;*/
                    // total_hour_time = devices[i].running_time;
                    if (curr_plan == 'pay_as_hour_go') {

                        var cost = billing_price[device_bill[i].model] * devices[i].running_time;

                        cost = Math.round(cost * 1000) / 1000;

                        console.log(typeof cost);
                        devices[i].cost = cost;

                        console.log(devices[i]);
                        device_cost = device_cost + cost;
                        console.log(typeof device_cost);
                        console.log(device_cost);

                        device_rt_count--;
                        console.log(device_rt_count);

                    } else if (curr_plan == 'month_flat_rate') {

                        device_rt_count--;

                    }

                }
            }
        }
    });
};


var getRealTimeHubBills = function (start_bill_time, end_bill_time, curr_plan, str_date,user_id) {

    hub_cost = 0;

    //var sqlStr = "select * from hub where (status='running') or (status='processing') or (status in ('terminated','terminating') and terminate_datetime >'" + str_date+"')";
   // var sqlStr = "select * from hub where ((status='running') or (status='processing') or (status in ('terminated','terminating') and UNIX_TIMESTAMP(terminate_datetime) >UNIX_TIMESTAMP('" + str_date + "')))";
    var sqlStr = "select * from hub where user_id="+user_id+" and((status='running') or (status='processing') or (status in ('terminated','terminating') and UNIX_TIMESTAMP(terminate_datetime) >UNIX_TIMESTAMP('" + str_date + "')))";

    console.log(sqlStr);
    var params = [];
    query.execQuery(sqlStr, params, function (err, rows) {
        console.log(rows.length);

        var hub_bill = rows;
        hub_rt_count = rows.length;


        if (rows.length !== 0) {
            var start_time = null;
            var end_time = null;

            for (var i = 0; i < hub_bill.length; i++) {


                if (hub_bill[i].status != 'terminated' && hub_bill[i].status != 'terminating') {
                    if (hub_bill[i].create_datetime < start_bill_time) {
                        start_time = start_bill_time;
                    } else {
                        start_time = hub_bill[i].create_datetime;
                    }
                    end_time = end_bill_time;
                } else if (hub_bill[i].status == 'terminated' || hub_bill[i].status == 'terminating') {
                    if (hub_bill[i].create_datetime < start_bill_time) {
                        start_time = start_bill_time;
                    } else {
                        start_time = hub_bill[i].create_datetime;
                    }
                    if (hub_bill[i].terminate_datetime < end_bill_time) {
                        end_time = hub_bill[i].terminate_datetime;
                    }
                    else {

                        end_time = end_bill_time;

                    }
                } else {

                }


                if (start_time !== null & end_time !== null) {

                    var total_hour_time = (end_time - start_time) / (1000 * 60 * 60);

                    hubs[i] = {};
                    hubs[i] = hub_bill[i];
                    hubs[i].resource_id = hub_bill[i].id;
                    hubs[i].start_datetime = start_time;
                    hubs[i].end_datetime = end_time;
                    hubs[i].running_time = Math.round(total_hour_time * 1000) / 1000;
                    /*hubs[i]={};
                     hubs[i].resource_id=hub_bill[i].id;
                     hubs[i].start_datetime=start_time;
                     hubs[i].end_datetime=end_time;
                     hubs[i].running_time=Math.round(total_hour_time * 1000) / 1000;*/
                    // total_hour_time = hubs[i].running_time;
                    if (curr_plan == 'pay_as_hour_go') {

                        var cost = billing_price[hub_bill[i].ports_num] * hubs[i].running_time;

                        cost = Math.round(cost * 1000) / 1000;

                        console.log(typeof cost);
                        hubs[i].cost = cost;

                        console.log(hubs[i]);
                        hub_cost = hub_cost + cost;
                        console.log(typeof hub_cost);
                        console.log(hub_cost);

                        hub_rt_count--;
                        console.log(hub_rt_count);

                    } else if (curr_plan == 'month_flat_rate') {

                        hub_rt_count--;

                    }

                }
            }
        }
    });
};


exports.getAvailDateList = function (req, res) {

    var years = [];
    var months = [];

    var sqlStr = "select id from invoice where user_id=?";

    var params = [req.user.id];
    query.execQuery(sqlStr, params, function (err, rows) {
        console.log(rows.length);
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {

                var date = rows[i].id.split("_", 2);
                years.push(date[0]);

                var month = Number(date[1]);

                var name = getMonthName(month);

                var monthObj = {name: name, id: month};
                months.push(monthObj);
            }

        }

        var now_date = new Date();
        var now_year = now_date.getFullYear();

        var now_month = now_date.getMonth() + 1;
        var now_name = getMonthName(now_month);

        var monthObj = {name: now_name, id: now_month};

        years.push(now_year);
        months.push(monthObj);

        res.json({'years': years, 'months': months});


    });

};

var getMonthName = function (month) {

    var name = null;

    switch (month) {

        case 1:
            name = "January";
            break;
        case 2:
            name = "Febuary";
            break;
        case 3:
            name = "March";
            break;
        case 4:
            name = "April";
            break;
        case 5:
            name = "May";
            break;
        case 6:
            name = "June";
            break;
        case 7:
            name = "July";
            break;
        case 8:
            name = "August";
            break;
        case 9:
            name = "September";
            break;
        case 10:
            name = "October";
            break;
        case 11:
            name = "November";
            break;
        case 12:
            name = "December";
            break;
    }
    return name;

};

exports.createBills = function (req, res) {

    emulator_count = 10000;
    device_count = 10000;
    hub_count = 10000;

    var now_date = new Date();
    if (now_date.getDate() == 1) {
        var month_billing_date = getMonthBillingDate(now_date);
        var month_start = month_billing_date[0];
        var month_end = month_billing_date[1];

        console.log(month_start);
        console.log(month_end);
        console.log(month_start.getMonth() + 1);

        var invoice_part_id = month_start.getFullYear() + '_' + (month_start.getMonth() + 1);
        console.log(invoice_part_id);

        generateEmulatorBillsDetail(month_start, month_end, invoice_part_id);
        generateDeviceBillsDetail(month_start, month_end, invoice_part_id);
        generateHubBillsDetail(month_start, month_end, invoice_part_id);

        var senddata = setInterval(function () {

            console.log("emubills_num:" + emulator_count);
            if (emulator_count == 0 && device_count == 0 && hub_count == 0) {

                console.log("done: ");

                clearInterval(senddata);

                generateMonthInvoice(month_start, month_end, invoice_part_id);

            }

        }, 200);

    }

};

var generateMonthInvoice = function (month_start, month_end, invoice_part_id) {

    var sqlStr = "select user_id,count(*) as record_num, sum(cost) as amount , curr_plan , invoice_id from invoice_detail left join user on invoice_detail.user_id= user.id  where invoice_id like '" + invoice_part_id + "%' group by user_id";
    var params = [];
    query.execQuery(sqlStr, params, function (err, rows) {
        console.log(rows.length);
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {

                var insertSql = "insert into invoice(id,user_id,plan,start_datetime,end_datetime,amount,create_date) values (?,?,?,?,?,?,?)";
                if (rows[i].curr_plan == 'pay_as_hour_go') {

                    params = [rows[i].invoice_id, rows[i].user_id, rows[i].curr_plan, month_start, month_end, rows[i].amount, new Date()];


                } else if (rows[i].curr_plan == 'month_flat_rate') {

                    params = [rows[i].invoice_id, rows[i].user_id, rows[i].curr_plan, month_start, month_end, billing_price['month_flat_rate'], new Date()];
                }

                query.execQuery(insertSql, params, function (err, data) {
                    if (err) {
                        //res.send({'errorMessage': "Please enter a valid email and password"});
                        console.log("ERROR: " + err.message);
                        console.log("create an invoie of user id failed!");
                        //res.render({errorMessage: 'Sign Up Fail!'});

                    } else {
                        // res.json({"signup":'Success'})

                        console.log("create an invoice of user succeed! invoice id= " + data.insertId);

                    }

                });

            }
        }
        else {
            console.log('no  user invoice can be generated');
        }

    });
};

var generateEmulatorBillsDetail = function (month_start, month_end, part_id) {

//    //var sqlStr = "select emulator.id, username, version, cpu, ram, disk, TIMESTAMPDIFF(MINUTE,start_time,end_time) AS runtime, ip_port, status from user, emulator where user.id=emulator.user_id";
    var sqlStr = "select e.*,u.curr_plan from (emulator e left join user u on e.user_id=u.id)  where (e.status='running' and e.create_datetime<'" + month_end + "') or (e.status='terminated' and e.terminate_datetime >'" + month_start + "' and e.create_datetime<'" + month_end + "')";

    var params = [];
    query.execQuery(sqlStr, params, function (err, rows) {
        console.log(rows.length);

        var emulator_bill = rows;
        emulator_count = rows.length;

        if (rows.length !== 0) {
            var start_time = null;
            var end_time = null;

            for (i = 0; i < emulator_bill.length; i++) {
                if (emulator_bill[i].status == 'running') {
                    if (emulator_bill[i].create_datetime < month_start) {
                        start_time = month_start;
                    } else {
                        start_time = emulator_bill[i].create_datetime;
                    }
                    end_time = month_end;
                } else if (emulator_bill[i].status == 'terminated') {
                    if (emulator_bill[i].create_datetime < month_start) {
                        start_time = month_start;
                    } else {
                        start_time = emulator_bill[i].create_datetime;
                    }
                    if (emulator_bill[i].terminate_datetime < month_end) {
                        end_time = emulator_bill[i].terminate_datetime;
                    } else {
                        end_time = month_end;
                    }
                } else {

                }

                if (start_time !== null & end_time !== null) {

                    if (emulator_bill[i].curr_plan == 'month_flat_rate') {

//                          //  var sqlStr = "update emulator t set t.cost=((select b.price from billingrule b where b.resource=t.cpu)+(select b.price from billingrule b where b.resource='ram')*t.ram+(select b.price from billingrule b where b.resource='disk')*t.disk)*TIMESTAMPDIFF(MINUTE,t.start_time,t.end_time) where t.user_id=?";


                        var insertSql = "insert into invoice_detail(user_id,resource,resource_id,start_datetime,end_datetime,running_time,invoice_id) values (?,?,?,?,?,?,?)";
                        params = [emulator_bill[i].user_id, 'emulator', emulator_bill[i].id, start_time, end_time, (end_time - start_time) / (1000 * 60 * 60), (part_id + '_' + emulator_bill[i].user_id)];

                        query.execQuery(insertSql, params, function (err, data) {
                            if (err) {
                                //res.send({'errorMessage': "Please enter a valid email and password"});
                                console.log("ERROR: " + err.message);
                                console.log("create a bill detail of emulator failed, id: " + params[2]);
                                //res.render({errorMessage: 'Sign Up Fail!'});

                            } else {
                                // res.json({"signup":'Success'})

                                console.log("create a bill detail of emulator succeed: " + data.insertId);
                            }

                            emulator_count--;
                            console.log(emulator_count);


                        });


                    }
                    else if (emulator_bill[i].curr_plan == 'pay_as_hour_go') {

                        var cost = (billing_price[emulator_bill[i].cpu] + billing_price['ram'] * emulator_bill[i].ram + billing_price['disk'] * emulator_bill[i].disk) * (end_time - start_time) / (1000 * 60 * 60);

                        // cost=Math.round(cost * 1000) / 1000;

                        var insertSql = "insert into invoice_detail(user_id,resource,resource_id,start_datetime,end_datetime,running_time,cost,invoice_id) values (?,?,?,?,?,?,?,?)";

                        params = [emulator_bill[i].user_id, 'emulator', emulator_bill[i].id, start_time, end_time, (end_time - start_time) / (1000 * 60 * 60), cost, (part_id + '_' + emulator_bill[i].user_id)];

                        query.execQuery(insertSql, params, function (err, data) {
                            if (err) {
                                //res.send({'errorMessage': "Please enter a valid email and password"});
                                console.log("ERROR: " + err.message);
                                console.log("create a bill detail of emulator failed, id: ");
                                //res.render({errorMessage: 'Sign Up Fail!'});

                            } else {
                                // res.json({"signup":'Success'})
                                console.log("create a bill detail of emulator succeed: " + data.insertId);
                            }
                            emulator_count--;
                            console.log(emulator_count);
                        });


                        /* var sqlStr = "select price from billingrule where resource in (?,?,?)";
                         params = [emulator_bill[i].cpu, 'ram', 'disk'];

                         query.execQuery(sqlStr, params, function (err, data) {
                         console.log(data.length);
                         if (data.length !== 0) {

                         var total_hour_time = (end_time - start_time) / 1000 * 60 * 60;
                         var cost = (data[0].price + data[1].price * emulator_bill[i].ram + data[2].price * emulator_bill[i].disk) * total_hour_time;

                         var insertSql = "insert into invoice_detail(user_id,resource,resource_id,start_datetime,end_datetime,running_time,cost,invoice_id) values (?,?,?,?,?,?,?)";

                         params = [emulator_bill[i].user_id, 'emulator', emulator_bill[i].id, start_time, end_time, (end_time - start_time) / 1000 * 60 * 60, cost,(part_id+'_'+emulator_bill[i].user_id.toString)];

                         query.execQuery(insertSql, params, function (err, rows) {
                         if (err) {
                         //res.send({'errorMessage': "Please enter a valid email and password"});
                         console.log("ERROR: " + err.message);
                         console.log("create a bill detail of emulator failed, id: " + rows[i].id);
                         //res.render({errorMessage: 'Sign Up Fail!'});

                         } else {
                         // res.json({"signup":'Success'})
                         console.log("create a bill detail of emulator succeed: " + rows.insertId);
                         }
                         emulator_count--;
                         });

                         } else {
                         console.log('no unit price of resource in billing rule found!');

                         }
                         });*/
                    }


                }


            }

        } else {
            //res.send({'errorMessage': "Please enter a valid email and password"});
            console.log("no bill details from emulator");
            //res.render('signin', {errorMessage: 'Please enter a valid email and password'});
        }
    });
};

var generateHubBillsDetail = function (month_start, month_end, part_id) {

    var sqlStr = "select e.*,u.curr_plan from (hub e left join user u on e.user_id=u.id)  where (e.status='running' and e.create_datetime<'" + month_end + "') or (e.status='terminated' and e.terminate_datetime >'" + month_start + "' and e.create_datetime<'" + month_end + "')";

    var params = [];
    query.execQuery(sqlStr, params, function (err, rows) {
        console.log(rows.length);

        var hub_bill = rows;
        hub_count = rows.length;

        if (rows.length !== 0) {
            var start_time = null;
            var end_time = null;

            for (i = 0; i < hub_bill.length; i++) {
                if (hub_bill[i].status == 'running') {
                    if (hub_bill[i].create_datetime < month_start) {
                        start_time = month_start;
                    } else {
                        start_time = hub_bill[i].create_datetime;
                    }
                    end_time = month_end;
                } else if (hub_bill[i].status == 'terminated') {
                    if (hub_bill[i].create_datetime < month_start) {
                        start_time = month_start;
                    } else {
                        start_time = hub_bill[i].create_datetime;
                    }
                    if (hub_bill[i].terminate_datetime < month_end) {
                        end_time = hub_bill[i].terminate_datetime;
                    } else {
                        end_time = month_end;
                    }
                } else {

                }

                if (start_time !== null & end_time !== null) {

                    if (hub_bill[i].curr_plan == 'month_flat_rate') {

//                          //  var sqlStr = "update emulator t set t.cost=((select b.price from billingrule b where b.resource=t.cpu)+(select b.price from billingrule b where b.resource='ram')*t.ram+(select b.price from billingrule b where b.resource='disk')*t.disk)*TIMESTAMPDIFF(MINUTE,t.start_time,t.end_time) where t.user_id=?";


                        var insertSql = "insert into invoice_detail(user_id,resource,resource_id,start_datetime,end_datetime,running_time,invoice_id) values (?,?,?,?,?,?,?)";
                        params = [hub_bill[i].user_id, 'hub', hub_bill[i].id, start_time, end_time, (end_time - start_time) / (1000 * 60 * 60), (part_id + '_' + hub_bill[i].user_id)];

                        query.execQuery(insertSql, params, function (err, data) {
                            if (err) {
                                //res.send({'errorMessage': "Please enter a valid email and password"});
                                console.log("ERROR: " + err.message);
                                console.log("create a bill detail of hub failed, id: ");
                                //res.render({errorMessage: 'Sign Up Fail!'});

                            } else {
                                // res.json({"signup":'Success'})

                                console.log("create a bill detail of hub succeed: " + data.insertId);
                            }

                            hub_count--;
                            console.log(hub_count);


                        });


                    }
                    else if (hub_bill[i].curr_plan == 'pay_as_hour_go') {

                        var cost = (billing_price[hub_bill[i].port_num]) * (end_time - start_time) / (1000 * 60 * 60);

                        // cost=Math.round(cost * 1000) / 1000;

                        var insertSql = "insert into invoice_detail(user_id,resource,resource_id,start_datetime,end_datetime,running_time,cost,invoice_id) values (?,?,?,?,?,?,?,?)";

                        params = [hub_bill[i].user_id, 'hub', hub_bill[i].id, start_time, end_time, (end_time - start_time) / (1000 * 60 * 60), cost, (part_id + '_' + hub_bill[i].user_id)];

                        query.execQuery(insertSql, params, function (err, data) {
                            if (err) {
                                //res.send({'errorMessage': "Please enter a valid email and password"});
                                console.log("ERROR: " + err.message);
                                console.log("create a bill detail of hub failed, id: ");
                                //res.render({errorMessage: 'Sign Up Fail!'});

                            } else {
                                // res.json({"signup":'Success'})
                                console.log("create a bill detail of hub succeed: " + data.insertId);
                            }
                            hub_count--;
                            console.log(hub_count);
                        });

                    }


                }


            }

        } else {
            //res.send({'errorMessage': "Please enter a valid email and password"});
            console.log("no bill details from hub");
            //res.render('signin', {errorMessage: 'Please enter a valid email and password'});
        }
    });
};

var generateDeviceBillsDetail = function (month_start, month_end, part_id) {

    var sqlStr = "select e.*,u.curr_plan from (device e left join user u on e.user_id=u.id)  where (e.status='running' and e.create_datetime<'" + month_end + "') or (e.status='terminated' and e.terminate_datetime >'" + month_start + "' and e.create_datetime<'" + month_end + "')";

    var params = [];
    query.execQuery(sqlStr, params, function (err, rows) {
        console.log(rows.length);

        var device_bill = rows;
        device_count = rows.length;

        if (rows.length !== 0) {
            var start_time = null;
            var end_time = null;

            for (i = 0; i < device_bill.length; i++) {
                if (device_bill[i].status == 'running') {
                    if (device_bill[i].create_datetime < month_start) {
                        start_time = month_start;
                    } else {
                        start_time = device_bill[i].create_datetime;
                    }
                    end_time = month_end;
                } else if (device_bill[i].status == 'terminated') {
                    if (device_bill[i].create_datetime < month_start) {
                        start_time = month_start;
                    } else {
                        start_time = device_bill[i].create_datetime;
                    }
                    if (device_bill[i].terminate_datetime < month_end) {
                        end_time = device_bill[i].terminate_datetime;
                    } else {
                        end_time = month_end;
                    }
                } else {

                }

                if (start_time !== null & end_time !== null) {

                    if (device_bill[i].curr_plan == 'month_flat_rate') {

                        var insertSql = "insert into invoice_detail(user_id,resource,resource_id,start_datetime,end_datetime,running_time,invoice_id) values (?,?,?,?,?,?,?)";
                        params = [device_bill[i].user_id, 'device', device_bill[i].id, start_time, end_time, (end_time - start_time) / (1000 * 60 * 60), (part_id + '_' + device_bill[i].user_id)];

                        query.execQuery(insertSql, params, function (err, data) {
                            if (err) {
                                //res.send({'errorMessage': "Please enter a valid email and password"});
                                console.log("ERROR: " + err.message);
                                console.log("create a bill detail of device failed.");
                                //res.render({errorMessage: 'Sign Up Fail!'});

                            } else {
                                // res.json({"signup":'Success'})

                                console.log("create a bill detail of device succeed: " + data.insertId);
                            }

                            device_count--;
                            console.log(device_count);


                        });


                    }
                    else if (device_bill[i].curr_plan == 'pay_as_hour_go') {

                        var cost = (billing_price[device_bill[i].model]) * (end_time - start_time) / (1000 * 60 * 60);

                        // cost=Math.round(cost * 1000) / 1000;

                        var insertSql = "insert into invoice_detail(user_id,resource,resource_id,start_datetime,end_datetime,running_time,cost,invoice_id) values (?,?,?,?,?,?,?,?)";

                        params = [device_bill[i].user_id, 'device', device_bill[i].id, start_time, end_time, (end_time - start_time) / (1000 * 60 * 60), cost, (part_id + '_' + device_bill[i].user_id)];

                        query.execQuery(insertSql, params, function (err, data) {
                            if (err) {
                                //res.send({'errorMessage': "Please enter a valid email and password"});
                                console.log("ERROR: " + err.message);
                                console.log("create a bill detail of device failed, id: ");
                                //res.render({errorMessage: 'Sign Up Fail!'});

                            } else {
                                // res.json({"signup":'Success'})
                                console.log("create a bill detail of device succeed: " + data.insertId);
                            }
                            device_count--;
                            console.log(device_count);
                        });

                    }


                }


            }

        } else {
            //res.send({'errorMessage': "Please enter a valid email and password"});
            console.log("no bill details from device");
            //res.render('signin', {errorMessage: 'Please enter a valid email and password'});
        }
    });
};

var getMonthBillingDate = function (end_bill_date) {
//
////起止日期數組
//
    var startStop = new Array();
//
////獲取月初時間
//
    var end_billing_date = end_bill_date;
//
//    //一天的毫秒數
//
    var millisecond = 1000 * 60 * 60 * 24;
//
//
////求出上月的最後一天
//
    var last_month_last_day = new Date(end_billing_date.getTime() - millisecond);
//
    var start_billing_date = new Date(last_month_last_day.getFullYear(), last_month_last_day.getMonth(), "1");
    end_billing_date = new Date(last_month_last_day.getFullYear(), last_month_last_day.getMonth() + 1, "1");
//
////添加至數組中返回
//
    startStop.push(start_billing_date);
//
    startStop.push(end_billing_date);
//
////返回
//
    return startStop;
//
};

exports.getUnpaidBills = function (req, res) {
    var sqlStr = "select * from invoice where user_id=? and pay_status=?";

    //  var params=[req.session.user_id];
    var params = [req.user.id, 'unpaid'];

    query.execQuery(sqlStr, params, function (err, rows) {
        console.log(rows.length);
        if (rows.length > 0) {

            res.json(rows);

        }
        else {

            console.log('no record of unpaid bills');
        }
    });


};

exports.payBills = function (req, res) {
    var sqlStr = "update invoice set pay_status=?, pay_datetime=? where id=?";

    //  var params=[req.session.user_id];
    var params = ['paid', new Date(), req.param('bill_id')];

    query.execQuery(sqlStr, params, function (err, rows) {
            if (err) {
                //res.send({'errorMessage': "Please enster a valid email and password"});
                console.log("ERROR: " + err.message);
                //res.render({errorMessage: 'Sign Up Fail!'});

            } else {

                res.json("ok");


            }
        }
    );
};


