angular.module('myApp').controller('BillingController', function (billingService,$http) {


    var ctrl = this;
    const api_v1 = '/api/v1';

    ctrl.key_expand=[];

    var getDateList=function(){


        $http({

            method: 'GET',
            url: api_v1 + '/availBillDates',
            // params: {"now_date":now_date}

        }).success(function (res) {
            ctrl.years=res.years;
            ctrl.months=res.months;
            ctrl.s_year=ctrl.years[ctrl.years.length-1];
            ctrl.s_month=ctrl.months[ctrl.months.length-1]['id'];

        });
    };

    getDateList();

    /*ctrl.years = [2010, 2011, 2012, 2013, 2014, 2015, 2016];
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
    for (var year in ctrl.years){

        if(ctrl.years[year]==now_year)
            ctrl.s_year=ctrl.years[year];

    }

    for (var month in ctrl.months){

        if(ctrl.months[month]['id']==now_month)
            ctrl.s_month=ctrl.months[month]['id'];

    }*/

   var getRealTimeBill= function(){
       $http({

           method: 'GET',
           url: api_v1 + '/bill_plan',
           // params: {"now_date":now_date}

       }).success(function (res) {
           // alert(res.curr_plan);

           ctrl.curr_plan=res.curr_plan;
           $http({
               method: 'GET',
               url: api_v1 + '/realTimeBills',
               params: {"curr_plan":res.curr_plan}

           }).success(function (res) {

               ctrl.bills=res;

           });

       });
   };


    getRealTimeBill();

    ctrl.list=function(){
        if(ctrl.s_year==ctrl.years[ctrl.years.length-1]&&ctrl.s_month==ctrl.months[ctrl.months.length-1]['id']){
            getRealTimeBill();
        }else{

            var year_month=ctrl.s_year+'_'+ctrl.s_month;

            $http({
                method: 'GET',
                url: api_v1 +'/bills',
                params: {"year_month":year_month}

            }).success(function (res) {

               // alert(res);
                ctrl.bills=res;

            });

        }
    };

});