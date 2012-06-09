jQuery.fn.reverse = [].reverse;

function PlayerViewModel() {
  var self = this;

  self.setGame = function (game) {
    self.score = ko.observable(0);
    self.game = game;
    self.setLetters(game.letters);
  };

  self.setLetters = function (letters) {
    self.availableLetters = ko.observableArray([]);
    self.playedLetters = [];
    $(letters).each(function (i, letter) {
      self.availableLetters.push({c:ko.observable(letter), v:ko.observable(true)});
      self.playedLetters.push({c:ko.observable('_'), v:ko.observable(true)});
    });
  };

  self.playLetter = function (letter) {
    var al = $.grep(self.availableLetters(), function (al) { return al.v() && al.c() === letter; })[0];
    if (al) {
      al.v(false);
      $.grep(self.playedLetters, function (pl) { return pl.c() === '_'; })[0].c(letter);
    }
  };

  self.deleteLetter = function () {
    var pl = $.grep($(self.playedLetters).reverse(), function (pl) { return pl.c() !== '_'})[0];
    if (pl) {
      $.grep(self.availableLetters(), function (al) { return !al.v() && al.c() == pl.c(); })[0].v(true);
      pl.c('_');
    }
  };

  self.getWord = function () {
     return self.playedLetters.reduce(function (acc, pl, i) { return acc + (pl.c() !== '_' ? pl.c() : ''); }, '');
  };

  self.submitWord = function () {
    var word = self.getWord();
    $(self.availableLetters()).each(function () { self.deleteLetter(); });
    self.game.playWord(word);
//    self.score(self.score() + self.game.playWord(word));
  };

  self.shuffle = function () {
    self.availableLetters.sort(function () { return (Math.round(Math.random()) - 0.5); });
  };
}
