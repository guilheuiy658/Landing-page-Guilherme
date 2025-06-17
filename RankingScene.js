export default class RankingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'RankingScene' });
  }

  create() {
    const { width } = this.scale;

    this.add.text(width / 2, 80, '🏆 Ranking - Top 5', {
      fontSize: '48px',
      color: '#ffd700'
    }).setOrigin(0.5);

    const ranking = JSON.parse(localStorage.getItem('snakeRanking')) || [];

    if (ranking.length === 0) {
      this.add.text(width / 2, 160, 'Nenhum registro ainda.', {
        fontSize: '28px',
        color: '#fff'
      }).setOrigin(0.5);
    } else {
      ranking.forEach((item, i) => {
        this.add.text(width / 2, 160 + i * 40, `${i + 1}. ${item.name} - ${item.score} pts`, {
          fontSize: '28px',
          color: '#fff'
        }).setOrigin(0.5);
      });
    }

    const backButton = this.add.text(width / 2, 400, 'Voltar ao Menu', {
      fontSize: '28px',
      backgroundColor: '#0f0',
      color: '#000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();

    backButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
