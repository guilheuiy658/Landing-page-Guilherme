export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {}

  create() {
    this.add.text(this.scale.width / 2, 100, 'Snake Game', {
      fontSize: '48px',
      fill: '#fff'
    }).setOrigin(0.5);

    this.nameInput = document.createElement('input');
    this.nameInput.type = 'text';
    this.nameInput.placeholder = 'Digite seu nome';
    this.nameInput.style.position = 'absolute';
    this.nameInput.style.top = '200px';
    this.nameInput.style.left = '50%';
    this.nameInput.style.transform = 'translateX(-50%)';
    document.body.appendChild(this.nameInput);

    const startButton = this.add.text(this.scale.width / 2, 300, 'Iniciar Jogo', {
      fontSize: '32px',
      fill: '#0f0',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();

    startButton.on('pointerdown', () => {
      const playerName = this.nameInput.value.trim() || 'Jogador';
      localStorage.setItem('playerName', playerName);
      this.nameInput.remove(); // Remove o input do DOM
      this.scene.start('GameScene');
    });
  }
}
