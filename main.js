import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import RankingScene from './scenes/RankingScene.js';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#1d1d1d',
  scene: [MenuScene, GameScene, GameOverScene, RankingScene],
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  }
};

const game = new Phaser.Game(config);
function saveScore(name, score) {
  let ranking = JSON.parse(localStorage.getItem('snakeRanking')) || [];
  ranking.push({ name, score });
  ranking.sort((a, b) => b.score - a.score);
  ranking = ranking.slice(0, 5);
  localStorage.setItem('snakeRanking', JSON.stringify(ranking));
}
