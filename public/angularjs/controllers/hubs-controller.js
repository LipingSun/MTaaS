angular.module('myApp').controller('HubsController', ['hubsService', 'hubServiceV2', function (hubsService, hubServiceV2) {

    var ctrl = this;

    ctrl.hubs = [];

    ctrl.getAll = function () {
        hubServiceV2.get(function (data) {
            ctrl.hubs = data.payload.filter(function (hub) {
                return hub.status === 'processing' || hub.status === 'occupied';
            });
        });
    };

    ctrl.create = function (newHub) {
        var hub = new hubServiceV2(newHub);
        hub.status = 'processing';
        hub.occupant = sessionStorage.user;
        hub.$save(function (data) {
            ctrl.hubs.push(data.payload);
        });
    };

    ctrl.delete = function (hub) {
        hub.status = 'terminated';
        hubServiceV2.update({id: hub._id}, hub);
        ctrl.hubs = ctrl.hubs.filter(function (item) {
            return item !== hub;
        });
    };

    ctrl.getAll();

}]);