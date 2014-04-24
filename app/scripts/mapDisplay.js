angular.module('leveleditApp')
    .directive('mapDisplay', function($log, fabricService) {
      return {
        restrict: "AC",
        scope: {
          mapDisplay : '=',
          selectedObj : '='
        },
        link: function(scope, element, attrs, controller) {
          var config = scope.mapDisplay.config;
          var w = config.width || 960;
          var h = config.height || 640;
          var id = config.id || "map-canvas";
          var canvasEl = angular.element('<canvas/>', {id: id}).prop({
            width: w, height: h
          });

          var debounce = function(func, wait) {
            var timeout;
            return function() {
              var context = this, args = arguments;
              clearTimeout(timeout);
              timeout = setTimeout(function() {
                timeout = null;
                func.apply(context, args);
              }, wait);
              if (!timeout) func.apply(context, args);
            };
          };

          var onscroll = debounce(function(e){
            var t = e.target;
            fabricService.refreshCanvasPos(t.scrollLeft, t.scrollTop)
          }, 250, true);

          element.append(canvasEl);
          var fab = fabricService.create(id, element.attr('id'));
          element.scroll(onscroll);

        }
      };
    });
