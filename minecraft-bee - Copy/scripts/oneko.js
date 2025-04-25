// oneko.js: https://github.com/adryd325/oneko.js

(function oneko() {
  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  if (isReducedMotion) return;

  const nekoEl = document.createElement("div");

  let nekoPosX = 32;
  let nekoPosY = 32;

  let mousePosX = 0;
  let mousePosY = 0;

  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;
  let runCursor = false;
  let clock = 30;

  const nekoSpeed = 10;
  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [
      [-5, 0],
      [-6, 0],
      [-7, 0],
    ],
    scratchWallN: [
      [0, 0],
      [0, -1],
    ],
    scratchWallS: [
      [-7, -1],
      [-6, -2],
    ],
    scratchWallE: [
      [-2, -2],
      [-2, -3],
    ],
    scratchWallW: [
      [-4, 0],
      [-4, -1],
    ],
    tired: [[-3, -2]],
    sleeping: [
      [-2, 0],
      [-2, -1],
    ],
    N: [
      [-1, -2],
      [-1, -3],
    ],
    NE: [
      [0, -2],
      [0, -3],
    ],
    E: [
      [-3, 0],
      [-3, -1],
    ],
    SE: [
      [-5, -1],
      [-5, -2],
    ],
    S: [
      [-6, -3],
      [-7, -2],
    ],
    SW: [
      [-5, -3],
      [-6, -1],
    ],
    W: [
      [-4, -2],
      [-4, -3],
    ],
    NW: [
      [-1, 0],
      [-1, -1],
    ],
  };

  function init() {
    nekoEl.id = "oneko";
    nekoEl.ariaHidden = true;
    nekoEl.style.width = "32px";
    nekoEl.style.height = "32px";
    nekoEl.style.position = "absolute";
    nekoEl.style.pointerEvents = "auto";
    nekoEl.style.imageRendering = "pixelated";
    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
    nekoEl.style.zIndex = Number.MAX_VALUE;

    let nekoFile = "./oneko.gif"
    const curScript = document.currentScript
    if (curScript && curScript.dataset.cat) {
      nekoFile = curScript.dataset.cat
    }
    nekoEl.style.backgroundImage = `url(${nekoFile})`;

    document.body.appendChild(nekoEl);

    document.addEventListener("mousemove", function (event) {
      mousePosX = event.clientX + window.scrollX;
      mousePosY = event.clientY + window.scrollY;
    });

    window.requestAnimationFrame(onAnimationFrame);
  }

  let lastFrameTimestamp;

  function onAnimationFrame(timestamp) {
    // Stops execution if the neko element is removed from DOM
    if (!nekoEl.isConnected) {
      return;
    }
    if (!lastFrameTimestamp) {
      lastFrameTimestamp = timestamp;
    }
    if (timestamp - lastFrameTimestamp > clock) {
      lastFrameTimestamp = timestamp
      frame()
    }
    window.requestAnimationFrame(onAnimationFrame);
  }

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;

    // every ~ 20 seconds
    if (
      idleTime > 20 &&
      Math.floor(Math.random() * 5) == 0 &&
      idleAnimation == null
    ) {
      
      let avalibleIdleAnimations = ["runCursor"];//["scratchSelf"];
      if (nekoPosX < 32 + window.scrollX) {
        avalibleIdleAnimations.push("scratchWallW");
      }
      if (nekoPosY < 32 + window.scrollY) {
        avalibleIdleAnimations.push("scratchWallN");
      }
      if (nekoPosX > window.innerWidth + window.scrollX - 32) {
        avalibleIdleAnimations.push("scratchWallE");
      }
      if (nekoPosY > window.innerHeight + window.scrollY - 32) {
        avalibleIdleAnimations.push("scratchWallS");
      }
      if(Math.random() < .17) {
        if(Math.random() < .95) 
          idleAnimation = "sleeping";
        else
          idleAnimation = "runCursor";
      }
      else idleAnimation =
        avalibleIdleAnimations[
        Math.floor(Math.random() * avalibleIdleAnimations.length)
        ];
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) {
          resetIdleAnimation();
        }
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        console.log(idleAnimation)
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) {
          resetIdleAnimation();
        }
        break;
      
        case "runCursor":
          runCursor = true;
          setSprite("idle", 0);
          break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function explodeHearts() {
    if (idleAnimation == "sleeping") {
      resetIdleAnimation();
    } // WAKE UP KITTY CAT
    const parent = nekoEl;
    const rect = nekoEl.getBoundingClientRect();
    // const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    // const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const centerX =  rect.width / 2;// + scrollLeft;
    const centerY = rect.height / 2;// + scrollTop;
    for (let i = 0; i < 10; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.textContent = '❤';
      const offsetX = (Math.random() - 0.5) * 50;
      const offsetY = (Math.random() - 0.5) * 50;
      heart.style.left = `${offsetX-16}px`;
      heart.style.top = `${offsetY}px`;
      heart.style.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      heart.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
      parent.appendChild(heart);

      setTimeout(() => {
        parent.removeChild(heart);
      }, 1000);
    }
  }

  const style = document.createElement('style');
  style.innerHTML = `
		  @keyframes heartBurst {
			  0% { transform: scale(0); opacity: 1; }
			  100% { transform: scale(1); opacity: 0; }
		  }
		  .heart {
			  position: absolute;
			  font-size: 2em;
			  animation: heartBurst 1s ease-out;
			  animation-fill-mode: forwards;
        user-select: none;
        pointer-events: none;
			  /*color: #ab9df2;*/
		  }
	  `;

  document.head.appendChild(style);
  nekoEl.addEventListener('click', explodeHearts);

  let prevspeed = 0;
  let speed = 0;
  let accel = 0;
  let finalaframe = 0;
  let accelthresh = 50;
  let adir = {x: 0, y: 0};

  function frame() {
    frameCount += 1;
    const diffX = nekoPosX - mousePosX;
    const diffY = nekoPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);
    speed = distance / clock;
    accel = speed - prevspeed;
    if(accel > accelthresh) 
      runCursor = false;
    prevspeed = speed;
    // console.log("speed", speed, "accel", accel);

    

    if (distance < nekoSpeed || distance < 48 && !runCursor) {
      idle();
      if(!runCursor){
        return;
      }
    }
    idleAnimation = null;
    idleAnimationFrame = 0;
    

    if (idleTime > 1) {
      setSprite("alert", 0);
      // count down after being alerted before moving
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    let direction;
    let aoffsetx = 0, aoffsety = 0;
    direction = diffY >= distance * 0.5 ? "N" : "";
    direction += diffY  < distance * -0.5 ? "S" : "";
    direction += diffX >=  distance * 0.5 ? "W" : "";
    direction += diffX  < distance * -0.5 ? "E" : "";
    console.log(distance);
    console.log(diffX, diffY);
    setSprite(direction, frameCount);
    if(runCursor) {
      clock = 1;
      console.log("runCursor", runCursor);
      nekoPosX = mousePosX;
      nekoPosY = mousePosY;
    }
    else{
      console.error("Ok")
      clock = 30;
      nekoPosX -= (diffX / distance) * nekoSpeed;
      nekoPosY -= (diffY / distance) * nekoSpeed;
    }

    nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth + window.scrollX - 16);
    nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight + window.scrollY - 16);

    nekoEl.style.left = `${nekoPosX - 16 + aoffsetx}px`;
    nekoEl.style.top = `${nekoPosY - 16 + aoffsety}px`;
    console.log(nekoEl.style.left, nekoEl.style.top);
  }

  init();
})();