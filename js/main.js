  const canvas = document.getElementById('game-canvas');
  const context = canvas.getContext('2d');
  const W =  canvas.width = window.innerWidth;
  const H =  canvas.height = window.innerHeight;
  let pressDelay = false;

  const game = {
    config: {
      acceleration : 1,
      max_vel: 50,
      jump_force: 30,
      gravity: 1.2,
      friction: .92
    }
  };

  let player = {
    forward: false,
    backward: false,
    jumping: false,
    onAir: false,
    w: 90,
    h: 120,
    y: 200,
    x: 0,
    off_x: function(){ return this.x + this.w},
    off_y: function(){ return this.y + this.h},
    vel_x: 0,
    vel_y: 0,
    color: '#4AFF64'
  };

  let squared_ball = {
    w: 40,
    h: 40,
    y: 200,
    x: W/2,
    off_x: function(){ return this.x + this.w},
    off_y: function(){ return this.y + this.h},
    vel_x: 0,
    vel_y: 0,
    color: '#ff6ca3'
  };

  const loop = function(){

    if(player.x > W ){
      player.x = -player.w;
    }

    if(player.x < -player.w){
      player.x = W;
    }

    if(player.y > H ){
      player.y = -player.h;
    }

    if(player.y < -player.h){
      player.y = H;
    }

    if(player.forward && player.vel_x < game.config.max_vel){
      player.vel_x += game.config.acceleration;
    }

    if(player.backward && player.vel_x > -game.config.max_vel){
      player.vel_x += game.config.acceleration * -1;
    }


    if(player.jumping && !player.onAir){
      player.vel_y -= game.config.jump_force;
      player.onAir = true;
      player.jumping = false;

    }
    player.x += player.vel_x;

    player.vel_x *= game.config.friction;
    player.vel_y += game.config.gravity;
    player.y += player.vel_y;
    player.vel_y *= game.config.friction;

    if(player.y >= 200){
      player.vel_y = 0;
      player.y = 200;
      player.onAir = false;
    }

    if(player.y <= squared_ball.y && player.off_y() >= squared_ball.off_y() ){
      if((player.off_x() >= squared_ball.x && player.x < squared_ball.x) || (player.x <= squared_ball.off_x() && player.off_x() > squared_ball.off_x()) ){
        squared_ball.vel_x += player.vel_x;
      }
    }

    if(squared_ball.off_x() >= W || squared_ball.x <= 0){
      squared_ball.vel_x *= -1;
    }

    if(squared_ball.off_x() >= player.x && squared_ball.x <= player.off_x() && player.onAir ){
      if(player.off_y() >= squared_ball.y){
        player.y = squared_ball.y - player.h;
      }
    }

    squared_ball.x += squared_ball.vel_x;
    squared_ball.vel_x *= game.config.friction;

    engine.clear();
    engine.draw(player);
    engine.draw(squared_ball);

    requestAnimationFrame(loop);
  };


  const engine = {
    draw : function(rect){
      context.beginPath();
      context.rect(rect.x, rect.y, rect.w, rect.h);
      context.fillStyle = rect.color;
      context.fill();
    },
    clear : function(){
      context.clearRect(0, 0, W, H)
    }
  };

  window.addEventListener('keydown', function(e){
    if(e.keyCode == 37) {
      player.backward = true;
    }

    if(e.keyCode == 38) {
      if (!player.onAir && !pressDelay) {
        player.jumping = true;
        pressDelay = true;
        setTimeout(function(){
          pressDelay = false;
        }, 400)
      }
    }

    if(e.keyCode == 39){
      player.forward = true;
    }

  });

  window.addEventListener('keyup', function(e){
    if(e.keyCode == 37) {
      player.backward = false;
    }

    if(e.keyCode == 38) {
      player.jumping = false;
    }

    if(e.keyCode == 39){
      player.forward = false;
    }

  });

  requestAnimationFrame(loop);

