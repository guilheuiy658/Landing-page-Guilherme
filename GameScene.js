export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.cellSize = 20; // Tamanho do bloco
  }

  create() {
    this.playerName = localStorage.getItem('playerName') || 'Jogador';

    this.score = 0;
    this.speed = 150; // tempo (ms) entre movimentos
    this.direction = 'RIGHT';
    this.newDirection = 'RIGHT';
    this.moveTimer = 0;
    this.phase = 1;

    this.snake = [{ x: 10, y: 10 }]; // Começa com 1 parte
    this.food = this.createFood();

    this.cursors = this.input.keyboard.createCursorKeys();

    this.scoreText = this.add.text(10, 10, 'Pontos: 0', {
      fontSize: '20px',
      fill: '#fff'
    });

    this.timer = this.time.addEvent({
      delay: this.speed,
      callback: this.move,
      callbackScope: this,
      loop: true
    });

    // Fase 2: Obstáculo simples após 10 pontos
    this.obstacles = [];
  }

  createFood() {
    const pos = this.getRandomEmptyCell();
    return { x: pos.x, y: pos.y };
  }

  getRandomEmptyCell() {
    let x, y;
    do {
      x = Phaser.Math.Between(0, Math.floor(this.scale.width / this.cellSize) - 1);
      y = Phaser.Math.Between(1, Math.floor(this.scale.height / this.cellSize) - 1);
    } while (this.snake.some(s => s.x === x && s.y === y));
    return { x, y };
  }

  move() {
    const head = Object.assign({}, this.snake[0]);

    // Atualiza direção
    this.direction = this.newDirection;

    if (this.direction === 'LEFT') head.x--;
    else if (this.direction === 'RIGHT') head.x++;
    else if (this.direction === 'UP') head.y--;
    else if (this.direction === 'DOWN') head.y++;

    // Colisões
    if (this.checkCollision(head)) {
      this.endGame();
      return;
    }

    this.snake.unshift(head); // Adiciona nova cabeça

    // Comeu a comida
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 1;
      this.scoreText.setText('Pontos: ' + this.score);

      // Aumenta dificuldade
      if (this.score % 5 === 0) {
        this.speed = Math.max(50, this.speed - 10);
        this.timer.delay = this.speed;
      }

      // Fase 2 ativa
      if (this.score === 10 && this.phase === 1) {
        this.phase = 2;
        this.createObstacles();
      }

      this.food = this.createFood();
    } else {
      this.snake.pop(); // Remove cauda
    }

    this.renderGame();
  }

  renderGame() {
    this.clearGraphics();

    const graphics = this.add.graphics({ fillStyle: { color: 0x00ff00 } });
    this.snake.forEach((part, i) => {
      graphics.fillRect(part.x * this.cellSize, part.y * this.cellSize, this.cellSize - 1, this.cellSize - 1);
    });

    const foodGfx = this.add.graphics({ fillStyle: { color: 0xffff00 } });
    foodGfx.fillRect(this.food.x * this.cellSize, this.food.y * this.cellSize, this.cellSize - 1, this.cellSize - 1);

    // Obstáculos
    if (this.phase === 2) {
      const obsGfx = this.add.graphics({ fillStyle: { color: 0xff0000 } });
      this.obstacles.forEach(o => {
        obsGfx.fillRect(o.x * this.cellSize, o.y * this.cellSize, this.cellSize - 1, this.cellSize - 1);
      });
    }
  }

  clearGraphics() {
    this.children.removeAll();
    this.add.text(10, 10, 'Pontos: ' + this.score, {
      fontSize: '20px',
      fill: '#fff'
    });
  }

  createObstacles() {
    for (let i = 0; i < 10; i++) {
      const pos = this.getRandomEmptyCell();
      this.obstacles.push(pos);
    }
  }

  checkCollision(head) {
    const maxX = Math.floor(this.scale.width / this.cellSize);
    const maxY = Math.floor(this.scale.height / this.cellSize);

    // Fora do mapa
    if (head.x < 0 || head.x >= maxX || head.y < 0 || head.y >= maxY) return true;

    // Colidiu com o próprio corpo
    if (this.snake.some(part => part.x === head.x && part.y === head.y)) return true;

    // Obstáculos
    if (this.phase === 2 && this.obstacles.some(o => o.x === head.x && o.y === head.y)) return true;

    return false;
  }

  update() {
    if (this.cursors.left.isDown && this.direction !== 'RIGHT') {
      this.newDirection = 'LEFT';
    } else if (this.cursors.right.isDown && this.direction !== 'LEFT') {
      this.newDirection = 'RIGHT';
    } else if (this.cursors.up.isDown && this.direction !== 'DOWN') {
      this.newDirection = 'UP';
    } else if (this.cursors.down.isDown && this.direction !== 'UP') {
      this.newDirection = 'DOWN';
    }
  }

  endGame() {
    const name = this.playerName;
    const oldRanking = JSON.parse(localStorage.getItem('snakeRanking') || '[]');
    oldRanking.push({ name, score: this.score });
    oldRanking.sort((a, b) => b.score - a.score);
    const top5 = oldRanking.slice(0, 5);
    localStorage.setItem('snakeRanking', JSON.stringify(top5));
    this.scene.start('GameOverScene', { score: this.score });
  }
}
