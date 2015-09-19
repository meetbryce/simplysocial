(function () {
    "use strict";

    angular.module('simplySocialDirectives', [])
        .directive('ssPost', function () {
            return {
                restrict: 'E',
                templateUrl: '../partials/post.htm',
                controller: 'ssPostController',
                scope: {
                    'info': '='
                }
            }
        })
        .controller('ssPostController', ['$scope', function ($scope) {
            $scope.showingComments = false;
            $scope.hideComments = function () {
                $scope.showingComments = false;
            };

            $scope.showComments = function () {
                $scope.showingComments = true;
            };

            $scope.reply = function (target) {
                $scope.showingComments = !$scope.showingComments;
            };
        }]);

    angular.module('simplySocial', ['ngRoute', 'ngSanitize', 'ngRetina', 'firebase', 'simplySocialDirectives'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                    redirectTo: '/feed/all'
                })
                .when('/feed/:filter', {
                    templateUrl: '/partials/feed.htm',
                    controller: 'feedController'
                })
                .when('/settings', {
                    templateUrl: '/partials/settings.htm',
                    controller: 'settingsController'
                })
                .otherwise({
                    templateUrl: '/partials/404.htm'
                });
        }]);

    angular.module('simplySocial')
        .run(function () {

        });

    angular.module('simplySocial')
        .controller('simplySocialController', ['$scope', function ($scope) {
            $scope.$on('$locationChangeSuccess', function (event, newUrl, oldUrl) {
                $scope.state = {
                    showingCompose: false,
                    showingFlyout: false,
                    showingLightbox: false
                };
            });

            $scope.user = {
                name: 'Jessica Tuan',
                avatar: '/dist/img/avatar.png'
            };

            $scope.toggleFlyout = function () {
                $scope.state.showingFlyout = !$scope.state.showingFlyout;
                Placeholders.enable();
            };

            $scope.closeFlyout = function () {
                $scope.state.showingFlyout = false;
                Placeholders.enable();
            };

            $scope.closeCompose = function () {
                $scope.state.showingCompose = false;
                Placeholders.enable();
            };

            $scope.showCompose = function () {
                $scope.state.showingCompose = true;
            };

            $scope.openLightbox = function (info) {
                $scope.lightboxInfo = info;
                $scope.state.showingLightbox = true;
            };

            $scope.closeLightbox = function () {
                $scope.state.showingLightbox = false;
                Placeholders.enable();
            };
        }])
        .controller('feedController', ['$http', '$scope', '$filter', '$routeParams', '$firebaseObject', function ($http, $scope, $filter, $routeParams, $firebaseObject) {
            var ref = new Firebase('https://resplendent-torch-9022.firebaseio.com');

            $scope.data = $firebaseObject(ref);

            $scope.filter = $routeParams.filter === 'all' ? '' : $routeParams.filter;

            $scope.isFilterActive = function (filter) {
                switch (filter) {
                    case 'all':
                        return $routeParams.filter === 'all';
                    case 'photos':
                        return $routeParams.filter === 'photos';
                    case 'videos':
                        return $routeParams.filter === 'videos';
                    default:
                        return false;
                }
            };
        }
        ])
        .
        controller('postBoxController', ['$scope', function ($scope) {
            $scope.submitPost = function () {
                // submit post to server
            }
        }])
        .controller('settingsController', ['$scope', '$firebaseObject', function ($scope, $firebaseObject) {

            var ref = new Firebase('https://resplendent-torch-9022.firebaseio.com');

            var syncObject = $firebaseObject(ref);
            syncObject.$bindTo($scope, "data");

            $scope.notices = [];

            $scope.passwordValue = function (isSet) {
                if (isSet) {
                    return "•••••••";
                } else {
                    return "";
                }
            };

            $scope.saveSettings = function (e) {
                e.preventDefault();

                $scope.notices.push({
                    class: 'text-success',
                    text: 'Settings saved successfully.'
                });

                console.log("saving user settings to server...");
            }
        }]);
})();
