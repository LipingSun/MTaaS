angular.module('myApp').controller('EmulatorsController', function (emulatorsService) {
    var ctrl = this;
    ctrl.emulators = emulatorsService.query();
});