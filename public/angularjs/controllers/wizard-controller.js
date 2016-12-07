angular.module('myApp').controller('WizardController', ['$http', function ($http) {
    var ctrl = this;

    ctrl.finish = function () {
        var infrastructure = {
            emulators: ctrl.newEmulators,
            hub: ctrl.newhub
        };

        $http.post('api/v1/infrastructure/', infrastructure).success(function (res) {
            //TODO
        });


    };

}]);