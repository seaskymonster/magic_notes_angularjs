noteApp
    .factory('UserService', function($resource) {
        return $resource('api/user/index/:id', {id: '@id'}, {
            query: { method: 'GET', isArray: true},
            update: { method: 'POST', params: { action: 'update' } },
            create: { method: 'POST', params: { action: 'create' } },
            delete: { method: 'POST', params: { action: 'delete' } },
            enable: { method: 'POST', params: { action: 'enable' } },
            disable: { method: 'POST', params: { action: 'disable' } }
        });
    })
    .controller('UserController', ['$scope', 'UserService', function ($scope, UserService ) {
    $scope.login = function () {
     // TODO: call UserService get function.
    }
}]);
