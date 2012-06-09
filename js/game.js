function GameViewModel(letters, words) {
  var self = this;
  self.letters = letters;
  self.words = [];
  self.scores = ko.observableArray([]);
  
  $(words).each(function (i, w) {
    self.words.push({word:w, played:ko.observable(false)});
  });
  
  self.findWord = function (word) {
    return $.grep(self.words, function (w) { return !w.played() && w.word === word; })[0];
  }
  
  self.playWord = function (w) {
    var word = self.findWord(w);
    if (word) {
      word.played(true);
    }
  };

  self.updateScores = function (playerScores) {
    for (var player in playerScores) {
      var item = $.grep(self.scores(), function (w) { return w.name === player; })[0];
      if (item) {
        item.score(playerScores[player]);
      } else if (player !== '_DUMMY') {
        self.scores.push({name: player, score: ko.observable(playerScores[player])});
      }
    }
    self.scores.sort(function (a, b) { return a.score() < b.score(); });
  };

  self.sortFunction = function (a, b) {
    return a.score > b.score;
  };

  self.sortedScores = ko.computed({
    read: function () {
      var arr = [];
      for (var player in self.playerScores) {
        arr.push({player: player, score: self.playerScores[player]()});
      }
      arr.sort(self.sortFunction);
      return arr;
    },
    deferEvaluation: true
  }, self);
}

