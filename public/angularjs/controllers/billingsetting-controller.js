angular.module('myApp').controller('BillingSettingController', function ($http) {


    const api_v1 = '/api/v1';
    var ctrl = this;
    //ctrl.bill_plan = ['pay_as_hour_go', 'month_flat_rate'];
    ctrl.plan_info='';

    ctrl.changePlan=function(){

        var selectplan=ctrl.select_plan;
        $http({
            method: 'POST',
            url: api_v1 + '/change_bill_plan',
            data: {"select_plan":ctrl.select_plan}

        }).success(function (res) {

            // ctrl.bill_plan=res;
            //  ctrl.=res.curr_plan;
            ctrl.plan_info="You have changed the bill plan into: "+selectplan;

            //  $scope.guardBuilding_data = res.schedule;

        });


    };

    $http({
        method: 'GET',
        url: api_v1 + '/bill_plan',
       // params: {"year_month":year_month}

    }).success(function (res) {

        ctrl.bill_plan =res;
      //  ctrl.=res.curr_plan;
        ctrl.select_plan=res.next_plan;

        //  $scope.guardBuilding_data = res.schedule;

    });



});