angular.module('myApp').controller('HubsController', ['$window', 'hubsService', 'hubServiceV2', function ($window, hubsService, hubServiceV2) {

    var ctrl = this;

    ctrl.hubs = [];

    ctrl.getAll = function () {
        hubServiceV2.get(function (data) {
            ctrl.hubs = data.payload;
        });
    };

    ctrl.create = function (newHub) {
        hubServiceV2.findAvailable({limit: 1, 'filter[region]': newHub.region}, function (availableHubs) {
            if (availableHubs.total < 1) {
                $window.alert('Sorry, Currently we dot\'t have enough available hubs');
            } else {
                var hub = new hubServiceV2(availableHubs.payload[0]);
                hub.status = 'occupied';
                hub.occupant = sessionStorage.user;
                hub.name = newHub.name;
                hub.spec = newHub.spec;
                hub.$save(function (data) {
                    ctrl.hubs.push(data.payload);
                });
            }
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