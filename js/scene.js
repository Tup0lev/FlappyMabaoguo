require.register('scene.js', function(exports, require, module) {
'use strict';

var global = require('global');
var utils = require('utils')
var preloadImage = utils.preloadImage;
var game = require('game');
var sounds = require('sounds');

var settings = global.settings;

function TextButton(opts) {
  this.label = global.phaserGame.add.text(
    opts.x || 0,
    opts.y || 0,
    opts.text || '',
    {
      font: (opts.size || '22px') + ' ' + global.font,
      fill: '#fff',
      stroke: '#430',
      strokeThickness: 4,
      align: 'center'
    }
  );
  this.label.anchor.setTo(
    opts.anchorX || 0,
    opts.anchorY || 0
  );

  this.sprite = global.phaserGame.add.sprite(this.label.x, this.label.y);
  this.sprite.width = this.label.width;
  this.sprite.height = this.label.height;
  this.sprite.anchor.setTo(this.label.anchor.x, this.label.anchor.y);
  this.sprite.inputEnabled = true;

  this.events = this.sprite.events;
}

TextButton.prototype.show = function() {
  this.label.visible = true;
  this.sprite.visible = true;
};

TextButton.prototype.hide = function() {
  this.label.visible = false;
  this.sprite.visible = false;
};


var tipsText, loadingText, scoreText;
var playButton, restartButton, feedbackButton, playBgmButton, otherGames;

function setLoadingText(percent) {
  loadingText.setText(
    'Loading...\n\n独轮车的行程: %s % \n作者：AcFun/Pilipili 图波列夫的设计图'.replace('%s', percent)
  );
}

function createLoadingScreen() {
  tipsText = global.phaserGame.add.text(
    global.phaserGame.width / 2,
    global.phaserGame.height / 4,
    '请打开声音',
    {
      font: '16px ' + global.font,
      fill: '#fff',
      align: 'center'
    }
  );
  tipsText.anchor.setTo(0.5, 0.5);

  loadingText = global.phaserGame.add.text(
    global.phaserGame.width / 2,
    global.phaserGame.height / 2,
    '',
    {
      font: '24px ' + global.font,
      fill: '#f00',
      align: 'center'
    }
  );
  loadingText.anchor.setTo(0.5, 0.5);
  setLoadingText(0);
  global.phaserGame.load.onFileComplete.add(setLoadingText);
}

function unlockAudio() {
  utils.unlockAudioContext();
}

function createButtons() {
  playButton = new TextButton({
    x: global.phaserGame.width / 2,
    y: global.phaserGame.height - global.phaserGame.height / 3,
    anchorX: 0.5,
    anchorY: 0.5,
    text: '开始切磋'
  });
  playButton.hide();

  playButton.events.onInputUp.add(function() {
    unlockAudio();
    exports.shift('play');
  });


  restartButton = new TextButton({
    x: global.phaserGame.width / 2,
    y: global.phaserGame.height - global.phaserGame.height / 5,
    anchorX: 0.5,
    anchorY: 0.5,
    text: '耗子尾汁，好好反思 点击重生'
  });
  restartButton.hide();

  otherGames = new TextButton({
    x: global.phaserGame.width / 2,
    y: global.phaserGame.height - global.phaserGame.height / 5,
    anchorX: 0.5,
    anchorY: 1.5,
    text: '更多游戏'
  });
  otherGames.hide();


  restartButton.events.onInputUp.add(function() {
    exports.shift('title');
  });

  otherGames.events.onInputUp.add(function() {
    window.location.replace("https://github.com/Tup0lev/GamesIndex")
  });

  feedbackButton = new TextButton({
    x: 0,
    y: 0,
    size: '14px',
    text: '耗子尾汁'
  });

  feedbackButton.events.onInputUp.add(function() {
    unlockAudio();
    if (settings.scoreSounds >= 15)
      sounds('score').playCustom(15);
    if (!settings.feedback)
      return;
    window.open(settings.feedback);
  });


  playBgmButton = new TextButton({
    x: global.phaserGame.width,
    y: 0,
    anchorX: 1,
    size: '14px',
    text: '治疗颈椎'
  });

  playBgmButton.events.onInputUp.add(function() {
    unlockAudio();
    sounds('bgm').toggle();
  });
}

function createScoreText() {
  scoreText = global.phaserGame.add.text(
    global.phaserGame.width / 2,
    global.phaserGame.height / 2,
    '',
    {
      font: '18px ' + global.font,
      fill: '#fff',
      stroke: '#430',
      strokeThickness: 4,
      align: 'center'
    }
  );
  scoreText.anchor.setTo(0.5, 0.5);
  scoreText.visible = false;
}

function showScore() {
  var text = '讲了 %s 次武德';

  var score = global.score;
  var timeElapsed = global.timeElapsed;
  var a = Math.floor(score / timeElapsed * 100);
  a = text.replace('%s', score).replace('%s', timeElapsed).replace('%s', a).replace('%s', global.bestScore);

  scoreText.setText(a);
  scoreText.visible = true;
}

function hideScore() {
  scoreText.visible = false;
}

var sceneName = 'loading';
var scenes = {
  'loading': {
    enter: function() {
    },

    exit: function() {
      tipsText.visible = false;
      loadingText.visible = false;
    }
  },

  'title': {
    enter: function() {
      playButton.show();
    },

    exit: function() {
      playButton.hide();
    }
  },

  'play': {
    enter: function() {
      game.start(function() {
        exports.shift('end');
      });
    },

    exit: function() {
    }
  },

  'end': {
    enter: function() {
      restartButton.show();
      otherGames.show();
      showScore();
    },

    exit: function() {
      restartButton.hide();
      otherGames.hide();
      hideScore();

      game.reset();
    }
  }
};

exports.shift = function(name) {
  if (sceneName === name)
      return;
  if (sceneName)
    scenes[sceneName].exit();
  sceneName = name;
  scenes[sceneName].enter();
};


exports.preload = function() {
  createLoadingScreen();
  game.preload();

};

exports.create = function() {
  game.create();

  createButtons();
  createScoreText();
};

exports.update = function() {
  game.update();
};

exports.render = function() {
  game.render();
};

});
