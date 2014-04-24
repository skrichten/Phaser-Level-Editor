'use strict';

angular.module('leveleditApp', [
      'ngSanitize',
      'ngRoute',
      'ui.bootstrap'
    ])
    .config(function ($routeProvider, $compileProvider) {
      var oldWhiteList = $compileProvider.imgSrcSanitizationWhitelist();
      $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);

      $routeProvider
          .when('/', {
            templateUrl: 'main.html'
            //, controller: 'MainCtrl'
          })
          .otherwise({
            redirectTo: '/'
          });
    });
