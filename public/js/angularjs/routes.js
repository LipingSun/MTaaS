angular.module('myApp').config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/pages/dashboard.html',
            controller: 'DashboardController',
            controllerAs: 'dashboardCtrl'
        })
        .when('/dashboard', {
            templateUrl: 'templates/pages/dashboard.html',
            controller: 'DashboardController',
            controllerAs: 'dashboardCtrl'
        })
        .when('/wizard', {
            templateUrl: 'templates/pages/wizard.html',
            controller: 'WizardController',
            controllerAs: 'wizardCtrl'
        })
        .when('/emulator', {
            templateUrl: 'templates/pages/emulator.html',
            controller: 'EmulatorsController',
            controllerAs: 'emulatorsCtrl'
        })
        .when('/hub', {
            templateUrl: 'templates/pages/hub.html',
            controller: 'HubsController',
            controllerAs: 'hubsCtrl'
        })
        .when('/bills', {
            templateUrl: 'templates/pages/billing.html',
            controller: 'BillingController',
            controllerAs: 'billingCtrl'
        })
        .when('/billing_setting', {
            templateUrl: 'templates/pages/billing_setting.html',
            controller: 'BillingSettingController',
            controllerAs: 'billingSettingCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});

angular.module('adminApp').config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/pages/overview.html',
            controller: 'OverviewController',
            controllerAs: 'overviewCtrl'
        })
        .when('/overview', {
            templateUrl: 'templates/pages/overview.html',
            controller: 'OverviewController',
            controllerAs: 'overviewCtrl'
        })
        .when('/user', {
            templateUrl: 'templates/pages/user.html',
            controller: 'UsersController',
            controllerAs: 'usersCtrl'
        })
        .when('/request', {
            templateUrl: 'templates/pages/request.html',
            controller: 'RequestsController',
            controllerAs: 'requestsCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});