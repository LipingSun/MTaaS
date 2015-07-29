angular.module('myApp').controller('BillingController', function (billingService,$http) {


    var ctrl = this;
    ctrl.years = ['2010', '2011', '2012', '2013', '2014', '2015', '2016'];
    ctrl.months = [
        {name: 'January', id: '1'},
        {name: 'Febuary', id: '2'},
        {name: 'March', 'id': '3'},
        {name: 'April', 'id': '4'},
        {name: 'May', 'id': '5'},
        {name: 'June', 'id': '6'},
        {name: 'July', 'id': '7'},
        {name: 'August', 'id': '8'},
        {name: 'September', 'id': '9'},
        {name: 'October', 'id': '10'},
        {name: 'November', 'id': '11'},
        {name: 'December', 'id': '12'},
    ];
    ctrl.people = [
        {name: "Bob", gender: "Male", details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque quis nisi quis mi tincidunt luctus ut quis nunc. Nam non risus tincidunt risus sodales condimentum. Morbi sed gravida elit. Nunc a turpis vestibulum elit posuere blandit. Phasellus luctus lectus non porta auctor. Etiam pellentesque imperdiet posuere. Nullam adipiscing congue nisl, in vulputate odio ornare ac."},
        {name: "Jane", gender: "Female", details: "Maecenas quis sodales lectus, vitae convallis ipsum. Ut ac viverra tellus. Quisque vulputate, orci placerat eleifend scelerisque, eros nunc rutrum odio, pharetra mattis leo neque vel eros. Cras id purus nec lorem vehicula rutrum a vel arcu. Quisque eget euismod augue. Integer volutpat auctor lorem, quis lacinia nisl tempus nec. Nunc fringilla, odio eget molestie varius, tortor turpis dignissim lacus, sed varius nunc velit eu turpis. Etiam sed congue diam. In ornare elit nec dolor faucibus ornare. Ut eget erat vel elit tristique iaculis. Maecenas et semper lorem. Nam mollis ante et ipsum vestibulum posuere. Ut non purus non risus tempor vulputate et vitae ipsum. Mauris et sem sit amet quam pulvinar fringilla."},
        {name: "Bill", gender: "Male", details: "Quisque rhoncus scelerisque sapien, tempor vestibulum dui tincidunt eu. Maecenas scelerisque, dolor sed vehicula pulvinar, ligula erat ornare arcu, in dictum ipsum libero vel est. Donec porttitor venenatis lacus, a laoreet orci. Proin quam mi, ultrices in ullamcorper vel, malesuada suscipit lectus. Nam faucibus commodo quam, auctor vehicula felis condimentum quis. Phasellus tempor molestie enim, at vehicula justo auctor eu. Pellentesque venenatis elit eu malesuada fringilla."}
    ];



    ctrl.key_expand=[];
    ctrl.list=function(){
        var year_month=ctrl.s_year+ctrl.s_month;

        ctrl.bills={
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
        }
        /*$http({
            method: 'GET',
            url: '/bills',
            params: {"year_month":year_month}

        }).success(function (res) {

          //  $scope.guardBuilding_data = res.schedule;

        });*/

        //alert("ok");
    }
    //ctrl.billing = billingService.query();
});