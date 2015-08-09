angular.module('myApp').controller('DevicesController', ['$http', '$window', 'devicesService', 'deviceStockService', 'hubsService', function ($http, $window, devicesService, deviceStockService, hubsService) {

    var ctrl = this;

    ctrl.hub=[];

    ctrl.getAvailDevices=function(){
        var avail_devices=deviceStockService.query(
/*  function(){

           var avail_device={};
            ctrl.avail_devices=[];
            for(var i=0;i<avail_devices.length;i++){

                if(ctrl.avail_devices)

            }



        }*/);
    };

    var getIndexOfHub=function(emu,hubs){

        for (var i=0;i<hubs.length;i++){

            if(emu.hub_id===hubs[i].id)
                return i;
        }
        return 0;
    };
    ctrl.getAll = function () {
        ctrl.devices = devicesService.query(function(){

            ctrl.hubs = hubsService.query(function() {
                    for (var i = 0; i < ctrl.devices.length; i++) {

                        ctrl.hub[i] = ctrl.hubs[getIndexOfHub( ctrl.devices[i], ctrl.hubs)].id;
                    }
                }

            );

        });
    };

    ctrl.getOne = function (id) {
        ctrl.device = devicesService.get(id);
    };

    ctrl.create = function (newDevice) {
        var device = new devicesService(newDevice);
        device.$save();
        // TODO: see hub
    };

    ctrl.delete = function (device) {
        device.$delete({id: device.id});
    };

    ctrl.getAll();

    ctrl.view = function (device) {
        var params = 'host=' + device.ip + '&' +'port=' + device.vnc_port;
        $window.open('bower_components/noVNC/vnc_auto.html?' + params, device.name, 'height=800, width=480');
    };

    ctrl.attachToHub = function (device, hub) {
        var data = {
            resource_type: 'device',
            resource_id: device.id
        };
        $http.post('api/v1/hubs/' + hub.id + '/connections', data).success(function (res) {
            //TODO
        });
    };





}]);