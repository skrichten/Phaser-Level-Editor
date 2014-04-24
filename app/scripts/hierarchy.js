angular.module('leveleditApp')
    .directive('hierarchy', ['$timeout', 'fabricService',
      function($timeout, fs) {
        return {
          restrict: "AC",
          templateUrl: "hierarchy.html",
          scope: {
            objects : '=hierarchy',
            selected: '='
          },
          link: function(scope, element, attrs) {

            scope.select = function(item) {
              scope.selected = item;
              fs.select(item)
            }

          }
        };
      }]);