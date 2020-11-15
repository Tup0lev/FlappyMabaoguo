require.register('main.js', function(exports, require, module) {
'use strict';

var global = require('global');
var sounds = require('sounds');
var scene = require('scene');
var utils = require('utils');

var settings = global.settings;

function preload() {
  global.phaserGame.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
  global.phaserGame.stage.scale.setScreenSize(true);

  sounds.preload();
  scene.preload();
}

function create() {
  sounds.create();
  scene.create();
  scene.shift('title');
}

function update() {
  scene.update();
}

function render() {
  scene.render();
}

exports.run = function() {
  utils.loadSettingsFromUrl();

  var width = 480;
  var height = 700;

  var availWidth = document.body.offsetWidth;
  var availHeight = document.body.offsetHeight;
  if (availWidth > availHeight) {
      var w = availWidth;
      availWidth = availHeight;
      availHeight = w;
  }

  var device = new Phaser.Device();
  if (availWidth >= 320 && availHeight >= 480 && availHeight <= 1280) {
    if (!device.desktop || settings.mobile) {
      width = availWidth;
      height = availHeight;
    }
  }
  console.log(device.desktop ? 'desktop' : 'mobile', width, 'x', height);

  global.phaserGame = new Phaser.Game(
    width,
    height,
    settings.canvas ? Phaser.CANVAS : Phaser.AUTO,
    document.getElementById('game'),
    {
      preload: preload,
      create: create,
      update: update,
      render: render
    },
    false,
    settings.antialias
  );
};

});
