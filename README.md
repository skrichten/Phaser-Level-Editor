Phaser-Level-Editor
===================
Starting to work on a simple level editor for the Phaser game engine.
At least for now, the output could work in just about any game engine.

This app is built with: 

- node-webkit (mostly for filesystem access)
- AngularJS (For easy databinding and overall MVC-ish architecture)
- FabricJS (seems a natural fit since it uses Canvas and Phaser can also use Canvas)

To get up and running you need Node, Grunt, and Bower.  If you have all those run...

npm install
bower install (for now you will have to move your bower_components folder to the app folder until I get things fixed up)
npm start

Things are in very rough shape right now.  This is not even close to an alpha... just putting this out there to see if there is interest

If you click the New Asset button, you can load in a new image.
If you click on the name in the asset list, that image is added to the canvas.
The canvas is a fabric instance, so you can drag/drop, scale, rotate. You can also group objects
and shift-click to un-group (currently lots of bugs in this).  In the file menu save and save as will allow you to save
to a json file, but loading is not implemented yet.

I have a simple Phaser plugin for loading the assets and level into a game, and I will share that as well.  Probably
in a separate repository.
