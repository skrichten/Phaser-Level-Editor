'use strict';


angular.module('leveleditApp')
    .service('mapService', function($log, $q, fabricService){
      var fs = require('fs');
      var filePath;
      var _this = this;

      var onSavePathChange = function(e) {
        console.log(this.value);
        filePath = this.value;
        _this.save();
      };

      var onloadPathChange = function(e) {
      }

      // A file input element used to spawn a file dialog

      var saveAsInp = document.createElement('input');
      saveAsInp.type = 'file';
      saveAsInp.nwsaveas = "myMap.json";
      saveAsInp.addEventListener("change", onSavePathChange , false);
      saveAsInp.addEventListener("click", function(){this.value = null;}, false);

      // A file input element used to spawn a file dialog
      var loadInp = document.createElement('input');
      loadInp.type = 'file';
      loadInp.addEventListener("change", onloadPathChange , false);
      loadInp.addEventListener("click", function(){this.value = null;}, false);

      /**
       * Converts an array fabric object to data we need to actually store
       * @param l - list of fabric objects
       * @param container - the array to store the converted data in
       */
      this.serializeFabricObjects = function(list, container) {
        var self = this;
        list.forEach(function(obj, i) {
          var newObj = self.parseObject(obj);
          if (obj.type === 'group') {
            var subList = obj.getObjects();
            newObj.objects = [];
            self.serializeFabricObjects(subList, newObj.objects);
          }
          container.push(newObj);
        });
      }

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
      }


      this.save = function() {
        this.mapData.objects = [];
        var map = fabricService.fabState.objects;
        this.serializeFabricObjects(map, this.mapData.objects);
        var saveData = JSON.stringify(this.mapData);
        console.log(this.mapData);

        if (filePath) {
          fs.writeFile(filePath, saveData, saveComplete);
        } else {
          this.saveAs();
        }
      }


      var saveComplete = function(err){
        if(err) {
          alert(err);
        } else {
          // set working directory on input to make it easy to saveAS later
          saveAsInp.nwworkingdir = filePath;
          alert("Save complete");
        }

      }

      this.saveAs = function() {
        saveAsInp.click();
      }

      this.load = function() {
        loadInp.click();
      }

      this.mapData = {
        "config": {
          "width": 10000,
          "height": 640,
          "canvasID": "map-canvas"
        },
        "objects": [],
        "assets":[]
      }
      this.state = {
        "selectedObj": {}
      }

    });