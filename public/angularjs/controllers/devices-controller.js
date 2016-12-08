angular.module('myApp').controller('DevicesController', ['$scope', '$http', '$window', '$interval', 'devicesService', 'deviceStockService', 'devicePoolService', 'hubsService', function ($scope, $http, $window, $interval, devicesService, deviceStockService, devicePoolService, hubsService) {

    var ctrl = this;

    ctrl.devices = [];

    ctrl.hub = [];

    ctrl.availableDevices = [];

    ctrl.getAll = function () {
        devicePoolService.findAllByOccupant(function (data) {
            ctrl.devices = data.payload;
        });
    };

    ctrl.getAll();

    ctrl.getOne = function (id) {
        ctrl.device = devicePoolService.get(id);
    };

    var availableDevices;

    ctrl.updateAvailableDevices = function () {
        ctrl.intervalId = $interval(function () {
            devicePoolService.get(function (data) {
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
        $id = selectedDevice._id;
        devicePoolService.update({id: $id}, selectedDevice, function () {
            ctrl.getAll();
            $scope.deviceTab = 'devices';
        });
        // var device = new devicesService(newDevice);
        // device.$save();
        // TODO: see hub
    };

    ctrl.delete = function (device) {
        device.occupant = null;
        device.status = 'available';
        $id = device._id;
        devicePoolService.update({id: $id}, device, function () {
            ctrl.getAll();
        });
    };

    ctrl.view = function (device) {
        var params = 'host=' + device.ip + '&' + 'port=' + device.vnc_port + '&' + 'autoconnect=true' + '&' + 'resize=downscale';
        $window.open('templates/pages/noVNC/vnc.html?' + params, device.name, 'height=682, width=360, resizable=no');
    };

    ctrl.attachToHub = function (device, hub_id) {
        var data = {
            resource_type: 'device',
            resource_id: device.id
        };
        $http.post('api/v1/hubs/' + hub_id + '/connections', data).success(function (res) {
            //TODO
        });
    };

    var getIndexOfHub = function (emu, hubs) {

        for (var i = 0; i < hubs.length; i++) {

            if (emu.hub_id === hubs[i].id) {
                return i;
            }
        }
        return -1;
    };

}]);