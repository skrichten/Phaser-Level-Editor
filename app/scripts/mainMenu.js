angular.module('leveleditApp')
    .directive('mainMenu', function($log, fabricService, mapService) {
      return {
        restrict: "AC",
        scope: {
          menuData : '=mainMenu'
        },
        link: function(scope, element, attrs, controller) {

          var onLoad = function() {
            mapService.load();
          }

          var onSaveAs = function() {
            mapService.saveAs ();
          }

          var onSave = function() {
            mapService.save();
          }

          var gui = require('nw.gui');

          // Create an empty menu
          var menuBar = new gui.Menu({ type: 'menubar' });

          var fItem = new gui.MenuItem({ label: 'File', type: "normal" });
          var fMenu = new gui.Menu();
          fMenu.append(new gui.MenuItem({ label: 'New' }));
          fMenu.append(new gui.MenuItem({ label: 'Save', click: onSave }));
          fMenu.append(new gui.MenuItem({ label: 'SaveAs', click: onSaveAs}));
          fMenu.append(new gui.MenuItem({ label: 'Load', click: onLoad }));

          var objItem = new gui.MenuItem({ label: 'Object', type: "normal" });


          fItem.submenu = fMenu;
          menuBar.append(fItem);
          menuBar.append(objItem);


          gui.Window.get().menu = menuBar;
        }
      };
    });
