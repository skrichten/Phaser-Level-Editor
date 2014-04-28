'use strict';


angular.module('leveleditApp')
    .service('mapService', function($log, $q, $rootScope, fabricService){
      var fs = require('fs');
      var filePath;
      var _this = this;

      var onSavePathChange = function(e) {
        console.log(this.value);
        filePath = this.value;
        _this.save();
      };

      // A file input element used to spawn a file dialog
      var saveAsInp = document.createElement('input');
      saveAsInp.type = 'file';
      saveAsInp.nwsaveas = "myMap.json";
      saveAsInp.addEventListener("change", onSavePathChange , false);
      saveAsInp.addEventListener("click", function(){this.value = null;}, false);

      var onloadPathChange = function(e) {
        filePath = this.value;
        loadFile();
      };

      // A file input element used to spawn a file dialog
      var loadInp = document.createElement('input');
      loadInp.type = 'file';
      loadInp.addEventListener("change", onloadPathChange , false);
      loadInp.addEventListener("click", function(){this.value = null;}, false);

      var loadFile = function() {
        fs.readFile(filePath, fileLoadComplete);
      };

      var fileLoadComplete = function(err, data){
        if(err) {
          alert(err);
        } else {
          // set working directory on input to make it easy to saveAS later
          saveAsInp.nwworkingdir = filePath;
          $rootScope.$apply(function(){
            _this.state.mapData = JSON.parse(data);
            _this.renderMap();
          });

        }
      };

      this.getAsset = function(id) {
        var assets = this.state.mapData.assets
        for (var i = 0, len = assets.length; i < len; i++) {
          if (assets[i].ID === id) {
            return assets[i];
          }
        }
        return null;
      };

      var addSprite = function(obj) {
        var asset = _this.getAsset(obj.assetID);
        if (!asset) return;
        fabricService.addSprite(asset, obj.x, obj.y)
            .then(function(sprite){
              var props = obj.properties;
              sprite.setScaleX(props.scale.x);
              sprite.setScaleY(props.scale.y);
              sprite.setOpacity(props.alpha);
              sprite.setAngle(props.angle);
              fabricService.redraw();
            });
      }

      this.renderMap = function() {
        for (var i = 0, len = this.state.mapData.objects.length; i < len; i++) {
          var obj = this.state.mapData.objects[i];
          if (obj.type.toLowerCase() === 'sprite') {
            addSprite(obj);
          }
        }
      };

      /**
       * Converts an array fabric object to data we need to actually store
       * @param l - list of fabric objects
       * @param container - the array to store the converted data in
       */
      this.serializeFabricObjects = function(list, container) {
        var _this = this;
        list.forEach(function(obj, i) {
          var newObj = _this.parseObject(obj);
          if (obj.type === 'group') {
            var subList = obj.getObjects();
            newObj.objects = [];
            _this.serializeFabricObjects(subList, newObj.objects);
          }
          container.push(newObj);
        });
      };

      /**
       * Converts a fabric object to data we need to actually store
       * @param obj
       * @returns obj
       */
      this.parseObject = function(obj) {
        var newObj = {
          "type": obj.type,
          "x": Math.round(obj.left),
          "y": Math.round(obj.top),
          "properties" : {
            "name": obj.ID,
            "angle": obj.angle,
            "alpha": obj.opacity, // might need to reverse
            "scale": {"x" : obj.scaleX, "y" : obj.scaleY}
          }
        }
        if (obj.asset) {
          newObj.assetID = obj.asset.ID;
        }

        return newObj;
      };


      this.save = function() {
        this.state.mapData.objects = [];
        var map = fabricService.fabState.objects;
        this.serializeFabricObjects(map, this.state.mapData.objects);
        var saveData = JSON.stringify(this.state.mapData);
        console.log(this.state.mapData);

        if (filePath) {
          fs.writeFile(filePath, saveData, saveComplete);
        } else {
          this.saveAs();
        }
      };

      var saveComplete = function(err){
        if(err) {
          alert(err);
        } else {
          // set working directory on input to make it easy to saveAS later
          saveAsInp.nwworkingdir = filePath;
          alert("Save complete");
        }
      };

      this.saveAs = function() {
        saveAsInp.click();
      };

      this.load = function() {
        loadInp.click();
      };

      this.state = {
        "selectedObj": {},
        "mapData": {
          "config" : {
             "width"   : 10000,
             "height"  : 640,
             "bgColor" : "#000",
             "canvasID": "map-canvas"
          },
          "objects": [],
          "assets" : []
        }
      };

    });