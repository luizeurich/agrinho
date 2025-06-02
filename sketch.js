let trator;
let obstaculos = [];
let distancia = 0;
let gameOver = false;
let venceu = false;
let botao;
let plantacoes = [];
let mensagem = '';

function setup() {
  createCanvas(600, 400);
  textSize(40);
  trator = new Trator();

  botao = createButton('Jogar Novamente');
  botao.position(width / 2 - 75, height / 2 + 50);
  botao.style('background-color', 'black');
  botao.style('color', 'white');
  botao.style('padding', '10px 20px');
  botao.style('font-size', '16px');
  botao.hide();
  botao.mousePressed(reiniciarJogo);

  for (let i = 0; i < 50; i++) {
    let lado = random(['esquerda', 'direita']);
    let x = lado === 'esquerda' ? random(0, 180) : random(420, width);
    let y = random(0, height);
    let tipo = random(['🌾', '🌱']);
    let offset = random(TWO_PI);
    plantacoes.push({x: x, y: y, tipo: tipo, offset: offset});
  }
}

function draw() {
  background(50, 205, 50);

  for (let p of plantacoes) {
    let yMov = sin(frameCount * 0.05 + p.offset) * 2;
    textSize(20);
    text(p.tipo, p.x, p.y + yMov);
  }

  fill(139, 69, 19);
  rect(200, 0, 200, height);

  if (!gameOver && !venceu) {
    trator.show();
    trator.move();

    if (frameCount % 60 == 0) {
      obstaculos.push(new Obstaculo());
    }

    for (let i = obstaculos.length - 1; i >= 0; i--) {
      obstaculos[i].update();
      obstaculos[i].show();

      if (obstaculos[i].hits(trator)) {
        if (obstaculos[i].tipo === '🕳️') {
          mensagem = "Você caiu no buraco!";
        } else {
          mensagem = "Você bateu!";
        }
        gameOver = true;
        botao.show();
      }

      if (obstaculos[i].y > height) {
        obstaculos.splice(i, 1);
        distancia++;
      }
    }

    fill(0);
    textSize(20);
    text("Distância: " + distancia + " m", 10, 30);

    if (distancia >= 60) {
      venceu = true;
      botao.show();
    }

  } else if (gameOver) {
    textSize(40);
    textAlign(CENTER);
    fill(0);
    text(mensagem, width / 2, height / 2);
  } else if (venceu) {
    textSize(40);
    textAlign(CENTER);
    fill(0);
    text("Você chegou à cidade!", width / 2, height / 2);
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    trator.setDir(-1);
  } else if (keyCode === RIGHT_ARROW) {
    trator.setDir(1);
  }
}

function keyReleased() {
  trator.setDir(0);
}

class Trator {
  constructor() {
    this.x = width / 2;
    this.y = height - 60;
    this.size = 40;
    this.dir = 0;
    this.speed = 5;
  }

  show() {
    textSize(50);
    text('🚜', this.x, this.y);
  }

  move() {
    this.x += this.dir * this.speed;
    this.x = constrain(this.x, 200, 360);
  }

  setDir(dir) {
    this.dir = dir;
  }
}

class Obstaculo {
  constructor() {
    this.x = random(200, 360);
    this.y = -40;
    this.size = 40;
    this.speed = 4;
    this.tipo = random(['🪨', '🕳️', '🌲']);
  }

  update() {
    this.y += this.speed;
  }

  show() {
    textSize(40);
    text(this.tipo, this.x, this.y);
  }

  hits(trator) {
    return (this.x < trator.x + trator.size &&
            this.x + this.size > trator.x &&
            this.y < trator.y + trator.size &&
            this.y + this.size > trator.y);
  }
}

function reiniciarJogo() {
  obstaculos = [];
  distancia = 0;
  gameOver = false;
  venceu = false;
  mensagem = '';
  trator = new Trator();
  botao.hide();
}


