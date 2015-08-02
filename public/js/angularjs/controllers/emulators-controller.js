angular.module('myApp').controller('EmulatorsController', ['$window', 'emulatorsService', function ($window, emulatorsService) {

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
    };

    ctrl.delete = function (emulator) {
        emulator.$delete({id: emulator.id});
    };

    ctrl.getAll();

    ctrl.view = function (emulator) {
        var params = 'host=' + emulator.ip + '&' +'port=' + emulator.vnc_port;
        $window.open('bower_components/no-vnc/vnc_auto.html?' + params, emulator.name, 'height=800, width=480');
    };

}]);