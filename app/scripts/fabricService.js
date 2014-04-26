'use strict';


angular.module('leveleditApp')
    .factory('fabricService', function($log, $q, $timeout, $rootScope){
      var scrollX = 0;
      var scrollY = 0;
      var fab;

      /**
      * Called when the div containing the canvas is scrolled.
      * Fabric needs this to position things properly
      * and we take the opportunity to save the scroll position
      * so we know where to place new objects.
      */
      var refreshCanvasPos = function(x,y) {
        fab.calcOffset();
        scrollX = x;
        scrollY = y;
      }

      var getGroupItemClicked = function (group, mPos) {
        var clicked = null;
        var p = group.toLocalPoint(mPos);
        group.forEachObject(function(object,i) {
          if (object.containsPoint(p)) {
            clicked = object;
          }
        });
        return clicked;
      };

      /**
       * Creates a new fabric instance given the canvas element ID
       * @param id - id of the canvas element
       * @returns {fabric.Canvas}
       */
      var create = function(id, containerID) {
        fab = new fabric.Canvas(id);

        this.fabState.objects = fab.getObjects();

        var self = this;
        // Possibly remove and instead set listeners on individual objects
        fab.on('object:selected', function(e) {
          var selected = e.target
          //console.log(selected);
          $timeout(function(){
            self.fabState.selectedObj = selected;
          });
        });

        fab.on('object:modified', function(e) {
          $rootScope.$apply();
          //$log.log(e);
        });

        fab.on('mouse:down', function(options){

          // on shift click object in a group, try to remove it
          // from the group.
          if (options.target && options.e.shiftKey) {

            var target = options.target;
            if (!target.isType('group')) return;
            var mousePos = fab.getPointer(options.e);
            var object = getGroupItemClicked(target, mousePos);
            if (!object) return;

            object.clone(function(c){
              //c.name =
              fab.add(c);
              var newP = target.getCenterPoint().add(object.getCenterPoint());
              c.setPositionByOrigin(newP, 'center', 'center');
              //c.scale = target.scale;
              //c.angle = target.angle;
              target.removeWithUpdate(object);
              target.forEachObject(function(obj,x) {
                obj.active = false;
              });
              $timeout(function(){
                fab.setActiveObject(c);
                redraw();
              },300)
            });

          }

        })

        return fab;
      }

      var addSprite = function(asset) {
        fabric.Sprite.fromURL(asset.filePath, function(oImg) {
          $timeout(function(){
            oImg.asset = asset;
            oImg.ID = asset.ID; // set default ID
            oImg.top = scrollY + (oImg.height/2);
            oImg.left = scrollX + (oImg.width/2);
            fab.add(oImg);
          })
        }, {
          originX : "center", originY : "center", centeredScaling : true
        });
      }

      var redraw = function() {
        fab.renderAll();
      }

      var select = function(item) {
        fab.setActiveObject(item);
      }

      var groupSelected = function(){
        var selected = fab.getActiveGroup();

        if (!selected) return;

        selected.clone(function(clone){

          fab.add(clone);
          clone.centeredScaling = true;
          clone.ID = "New Group";

          selected.forEachObject(function (o) {
            fab.remove(o);
          });

          fab.discardActiveGroup();
          $timeout(function(){
            fab.setActiveObject(clone);
            redraw();
          },500)

        });
      }


      var fabState = {
        "objects" : null,
        "selectedObject" : null
      }

      return {
        "create" : create,
        "fabState" : fabState,
        "addSprite" : addSprite,
        "redraw" : redraw,
        "refreshCanvasPos": refreshCanvasPos,
        "select" : select,
        "groupSelected": groupSelected
      };
    });