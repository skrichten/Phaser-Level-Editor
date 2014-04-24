angular.module('leveleditApp')
    .directive('imageLoaded', ['$timeout', function($timeout) {
      return {
        restrict: "AC",
        scope: {"isLoaded" : "="},
        link: function(scope, element, attrs) {
          scope.isLoaded = false;

          var onLoaded = function(){
            element.off("load", onLoaded);
            $timeout(function(){
              scope.isLoaded = true;
            });
          }

          attrs.$observe("newSrc", function( srcAttr ) {
            scope.isLoaded = false;
            console.log('new src: ' + srcAttr);
            $timeout(function(){
              element.attr('src', srcAttr);
              if ( srcAttr && element[0].complete ) {
                onLoaded();
              } else {
                element.on("load", onLoaded);
              }
            });
          });

        }
      };
    }]);