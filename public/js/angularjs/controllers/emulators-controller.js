angular.module('myApp').controller('EmulatorsController', ['$http', '$window', 'emulatorsService', 'hubsService', function ($http, $window, emulatorsService, hubsService) {

    var ctrl = this;

    ctrl.hub = [];
    var getIndexOfHub = function (emu, hubs) {

        for (var i = 0; i < hubs.length; i++) {

            if (emu.hub_id === hubs[i].id)
                return i;
        }
        return 0;
    };

    ctrl.getAll = function () {
        ctrl.hubs = hubsService.query(function () {
            ctrl.emulators = emulatorsService.query(function () {
                //ctrl.emulators.forEach(function (emulator) {
                //    emulator.hub = ctrl.hubs.filter(function (hub) {
                //        return hub.id === emulator.hub_id
                //    })[0];
                //});
                for (var i = 0; i < ctrl.emulators.length; i++) {

                    ctrl.hub[i] = ctrl.hubs[getIndexOfHub(ctrl.emulators[i], ctrl.hubs)].id;
                }
            });

        });
    };

    ctrl.getAll();

    ctrl.getOne = function (id) {
        ctrl.emulator = emulatorsService.get(id);
    };

    ctrl.create = function (newEmulator) {
        var emulator = new emulatorsService(newEmulator);
        emulator.$save();
        // TODO: see hub
    };

    ctrl.delete = function (emulator) {
        emulator.$delete({id: emulator.id});
    };

    ctrl.view = function (emulator) {
        var params = 'host=' + emulator.ip + '&' + 'port=' + emulator.vnc_port + '&' + 'autoconnect=true' + '&' + 'resize=downscale';
        $window.open('bower_components/noVNC/vnc.html?' + params, emulator.name, 'height=682, width=360, resizable=no');
    };

    ctrl.attachToHub = function (emulator, hub) {
        var data = {
            resource_type: 'emulator',
            resource_id: emulator.id
        };
        $http.post('api/v1/hubs/' + hub.id + '/connections', data).success(function (res) {
            //TODO
        });
    };


}]);