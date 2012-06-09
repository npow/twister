var fs = require('fs');
var http = require('http');
var express = require('express');
var nowjs = require('now');
var $ = require('jQuery');

var app = express.createServer();
app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));
app.get('/', function (req, res) {
  fs.readFile('index.html', function (err, data) {
    res.writeHead('200', {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});

const timeLimit = 2*60*1000; // 2 mins
var server = app.listen(process.env.PORT || 8080);
var everyone = nowjs.initialize(server);

function getTiles() {
  var tiles = [
    { letters: "VESIEB".split(''), words :["SEE", "VIE", "EVE", "BEE", "VISE", "VIES", "EVES", "BEES", "SIEVE", "VIBES", "BEVIES"] },
    { letters: "UCMEPI".split(''), words :["EMU", "CUE", "CUP", "ICE", "IMP", "UMP", "PIE", "EPIC", "MICE", "PUCE", "PUMICE"] },
  ];
  return tiles[Math.floor(Math.random() * tiles.length)];
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

var scores = {
  'A': 1,
  'B': 3,
  'C': 3,
  'D': 2,
  'E': 1,
  'F': 4,
  'G': 2,
  'H': 4,
  'I': 1,
  'J': 8,
  'K': 5,
  'L': 1,
  'M': 3,
  'N': 1,
  'O': 1,
  'P': 3,
  'Q': 10,
  'R': 1,
  'S': 1,
  'T': 1,
  'U': 1,
  'V': 4,
  'W': 4,
  'X': 8,
  'Y': 4,
  'Z': 10,
};

function getScore(w) {
  return w.split('').reduce(function (acc, letter, i) { return acc + scores[letter]; }, 0);
}

everyone.now.id = 0;

everyone.now.tryStartGame = function () {
  if (!everyone.now.gameInProgress) {
    var tiles = getTiles();
    var startTime = new Date();
    everyone.now.playedWords = [];
    everyone.now.playerScores = {'_DUMMY': 0};
    everyone.now.letters = tiles.letters;
    everyone.now.words = tiles.words;
    everyone.now.startGame();
    everyone.now.gameInProgress = true;

    var timerId = setInterval(function () {
      var now = new Date();
      var timeLeft = (timeLimit - (now - startTime)) / 1000;
      if (timeLeft < 1) { // game over
        clearInterval(timerId);
        everyone.now.timeLeft = 'GAME OVER';
        everyone.now.gameInProgress = false;
      } else {
        everyone.now.timeLeft = pad(parseInt(timeLeft / 60), 2) + ":" + pad(parseInt(timeLeft % 60).toFixed(0), 2);
      }
      everyone.now.updateTimer();
    }, 200);
  }
};

everyone.now.trySubmitWord = function (word, player) {
  if (word in everyone.now.playedWords) {
    return;
  }
  everyone.now.playedWords[word] = true;
  if (!(player in everyone.now.playerScores)) {
    everyone.now.playerScores[player] = 0;
  }
  everyone.now.playWord(word, player);
  everyone.now.playerScores[player] += getScore(word);
  everyone.now.updateScores();
};
