'use strict';


angular.module('leveleditApp')
    .service('fabricService', function($log, $q, $timeout, $rootScope){
      var scrollX = 0;
      var scrollY = 0;
      var fab;

      var getGroupItemAtPoint = function (group, point) {
        var clicked = null;
        var p = group.toLocalPoint(point);
        group.forEachObject(function(object,i) {
          if (object.containsPoint(p)) {
            clicked = object;
          }
        });
        return clicked;
      };

      var onClick = function(options){
        // on shift click object in a group, try to remove it
        // from the group.
        if (options.target && options.e.shiftKey) {
          var target = options.target;
          if (!target.isType('group')) return;
          var mousePos = fab.getPointer(options.e);
          var object = getGroupItemAtPoint(target, mousePos);
          if (!object) return;

          object.clone(function(c){
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
      };

      var onModified = function(e) {
        $rootScope.$apply();
      };

      /**
       * Creates a new fabric instance given the canvas element ID
       * @param id - id of the canvas element
       * @returns {fabric.Canvas}
       */
      this.create = function(id, containerID) {
        fab = new fabric.Canvas(id);

        this.fabState.objects = fab.getObjects();

        var _this = this;
        // Possibly remove and instead set listeners on individual objects
        fab.on('object:selected', function(e) {
          var selected = e.target
          //console.log(selected);
          $timeout(function(){
            _this.fabState.selectedObj = selected;
          });
        });

        fab.on('object:modified', onModified);
        fab.on('mouse:down', onClick);

        return fab;
      }

      /**
       * Adds a sprite instance to the canvas
       * @param asset - the image asset for the sprite to render
       * @param cb - the callback to call when finished
       * @param x - x position
       * @param y - y position
       */
      this.addSprite = function(asset, x, y) {
        var deferred = $q.defer();
        fabric.Sprite.fromURL(asset.filePath, function(sprite) {
          $timeout(function(){
            sprite.asset = asset;
            sprite.ID = asset.ID; // set default ID
            sprite.top = y || scrollY + (sprite.height/2);
            sprite.left = x || scrollX + (sprite.width/2);
            fab.add(sprite);
            deferred.resolve(sprite);
          });
        }, {
          originX : "center", originY : "center", centeredScaling : true
        });
        return deferred.promise;
      }

      /**
       * Called when the div containing the canvas is scrolled.
       * Fabric needs this to position things properly
       * and we take the opportunity to save the scroll position
       * so we know where to place new objects.
       */
      this.refreshCanvasPos = function(x,y) {
        fab.calcOffset();
        scrollX = x;
        scrollY = y;
      }

      this.redraw = function() {
        fab.renderAll();
      }

      // Select the given canvas object
      this.select = function(item) {
        fab.setActiveObject(item);
      }

      // Create a group from the currently selected objects
      this.groupSelected = function(){
        var selected = fab.getActiveGroup();
        var _this = this;

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
            this.redraw();
          },500)

        });
      }


      this.fabState = {
        "objects" : null,
        "selectedObject" : null
      }

    });