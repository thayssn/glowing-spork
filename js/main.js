  const canvas = document.getElementById('game-canvas');
  const context = canvas.getContext('2d');
  const W =  canvas.width = window.innerWidth;
  const H =  canvas.height = window.innerHeight;

  const game = {
    config: {
      acceleration : 1,
      max_vel: 50,
      jump_force: 20,
      gravity: 1.5
    }
  };

  const player = {
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
    }else if(player.vel_x > 0){
      player.vel_x += game.config.acceleration/2 * -1;
    }

    if(player.backward && player.vel_x > -game.config.max_vel){
      player.vel_x += game.config.acceleration * -1;
    }else if(player.vel_x < 0){
      player.vel_x += game.config.acceleration / 2;
    }

    if(player.jumping && !player.onAir){
      player.vel_y -= game.config.jump_force;
      player.onAir = true;
    }

    player.x += player.vel_x;
    player.vel_y += game.config.gravity;
    player.y += player.vel_y;

    if(player.y >= 200){
      player.vel_y = 0;
      player.y = 200;
      player.onAir = false;
    }

    engine.clear();
    engine.draw(player);

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
    switch(e.keyCode ){
      case 37:
        player.backward = true;
        break;
      case 38:
        if(!player.onAir){
          player.jumping = true;
        }
        break;
      case 39:
        player.forward = true;
    }
  });
  window.addEventListener('keyup', function(e){
    player.forward = false;
    player.backward = false;
    player.jumping = false;
  });

  requestAnimationFrame(loop);

