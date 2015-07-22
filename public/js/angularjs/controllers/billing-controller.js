angular.module('myApp').controller('BillingController', function (billingService) {


    var ctrl = this;
    ctrl.years = ['2010', '2011', '2012', '2013', '2014', '2015', '2016'];
    ctrl.months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


    ctrl.list=function(){

        alert("ok");
    }
    //ctrl.billing = billingService.query();
});