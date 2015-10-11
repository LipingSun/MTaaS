angular.module('myApp').controller('DevicesController', ['$http', '$window', 'devicesService', 'deviceStockService', 'hubsService', function ($http, $window, devicesService, deviceStockService, hubsService) {

    var ctrl = this;

    ctrl.hub = [];

    ctrl.getAvailDevices = function () {
        ctrl.avail_devices = deviceStockService.query(
            function () {

                for (var j = 0; j < ctrl.avail_devices.length; j++) {

                    var device = ctrl.avail_devices[j];

                    for (var i = j + 1; i < ctrl.avail_devices.length; i++) {
                        if (ctrl.avail_devices[i].brand == device.brand && ctrl.avail_devices[i].model == device.model) {
                            ctrl.avail_devices.splice(i, 1);
                            i--;
                        }

                    }
                }

            }
        );

    };

    var getIndexOfHub = function (emu, hubs) {

        for (var i = 0; i < hubs.length; i++) {

            if (emu.hub_id === hubs[i].id)
                return i;
        }
        return -1;
    };

    ctrl.getAll = function () {

        ctrl.devices = devicesService.query(function () {

            ctrl.hubs = hubsService.query(function () {

                for (var i = 0; i < ctrl.devices.length; i++) {

                    var index = getIndexOfHub(ctrl.devices[i], ctrl.hubs);

                    if (index != -1)

                        ctrl.hub[i] = ctrl.hubs[index].id;
                }
            });

        });
    };

    ctrl.getOne = function (id) {
        ctrl.device = devicesService.get(id);
    };

    ctrl.create = function (newDevice) {
        newDevice.model = newDevice.brand.model;
        newDevice.brand = newDevice.brand.brand;
        var device = new devicesService(newDevice);
        device.$save();
        // TODO: see hub
    };

    ctrl.delete = function (device) {
        device.$delete({id: device.id});
    };

    ctrl.getAll();

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


}]);