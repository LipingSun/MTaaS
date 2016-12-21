angular.module('myApp').controller('TestsController', ['$window', 'hubServiceV2', 'testServiceV2', function ($window, hubServiceV2, testServiceV2) {

    var ctrl = this;

    ctrl.hubs = [];
    ctrl.result = "";

    ctrl.getAll = function () {
        hubServiceV2.get(function (data) {
            ctrl.hubs = data.payload;
        });
    };

    ctrl.create = function (newTest) {
        var test = new testServiceV2(newTest);
        test.hub.uri = ctrl.hubs.find(function (hub) {
            return hub._id === test.hub._id;
        }).uri;
        test.$save(function (data) {
            ctrl.result = data.payload.result;
        });
    };

    ctrl.delete = function (test) {
        test.status = 'terminated';
        hubServiceV2.update({id: test._id}, test);
        ctrl.tests = ctrl.tests.filter(function (item) {
            return item !== test;
        });
    };

    ctrl.getAll();

}]);