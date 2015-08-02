angular.module('myApp').controller('BillingController', function (billingService,$http) {


    var ctrl = this;
    const api_v1 = '/api/v1';

    ctrl.years = [2010, 2011, 2012, 2013, 2014, 2015, 2016];
    ctrl.months = [
        {name: 'January', id: 1},
        {name: 'Febuary', id: 2},
        {name: 'March', id: 3},
        {name: 'April', id: 4},
        {name: 'May', id: 5},
        {name: 'June', id:6},
        {name: 'July', id: 7},
        {name: 'August', id: 8},
        {name: 'September', id: 9},
        {name: 'October', id: 10},
        {name: 'November', id: 11},
        {name: 'December', id: 12},
    ];

    var  now_date=new Date();
    var now_year=now_date.getFullYear();
    var now_month=now_date.getMonth()+1;

    for (var year in ctrl.years){

        if(ctrl.years[year]==now_year)
            ctrl.s_year=ctrl.years[year];

    }

    for (var month in ctrl.months){

        if(ctrl.months[month]['id']==now_month)
            ctrl.s_month=ctrl.months[month]['id'];

    }

   $http({

        method: 'GET',
        url: api_v1 + '/bill_plan',
       // params: {"now_date":now_date}

    }).success(function (res) {
      // alert(res.curr_plan);

        $http({
           method: 'GET',
           url: api_v1 + '/realTimeBills',
           params: {"curr_plan":res.curr_plan}

        }).success(function (res) {

            ctrl.bills=res;

        });

    });




    ctrl.key_expand=[];
    ctrl.list=function(){
        var year_month=ctrl.s_year+ctrl.s_month;

        /*ctrl.bills={
            bill_sum:{
                "id": "20156_000000000000001",
                "plan": "pay_as_hour_go",
                "start_datetime": "2015-06-01T00:00:00",
                "end_datetime": "2015-07-01T00:00:00",
                "amount": 30.000,
                "pay_status":"paid",
                "pay_method":"credit card",
                "pay_account":"3244234230031",
                "pay_date":"2015-07-01T16:18:38.777133239-07:00",
                "create_date":"2015-07-01T16:18:38.777133239-07:00"
            },
            bill_detail:{
             emulator:
                [
                    {
                        "id":"1001",
                        "resource_id":"608",
                        "start_datetime": "2015-06-01T00:00:00",
                        "end_datetime": "2015-07-01T00:00:00",
                        "running_time": 15.87,
                        "cost": 3.98

                    },
                    {
                        "id":"1002",
                        "resource_id":"608",
                        "start_datetime": "2015-06-01T00:00:00",
                        "end_datetime": "2015-07-01T00:00:00",
                        "running_time": 15.87,
                        "cost": 3.98

                    }


                ],
            device:
                [
                    {
                        "id":"1003",
                        "resource_id":"608",
                        "start_datetime": "2015-06-01T00:00:00",
                        "end_datetime": "2015-07-01T00:00:00",
                        "running_time": 15.87,
                        "cost": 3.98

                    },
                    {
                        "id":"1001",
                        "resource_id":"608",
                        "start_datetime": "2015-06-01T00:00:00",
                        "end_datetime": "2015-07-01T00:00:00",
                        "running_time": 15.87,
                        "cost": 3.98

                    }


                ],
            hub:
                [
                    {
                        "id":"1001",
                        "resource_id":"608",
                        "start_datetime": "2015-06-01T00:00:00",
                        "end_datetime": "2015-07-01T00:00:00",
                        "running_time": 15.87,
                        "cost": 3.98

                    },
                    {
                        "id":"1001",
                        "resource_id":"608",
                        "start_datetime": "2015-06-01T00:00:00",
                        "end_datetime": "2015-07-01T00:00:00",
                        "running_time": 15.87,
                        "cost": 3.98

                    }

                ]

            }
        }*/
        $http({
            method: 'GET',
            url: '/bills',
            params: {"year_month":ctrl.s_year+'_'+ctrl.s_month}

        }).success(function (res) {

            alert(res);

          //  $scope.guardBuilding_data = res.schedule;

        });

        //alert("ok");
    }
    //ctrl.billing = billingService.query();
});