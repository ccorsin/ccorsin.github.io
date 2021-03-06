
class Rocket {
  constructor(speed, angle) {
    this.rocket = document.querySelector("#rocket");
    this.speed = 6 / speed;
    this.angle = angle;
    console.log('angle', angle)
    console.log('speed', speed)
    this.maximum = {x: window.screen.availWidth, y: window.screen.availHeight };
    console.log(this.maximum);
    this.giveAngle();
    this.loadAsterdoid();
  }


  giveAngle() {
    if (this.angle <= 90 && this.angle >= 0)
      this.rocket.style.transform = "rotate(" + (90 - this.angle) + "deg)" ;
    if (this.angle > 90 && this.angle <= 180)
      this.rocket.style.transform = "rotate(" + (360 - (this.angle - 90))  + "deg)" ;
  }

  degreeToRadian(degree) {
    return degree * (Math.PI / 180);
  }

  calculateDirection() {
    if (this.angle >= 0 && this.angle < 45)
      this.launchIt(0, 80 - (0 / Math.tan(this.degreeToRadian(this.angle)) + 20));
    if (this.angle >= 45 && this.angle <= 90)
      this.launchIt(50 - 80 * Math.tan(this.degreeToRadian(90 - this.angle)), 0);
    if (this.angle > 90 && this.angle <= 135)
      this.launchIt(50 + 80 * Math.tan(this.degreeToRadian(this.angle - 90)), 0);
    if (this.angle >= 135 && this.angle <= 180)
      this.launchIt(100, 80 - (0 / Math.tan(this.degreeToRadian(this.angle)) + 20));
  }

  checkCollision() {
    const asteroid = document.querySelector("#asteroid");
    const coordAsteroid = asteroid.getClientRects()[0]
    const coordRocket = this.rocket.getClientRects()[0]
    return ((Math.abs(coordAsteroid.x - coordRocket.x) < 30) && (Math.abs(coordAsteroid.y - coordRocket.y) < 30))
  }

  updateAnimation() {
    let bool = true;
    setInterval(() => {
      if (bool) {
        if(this.checkCollision()) {
          bool = false;
          const asteroid = document.querySelector('#asteroid')
          const animation =  asteroid.animate([
            { transform: 'translateY(0px)' },
            { transform: 'translateY(800px)' }
          ], {
            duration: 6000,
          });
          this.loadExplosion();
          asteroid.addEventListener('animationiteration', () => {
            animation.cancel();
            bool = true
          });
        }
      }
    }, 10);
  }
  loadExplosion() {
    let displayed = false;
    setInterval(() => {
      const asteroid = document.querySelector("#asteroid");
      const explosion = document.querySelector('#boom');
      const coordAsteroid = asteroid.getClientRects()[0]

      if (coordAsteroid.y >= (this.maximum.y - 200) || coordAsteroid.x >= (this.maximum.x - 200))
      {
        explosion.style.cssText = ("display: block;" + `left: ${(this.maximum.x - 400)}px ; top: ${(this.maximum.y - 400)}px;`);
        if (!displayed)
        {
          displayed = true;
          setTimeout(() => alert("La fusée n'a pas reussi à détruire l'asteroide. Allez voir les utilisateurs pour comprendre...") , 1000);
        }
      }
    }, 200)
  }

  loadAsterdoid() {
    var cssAnimation = document.createElement('style');
    cssAnimation.type = 'text/css';
    let rules;
    if (this.angle == 60 && rocketData.speed == 1) {
      rules = document.createTextNode(
        '@keyframes asteroid { 0% { top: 30vh; left: 2vw;} 62% { top: 31vh; left: 69vw;} 100% {top: 0vh; left: 80vw;}}'
      );
    }
    else {
      this.updateAnimation();
      rules = document.createTextNode(
        '@keyframes asteroid { 0% { top: 30vh; left: 2vw;} 100% {top: 60vh; left: 100vw;}}'
      );
    }
    var addAnimationRule = document.createTextNode('#asteroid {animation: 6s linear 1s infinite running asteroid;}')
    cssAnimation.appendChild(rules);
    cssAnimation.appendChild(addAnimationRule);
    document.getElementsByTagName("head")[0].appendChild(cssAnimation); 

  };

  launchIt(finalX, finalY) {
    var cssAnimation = document.createElement('style');
    cssAnimation.type = 'text/css';
    let pourcent;
    let pourcentStop;
    switch (this.speed) {
      case 1: 
        pourcent = 20;
        pourcentStop = 25;
        break;
      case 2:
        pourcent = 40;
        pourcentStop = 45;
        break;
      case 3:
        pourcent = 50;
        pourcentStop = 55;
        break;
      case 6:
        pourcent = 100;
        pourcentStop = 100;
        break;
      default:
        pourcent = 100;
        pourcentStop = 100;
    }
    var rules = document.createTextNode(
      '@keyframes rocket {' +
      '0% { opacity: 0; right: var(--rocket-right); top: var(--rocket-top); } 10% {opacity: 1;}'+
      `${pourcent}% {opacity: 1; right: ${finalX}vw; top: ${finalY}vh;} ${pourcentStop}%, 100% { opacity: ${rocketData.speed == 1 ? 1: 0}; right: ${finalX}vw; top: ${finalY}vh }}`);
    var addAnimationRule = document.createTextNode(`#rocket {animation: 6s linear 1s infinite running rocket;}`)
    cssAnimation.appendChild(rules);
    cssAnimation.appendChild(addAnimationRule);
    document.getElementsByTagName("head")[0].appendChild(cssAnimation);    
  }
};

const rocket = new Rocket(rocketData.speed, rocketData.angle).calculateDirection();
