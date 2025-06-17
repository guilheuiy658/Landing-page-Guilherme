export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const { width, height } = this.scale;

    this.add.text(width / 2, 150, '😵 Fim de Jogo', {
      fontSize: '48px',
      color: '#ff0000'
    }).setOrigin(0.5);

    this.add.text(width / 2, 220, `Pontuação: ${this.finalScore}`, {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const restartButton = this.add.text(width / 2, 320, 'Jogar Novamente', {
      fontSize: '28px',
      backgroundColor: '#0f0',
      color: '#000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();

    const rankingButton = this.add.text(width / 2, 400, 'Ver Ranking', {
      fontSize: '28px',
      backgroundColor: '#ff0',
      color: '#000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();

    restartButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    rankingButton.on('pointerdown', () => {
      this.scene.start('RankingScene');
    });
  }
}
