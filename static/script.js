var noteApp = angular.module('noteApp', [
    'ngRoute','ngResource'
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
            otherwise({
                redirectTo: '/'
            });
    }]);