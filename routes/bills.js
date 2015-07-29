///**
// * Created by rongQ on 7/22/15.
// */
var query = require('./../services/mysql');
//
//var bills = {};
//
////var conn = mysql.getConnectionPool();
//

var emulator_count=0;
var device_count=0;
var hub_count=0;
var billing_price= {
    'month_flat_rate': 10


};


bills.getBills = function (req, res) {

    var month_year=req.param('month_year');
    var sqlStr="select * from invoice where id like ? and user_id=?";

    var params=[month_year+'_', req.session.user_id];
    query.execQuery(sqlStr, params, function (err, rows) {
        console.log(rows.length);
        if (rows.length > 0) {



        }
    });



};

bills.getAvailDateList=function(){


}

bills.createBills = function (req, res) {
    var now_date=new Date();
    if(now_date.getDate()==1) {
        var month_billing_date = geMonthBillingDate(now_date);
        var month_start = month_billing_date[0];
        var month_end = month_billing_date[1];

        var invoice_part_id=month_start.getFullYear().toString()+(month_start.getMonth()+1).toString();
        generateEmulatorBillsDetail(month_start,month_end,invoice_part_id);
        generateDeviceBillsDetail(month_start,month_end,invoice_part_id);
        generateHubBillsDetail(month_start,month_end,invoice_part_id);
        if(emulator_count==0&&device_count==0&&hub_count==0){
            generateMonthInvoice(month_start,month_end);
        }

    }

};

var  generateMonthInvoice = function(month_start,month_end){
    var sqlStr= "select user_id,count(*) as record_num, sum(cost) as amount , curr_plan , invoice_id from invoice_detail left join user on invoice_detail.user_id= user.id  where start_datetime>=? and end_datetime<=? group by user_id";
    var params=[month_start,month_end];
    query.execQuery(sqlStr, params, function (err, rows) {
        console.log(rows.length);
        if (rows.length > 0) {
            for(var i=0;i<rows.length;i++){

                var insertSql = "insert into invoice(id,user_id,plan,start_datetime,end_datetime,amount,create_date) values (?,?,?,?,?,?,?)";
                if(rows[i].curr_plan=='pay_as_hour_go'){

                    params=[rows[i].invoice_id,rows[i].user_id,rows[i].curr_plan,month_start,month_end,rows[i].amount,new Date()];


                }else if(rows[i].curr_plan=='month_flat_rate'){

                    params=[rows[i].invoice_id,rows[i].user_id,rows[i].curr_plan,month_start,month_end,billing_price['month_flat_rate'],new Date()];
                }

                query.execQuery(insertSql, params, function (err, data) {
                    if (err) {
                        //res.send({'errorMessage': "Please enter a valid email and password"});
                        console.log("ERROR: " + err.message);
                        console.log("create an invoie of user id: "+rows[i].user_id+" failed!" );
                        //res.render({errorMessage: 'Sign Up Fail!'});

                    } else {
                        // res.json({"signup":'Success'})

                        console.log("create an invoice of user id: "+rows[i].user_id+" succeed! invoice id= " + data.insertId);

                    }

                });

            }
        }

    });
}

var generateEmulatorBillsDetail = function(month_start,month_end,part_id){

//    //var sqlStr = "select emulator.id, username, version, cpu, ram, disk, TIMESTAMPDIFF(MINUTE,start_time,end_time) AS runtime, ip_port, status from user, emulator where user.id=emulator.user_id";
       var sqlStr = "select * from emulator  (status='run' and create_datetime<" + month_end + ") or (status='terminated' and terminate_datetime >" + month_start + " and create_datetime<" + month_end + ")";

       var params = [];
       query.execQuery(sqlStr, params, function (err, rows) {
           console.log(rows.length);

           var emulator_bill = rows;
           emulator_count=rows.length;

           if (rows.length !== 0) {
               var start_time = null;
               var end_time = null;

               for (i = 0; i < emulator_bill.length; i++) {
                   if (emulator_bill[i].status == 'run') {
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
                           params = [emulator_bill[i].user_id, 'emulator', emulator_bill[i].id, start_time, end_time, (end_time - start_time) / 1000 * 60 * 60,(part_id+'_'+emulator_bill[i].user_id.toString)];

                           query.execQuery(insertSql, params, function (err, rows) {
                               if (err) {
                                   //res.send({'errorMessage': "Please enter a valid email and password"});
                                   console.log("ERROR: " + err.message);
                                   console.log("create a bill detail of emulator failed");
                                   //res.render({errorMessage: 'Sign Up Fail!'});

                               } else {
                                   // res.json({"signup":'Success'})

                                   console.log("create a bill detail of emulator succeed: " + rows.insertId);
                               }

                               emulator_count--;
                               //if(emulator_count==0)

                           });


                       }
                       else if (emulator_bill[i].curr_plan == 'pay_as_hour_go') {
                           var sqlStr = "select price from billingrule where resource in (?,?,?)";
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
                           });
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

var generateHubBillsDetail = function(month_start,month_end,part_id){

//    //var sqlStr = "select emulator.id, username, version, cpu, ram, disk, TIMESTAMPDIFF(MINUTE,start_time,end_time) AS runtime, ip_port, status from user, emulator where user.id=emulator.user_id";
    var sqlStr = "select * from hub where (status='run' and create_datetime<" + month_end + ") or (status='terminated' and terminate_datetime >" + month_start + " and create_datetime<" + month_end + ")";

    var params = [];
    query.execQuery(sqlStr, params, function (err, rows) {
        console.log(rows.length);
        var hub_bill = rows;
        hub_count=rows.length;
        if (rows.length !== 0) {
            var start_time = null;
            var end_time = null;

            for (i = 0; i < hub_bill.length; i++) {
                if (hub_bill[i].status == 'run') {
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

//                          //  var sqlStr = "update hub t set t.cost=((select b.price from billingrule b where b.resource=t.cpu)+(select b.price from billingrule b where b.resource='ram')*t.ram+(select b.price from billingrule b where b.resource='disk')*t.disk)*TIMESTAMPDIFF(MINUTE,t.start_time,t.end_time) where t.user_id=?";


                        var insertSql = "insert into invoice_detail(user_id,resource,resource_id,start_datetime,end_datetime,running_time,invoice_id) values (?,?,?,?,?,?,?)";
                        params = [hub_bill[i].user_id, 'hub', hub_bill[i].id, start_time, end_time, (end_time - start_time) / 1000 * 60 * 60,(part_id+'_'+hub_bill[i].user_id.toString)];

                        query.execQuery(insertSql, params, function (err, rows) {
                            if (err) {
                                //res.send({'errorMessage': "Please enter a valid email and password"});
                                console.log("ERROR: " + err.message);
                                console.log("create a bill detail of hub failed");
                                //res.render({errorMessage: 'Sign Up Fail!'});

                            } else {
                                // res.json({"signup":'Success'})
                                console.log("create a bill detail of hub succeed: " + rows.insertId);
                            }
                            hub_count--;
                        });
                    }
                    else if (hub_bill[i].curr_plan == 'pay_as_hour_go') {
                        var sqlStr = "select price from billingrule where resource =?";
                        params = [hub_bill[i].port_num];

                        query.execQuery(sqlStr, params, function (err, data) {
                            console.log(data.length);
                            if (data.length !== 0) {

                                var total_hour_time = (end_time - start_time) / 1000 * 60 * 60;
                                var cost = data[0].price * total_hour_time;

                                var insertSql = "insert into invoice_detail(user_id,resource,resource_id,start_datetime,end_datetime,running_time,cost,invoice_id) values (?,?,?,?,?,?,?,?)";

                                params = [hub_bill[i].user_id, 'hub', hub_bill[i].id, start_time, end_time, (end_time - start_time) / 1000 * 60 * 60, cost,(part_id+'_'+hub_bill[i].user_id.toString)];

                                query.execQuery(insertSql, params, function (err, rows) {
                                    if (err) {
                                        //res.send({'errorMessage': "Please enter a valid email and password"});
                                        console.log("ERROR: " + err.message);
                                        console.log("create a bill detail of hub failed, id: " + rows[i].id);
                                        //res.render({errorMessage: 'Sign Up Fail!'});

                                    } else {
                                        // res.json({"signup":'Success'})
                                        console.log("create a bill detail of hub succeed: " + rows.insertId);
                                    }
                                    hub_count--;
                                });

                            } else {
                                console.log('no unit price of resource in billing rule found!');

                            }
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

var generateDeviceBillsDetail = function(month_start,month_end,part_id){

//    //var sqlStr = "select emulator.id, username, version, cpu, ram, disk, TIMESTAMPDIFF(MINUTE,start_time,end_time) AS runtime, ip_port, status from user, emulator where user.id=emulator.user_id";
    var sqlStr = "select * from device_usage where (status='run' and create_datetime<" + month_end + ") or (status='terminated' and terminate_datetime >" + month_start + " and create_datetime<" + month_end + ")";

    var params = [];
    query.execQuery(sqlStr, params, function (err, rows) {
        console.log(rows.length);
        device_count=rows.length;
        var device_bill = rows;
        if (rows.length !== 0) {
            var start_time = null;
            var end_time = null;

            for (i = 0; i < device_bill.length; i++) {
                if (device_bill[i].status == 'run') {
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

//                          //  var sqlStr = "update device t set t.cost=((select b.price from billingrule b where b.resource=t.cpu)+(select b.price from billingrule b where b.resource='ram')*t.ram+(select b.price from billingrule b where b.resource='disk')*t.disk)*TIMESTAMPDIFF(MINUTE,t.start_time,t.end_time) where t.user_id=?";


                        var insertSql = "insert into invoice_detail(user_id,resource,resource_id,start_datetime,end_datetime,running_time,invoice_id) values (?,?,?,?,?,?,?)";
                        params = [device_bill[i].user_id, 'device', device_bill[i].id, start_time, end_time, (end_time - start_time) / 1000 * 60 * 60,(part_id+'_'+device_bill[i].user_id.toString)];

                        query.execQuery(insertSql, params, function (err, rows) {
                            if (err) {
                                //res.send({'errorMessage': "Please enter a valid email and password"});
                                console.log("ERROR: " + err.message);
                                console.log("create a bill detail of device failed");
                                //res.render({errorMessage: 'Sign Up Fail!'});

                            } else {
                                // res.json({"signup":'Success'})
                                console.log("create a bill detail of device succeed: " + rows.insertId);
                            }
                            device_count--;
                        });
                    }
                    else if (device_bill[i].curr_plan == 'pay_as_hour_go') {
                        var sqlStr = "select price from billingrule where resource =?";
                        params = [device_bill[i].model];

                        query.execQuery(sqlStr, params, function (err, data) {
                            console.log(data.length);
                            if (data.length !== 0) {

                                var total_hour_time = (end_time - start_time) / 1000 * 60 * 60;
                                var cost = data[0].price * total_hour_time;

                                var insertSql = "insert into invoice_detail(user_id,resource,resource_id,start_datetime,end_datetime,running_time,cost,invoice_id) values (?,?,?,?,?,?,?)";

                                params = [device_bill[i].user_id, 'device', device_bill[i].id, start_time, end_time, (end_time - start_time) / 1000 * 60 * 60, cost,(part_id+'_'+device_bill[i].user_id.toString)];

                                query.execQuery(insertSql, params, function (err, rows) {
                                    if (err) {
                                        //res.send({'errorMessage': "Please enter a valid email and password"});
                                        console.log("ERROR: " + err.message);
                                        console.log("create a bill detail of device failed, id: " + rows[i].id);
                                        //res.render({errorMessage: 'Sign Up Fail!'});

                                    } else {
                                        // res.json({"signup":'Success'})
                                        console.log("create a bill detail of device succeed: " + rows.insertId);
                                    }
                                    device_count--;
                                });

                            } else {
                                console.log('no unit price of resource in billing rule found!');

                            }
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

var getMonthBillingDate=function(end_bill_date){
//
////起止日期數組
//
    var startStop=new Array();
//
////獲取月初時間
//
   var end_billing_date=end_bill_date;
//
//    //一天的毫秒數
//
  var millisecond=1000*60*60*24;
//
//
////求出上月的最後一天
//
    var last_month_last_day=new Date(end_billing_date.getTime()-millisecond);
//
    var start_billing_date=new Date(last_month_last_day.getFullYear(),last_month_last_day.getMonth(),"1");
//
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
//
module.exports = bills;