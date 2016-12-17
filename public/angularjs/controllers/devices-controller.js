angular.module('myApp').controller('DevicesController', ['$scope', '$http', '$window', '$interval', 'devicesService', 'deviceServiceV2', 'hubsService', function ($scope, $http, $window, $interval, devicesService, deviceServiceV2, hubsService) {

    var ctrl = this;

    ctrl.devices = [];

    ctrl.hub = [];

    ctrl.availableDevices = [];

    ctrl.getAll = function () {
        deviceServiceV2.findAllByOccupant(function (data) {
            ctrl.devices = data.payload;
        });
    };

    ctrl.getAll();

    ctrl.getOne = function (id) {
        ctrl.device = deviceServiceV2.get(id);
    };

    var availableDevices;

    ctrl.updateAvailableDevices = function () {
        ctrl.intervalId = $interval(function () {
            deviceServiceV2.get(function (data) {
                data.payload = data.payload.filter(function (device) {
                    return device.status === 'available' || device.status === 'online';
                });
                var newAvailableDevices = data.payload.map(function (device) {
                    return { id: device._id, status: device.status, adb_uri: device.adb_uri };
                });
                if (JSON.stringify(availableDevices) !== JSON.stringify(newAvailableDevices)) {
                    availableDevices = newAvailableDevices;
                    ctrl.availableDevices = data.payload;
                    // ctrl.availableBrands = ctrl.availableDevices.map(function (device) {
                    //     console.log(device);
                    //     return device.spec.manufacturer;
                    // });
                }
            });
        }, 700);
    };

    ctrl.cancelInterval = function () {
        $interval.cancel(ctrl.intervalId);
    };


    ctrl.create = function (selectedDevice) {
        if (selectedDevice.status !== 'available') {
            $window.alert('This device is unavailable now, please check back later.');
            return;
        }
        selectedDevice.status = 'occupied';
        selectedDevice.occupant = sessionStorage.user;
        deviceServiceV2.update({id: selectedDevice._id}, selectedDevice, function () {
            ctrl.cancelInterval();
            ctrl.getAll();
            $scope.deviceTab = 'devices';
        });
    };

    ctrl.delete = function (device) {
        device.occupant = '';
        device.status = 'available';
        deviceServiceV2.update({id: device._id}, device);
        ctrl.devices = ctrl.devices.filter(function (item) {
            return item !== device;
        });
    };

    ctrl.view = function (device) {
        var params = 'host=' + device.ip + '&' + 'port=' + device.vnc_port + '&' + 'autoconnect=true' + '&' + 'resize=downscale';
        $window.open('templates/pages/noVNC/vnc.html?' + params, device.name, 'height=682, width=360, resizable=no');
    };

}]);