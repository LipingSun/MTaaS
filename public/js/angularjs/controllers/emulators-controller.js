angular.module('myApp').controller('EmulatorsController', ['$http', '$window', 'emulatorsService', 'hubsService', function ($http, $window, emulatorsService, hubsService) {

    var ctrl = this;

    ctrl.getAll = function () {
        ctrl.emulators = emulatorsService.query();
    };

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

    ctrl.getAll();

    ctrl.view = function (emulator) {
        var params = 'host=' + emulator.ip + '&' +'port=' + emulator.vnc_port;
        $window.open('bower_components/no-vnc/vnc_auto.html?' + params, emulator.name, 'height=800, width=480');
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

    ctrl.hubs = hubsService.query();

}]);