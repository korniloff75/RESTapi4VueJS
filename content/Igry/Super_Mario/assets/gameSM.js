'use strict';

var SM= {
 // Main Settings
 field: document.querySelector(".field"),
 modalStart: document.querySelector(".modal-start"),
 modalFinish: document.querySelector(".modal-finish"),
 modalStartBtn: document.querySelector(".modal-start__btn"),
 step: 15,

 keys: {
   right: 39,
   left: 37,
   top: 38,
   bottom: 40,
   enter: 13
 },
 moveInt: [],
 gameOver: 1,

 check: {
  right: function(el) {
	var max= SM.field.clientWidth - parseInt(getComputedStyle(el).width),
	  r= max- parseInt(el.style.left);
	return {
	  cur: r <= 0? 0: r,
	  max: max
	};
  },
/*  left: function(el) {
	return parseInt(el.style.left) > 0? parseInt(el.style.left) : 0;
  },*/
  bottom: function(el) {
	var max= SM.field.clientHeight - parseInt(getComputedStyle(el).height),
	  r= max - parseInt(el.style.top);
	return {
	  cur: r <= 0? 0: r,
	  max: max
	};
  },
 },


 createEnemies: function(n) {
   var fragment = document.createDocumentFragment(),
	 enemies= new Array(n);

   function random(min, max) {
	   return Math.round(min + Math.random() * (max - min));
   }

   function moves(en,x,y) { // Движения врагов
   	// x= 50;
   	x= random(x/4, x);
   	// console.log("x= ", x);
	var d= 20, dx= x/d, dy= (y||0)/d, n=0, napr= 1;
	if(!x) return;
	SM.moveInt.push (setInterval(function() {
		n= !SM.check.right(en).cur? random(d/2, d): n;

			if(dx * n < x && SM.check.right(en).cur && napr) {
				n++;
				en.style.left= parseInt(en.style.left)+ dx +'px';
				// console.log("en.style.left= ", en.style.left);
				enemies[en.i][0]= parseInt(en.style.left);

			} else {
				napr= 0;

				// console.log("n= ", n);
				var left= parseInt(en.style.left);
				if(n > 0 && left > 0) {

				  en.style.left= left - dx +'px';
				  enemies[en.i][0]= parseInt(en.style.left);
				  n--;
				} else {
					napr= 1; // n=0;
				}
				// clearInterval(SM.moveInt)
			}
			SM.checkMove();
		}, 200));
   }

   var enemyWidth= 40, enemyHeight= 40;

   for (var i = 0; i < n; i++) {
	 var newEnemy = document.createElement('img');
	 newEnemy.src = '/' + sv.DIR  + 'assets/enemy.gif';

	 newEnemy.style.width = enemyWidth + 'px';
	 newEnemy.style.height = enemyHeight + 'px';
	 newEnemy.style.position = "absolute";
	 enemies[i]= ([random(10, SM.field.clientWidth - enemyWidth - 10), random(10, SM.field.clientHeight - enemyHeight - 10)]);
	 enemies.map(function(i) { // Фиксим старт от проигрыша
	 	return (i[0]<=SM.marioWidth*2 && i[1] <= SM.marioHeight*1.5)? [i[0], SM.marioHeight*1.5] : i;
	 })
	 newEnemy.style.left = enemies[i][0] + 'px';
	 newEnemy.style.top = enemies[i][1] + 'px';
	 newEnemy.i= i;

	 moves(newEnemy,200,0);
	 newEnemy.className = "enemy";
	 fragment.appendChild(newEnemy);
   }
   SM.field.appendChild(fragment);
   // console.log('enemies= ', enemies);

	  return enemies;
 }, // /createEnemies


 startGame: function() {
   SM.gameOver= 0;
   SM.field.innerHTML= '<div class="mario" style="left:0; top:0;"></div><div class="princess"></div>' ;
   SM.mario = document.querySelector(".mario");
   SM.princess = document.querySelector(".princess");
   SM.marioWidth= parseInt(getComputedStyle(SM.mario).width);
   SM.marioHeight= parseInt(getComputedStyle(SM.mario).height);

   SM.modalStart.style.display = "none";
   SM.mario.style.display = "block";
   SM.princess.style.display = "block";
   SM.enemies= SM.createEnemies(20);

   document.addEventListener('keydown', SM.arrowEvts);

 }, // /startGame


checkMove: function() {
  // Проверка на столкновение
 if (SM.enemies.some(function(i) {
	 // console.log(i[0] , parseInt(mario.style.left), parseInt(mario.style.top));
	 return (Math.abs(i[0] - parseInt(SM.mario.style.left)) < SM.marioWidth) && (Math.abs(i[1] - parseInt(SM.mario.style.top)) < SM.marioHeight)
   })) SM.loseGame();
},

arrowEvts: function(ev) {
  // Перемещения Марио
  // События стрелок
  switch (ev.keyCode) {
	case SM.keys.right :
	  SM.mario.style.left = ((SM.check.right(SM.mario).cur - SM.step > 0)? parseInt(SM.mario.style.left) + SM.step :SM.check.right(SM.mario).max) + 'px';
	  break;

	case SM.keys.left :
	  SM.mario.style.left = ((parseInt(SM.mario.style.left) >= SM.step)? parseInt(SM.mario.style.left) - SM.step : 0) + 'px';
	  break;

	case SM.keys.top :
	  SM.mario.style.top = ((parseInt(SM.mario.style.top) > SM.step)? parseInt(SM.mario.style.top) - SM.step : 0) + 'px';
	   break;

	case SM.keys.bottom :
	  SM.mario.style.top = ((SM.check.bottom(SM.mario).cur - SM.step > 0)? parseInt(SM.mario.style.top) + SM.step : SM.check.bottom(SM.mario).max) + 'px';
	 break;
	 default: return;
  }

 ev.preventDefault();
  SM.checkMove();
  // GAME OVER
   if ( SM.check.right(SM.mario).cur < 50 && SM.check.bottom(SM.mario).cur < 50) SM.winGame();
}, // /arrowEvts


pause: function() {
	SM.moveInt.forEach(function(i) {
 		clearInterval(i);
 	});
},

winGame: function() {
	SM.pause();
	document.removeEventListener('keydown', this.arrowEvts);
	SM.field.innerHTML= '<div class="modal modal-finish" onclick="SM.startGame();"> <h2>Ура! Победа!</1><img src="/' + sv.DIR  + 'assets/SM1.png" width="300" height="370" alt="win"> <button class="modal__btn odal-finish__btn">Ещё раз!</button></div>';
	SM.gameOver= 1;
},

loseGame: function() {
 	SM.pause();
 	clearInterval(SM.moveInt);
  document.removeEventListener('keydown', this.arrowEvts);
  SM.field.innerHTML= '<div class="modal modal-finish" onclick="SM.startGame();"> <h2>Вы проиграли! Хотите сыграть еще раз?</1><img src="/' + sv.DIR  + 'assets/SM1.png" width="300" height="370" alt="win"> <button class="modal__btn odal-finish__btn">Ещё раз!</button></div>';
  SM.gameOver= 1;
 }

}; // /SM


document.addEventListener('keydown', function(ev) {
  // new GAME
  if (SM.gameOver && (ev.keyCode === SM.keys.enter)) SM.startGame();
});

