angular.module('adminApp').controller('OverviewController', function () {
    var ctrl = this;
    ctrl.visits = 10;
    ctrl.users = 10;
    ctrl.profits = 10;
    ctrl.labels = ["CPU", "Rest"];
    ctrl.data = [10, 20];
});