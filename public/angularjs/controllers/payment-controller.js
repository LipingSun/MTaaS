angular.module('myApp').controller('PaymentController', function ($http) {


    const api_v1 = '/api/v1';
    var ctrl = this;
    //ctrl.bill_plan = ['pay_as_hour_go', 'month_flat_rate'];

    $http({
        method: 'GET',
        url: api_v1 + '/unpaid_bills',
       // params: {"year_month":year_month}

    }).success(function (res) {

        ctrl.payments =res;


    });

    ctrl.pay=function(id,order){

        $http({
            method: 'POST',
            url: api_v1 + '/paybills',
            data: { "bill_id": id}
        }).success(function (res) {

            if(res=='ok')

                ctrl.payments.splice(order,1);


        });

    };



});