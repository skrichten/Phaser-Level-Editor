angular.module('leveleditApp')
    .directive('assetMgr', ['$timeout', 'fabricService',
      function($timeout, fs) {
      return {
        restrict: "AC",
        templateUrl: "assetMgr.html",
        scope: {
          selected : '=',
          assets: '=assetMgr'
        },
        link: function(scope, element, attrs) {

          scope.selectFile = function(){
            $('#img-file').trigger('click');
          }

          scope.selectedFile = function(finp){
            scope.$apply(function(){
              var f = finp.files[0];
              var asset = {
                "type": "image",
                "ID": f.name,
                "filePath": f.path,
                "gamePath": "assets/rocks/" + f.name
              }
              scope.assets.push(asset);
              scope.selected = asset;
            })
          };

          scope.assetClick = function(asset){
            fs.addSprite(asset);
          }

        }
      };
    }]);