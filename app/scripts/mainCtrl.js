'use strict';

angular.module('leveleditApp')
    .controller('MainCtrl', function ($scope, $timeout, mapService, fabricService) {
      var ms = mapService;
      var fs = fabricService;
      $scope.file = null;
      $scope.state = ms.state;
      $scope.fabState = fs.fabState;
    })

