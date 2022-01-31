import Alpine from 'alpinejs';

Alpine.data('skyjo', () => ({
  players: Array.from({ length: 8 }, () => ''),
  round: -1,
  rounds: [],

  init() {
    const players = window.localStorage.getItem('skyjo_players');
    if (players) {
      this.players = JSON.parse(players);
    }

    const round = window.localStorage.getItem('skyjo_round');
    if (round) {
      this.round = parseInt(round);
    }

    const rounds = window.localStorage.getItem('skyjo_rounds');
    if (rounds) {
      this.rounds = JSON.parse(rounds);
    }

    Alpine.effect(() => {
      window.localStorage.setItem('skyjo_players', JSON.stringify(this.players));
      window.localStorage.setItem('skyjo_round', this.round);
      window.localStorage.setItem('skyjo_rounds', JSON.stringify(this.rounds));
    });
  },

  activePlayers() {
    return this.players.filter(player => player !== '');
  },

  activePlayersShort() {
    return this.activePlayers().map(player => player.substr(0, 3).toUpperCase());
  },

  nextRound() {
    if (this.round === -1 && this.activePlayers().length < 2) {
      alert("Mindestens zwei Spieler müssen angegeben werden.");
      return;
    }

    if (this.round >= 0) {
      if (this.rounds[this.round].points.some(points => points === '')) {
        alert("Alle Punkte müssen angegeben werden.");
        return;
      }

      if (this.rounds[this.round].points.some(points => isNaN(parseInt(points, 10)))) {
        alert("Alle Punkte müssen Zahlen sein.");
        return;
      }

      if (this.rounds[this.round].finisher === null) {
        alert("Der Spieler, welcher die Runde beendet hat muss angegeben werden.");
        return;
      }
    }

    if (this.round === this.rounds.length - 1) {
      this.rounds.push({
        points: Array.from({ length: this.activePlayers().length }, () => ''),
        finisher: null,
      });
    }

    this.round = this.round + 1;
  },

  prevRound() {
    this.round = this.round - 1;
  },

  roundsPoints() {
    return this.rounds
      .slice(0, this.rounds.length - 1)
      .map(round => {
        const points = round.points.map(points => parseInt(points, 10));
        const finisherPoints = points[round.finisher];
        const othersPoints = points.filter((_, index) => index != round.finisher);

        // Double points if finisher didn't come in first
        if (finisherPoints > 0 && othersPoints.some(p => p <= finisherPoints)) {
          points[round.finisher] = finisherPoints * 2;
        }

        return points;
      });
  },

  totalPoints() {
    return this.roundsPoints().reduce(
      (points, roundPoints) => points.map((p, i) => p + roundPoints[i]),
      Array.from({ length: this.activePlayers().length }, () => 0)
    );
  },

  reset() {
    if (!confirm("Wirklich zurücksetzen?")) {
      return;
    }

    this.round = -1;
    this.rounds = [];
  },
}));

Alpine.start();
