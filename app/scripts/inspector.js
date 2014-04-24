angular.module('leveleditApp')
    .directive('inspector', ['$timeout', 'fabricService',
      function($timeout, fs) {
        return {
          restrict: "AC",
          templateUrl: "inspector.html",
          scope: {
            selected : '=inspector'
          },
          link: function(scope, element, attrs) {

            scope.safeApply = function(fn) {
              var phase = this.$root.$$phase;
              if(phase == '$apply' || phase == '$digest') {
                if(fn && (typeof(fn) === 'function')) {
                  fn();
                }
              } else {
                this.$apply(fn);
              }
            };

            scope.groupSelected = function(){
              fs.groupSelected();
            }

            var onPosUpdate = function(){
              if (scope.selected && scope.selected.setCoords) {
                scope.selected.setCoords();
              }
            }

            var redraw = function(e) {
              if (e.which == 13 || e.type == 'focusout') {
                fs.redraw();
              }
            }

            element.on('keypress', 'input', redraw);
            element.on('blur', 'input', redraw);

            scope.$watch('selected.top', onPosUpdate);
            scope.$watch('selected.left', onPosUpdate);

            scope.$watch('selected', function(val){
              if (!val) return;
              if (val.asset) {
                scope.filePath = val.asset.filePath;
              } else {
                scope.filePath = val.filePath;
              }
            })

          }
        };
      }]);