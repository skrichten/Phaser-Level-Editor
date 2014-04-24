(function(global) {

  "use strict";

  var extend = fabric.util.object.extend;

  if (!global.fabric) {
    global.fabric = { };
  }

  if (global.fabric.Sprite) {
    fabric.warn('fabric.Sprite is already defined.');
    return;
  }

  /**
   * Image class
   * @class fabric.Sprite
   * @extends fabric.Image

   */
  fabric.Sprite = fabric.util.createClass(fabric.Image, /** @lends fabric.Image.prototype */ {

    type: 'Sprite',

    initialize: function(element, options) {
      options || (options = { });

      this.callSuper('initialize', element, options);
      this.set('ID', options.ID || 'New Sprite');
      this.type = 'Sprite';
    },


    toObject: function(propertiesToInclude) {
      return extend(this.callSuper('toObject', propertiesToInclude), {
        ID: this.get('ID'),
        asset: this.get('asset'),
        type: this.get('type')
      });
    },

    _render: function(ctx) {
      this.callSuper('_render', ctx);
    }

  });

  /**
   * Default CSS class name for canvas
   * @static
   * @type String
   * @default
   */
  fabric.Sprite.CSS_CANVAS = "canvas-img";

  fabric.Sprite.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat('x y width height xlink:href'.split(' '));

  fabric.Sprite.fromURL = function(url, callback, imgOptions) {
    fabric.util.loadImage(url, function(img) {
      callback(new fabric.Sprite(img, imgOptions));
    }, null, imgOptions && imgOptions.crossOrigin);
  };

  fabric.Sprite.fromObject = function(object, callback) {
    fabric.util.loadImage(object.src, function(img) {
      fabric.Sprite.prototype._initFilters.call(object, object, function(filters) {
        object.filters = filters || [ ];
        var instance = new fabric.Sprite(img, object);
        callback && callback(instance);
      });
    }, null, object.crossOrigin);
  };

  /**
   * Indicates that instances of this type are async
   * @static
   * @type Boolean
   * @default
   */
  fabric.Sprite.async = true;

  /**
   * Indicates compression level used when generating PNG under Node (in applyFilters). Any of 0-9
   * @static
   * @type Number
   * @default
   */
  fabric.Sprite.pngCompression = 1;


})(typeof exports !== 'undefined' ? exports : this);
