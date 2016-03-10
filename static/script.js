var noteApp = angular.module('noteApp', [
    'ngRoute'
]);

noteApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'partials/user/login.html',
                controller: 'UserController'
            }).
            when('/usersetting', {
                templateUrl: 'partials/user/newuser.html',
                controller: 'UserController'
            }).
            when('/phones/:phoneId', {
                templateUrl: 'partials/phone-detail.html',
                controller: 'PhoneDetailCtrl'
            }).
            otherwise({
                redirectTo: '/phones'
            });
    }]);