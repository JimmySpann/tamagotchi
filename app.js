/**
 * 
 * @param  {String}  type             Decide element type
 * @param  {Object}  [type]           Use one object to pass values rather than multi strings
 * @param  {String}  id               Add id to element
 * @param  {String}  className        Add classes to element 
 * @param  {String}  textContent      Adds text content to element
 * @param  {Element} parent           Decide parent node
 * @param  {Element} [parent=default] Default is body
 * @return {Element} Returns the created element
 */
function createElement(type,id,className,textContent,parent) {
    let newElement = document.createElement(type);
    newElement.id = id;
    newElement.className = className;
    newElement.textContent = textContent;
    (parent) ? parent.appendChild(newElement) : document.body.appendChild(newElement);
    return newElement;
  }
function findElement(query, isMulti = false) {
    return (!isMulti) ?
            document.querySelector(query) :
            document.querySelectorAll(query);
}

class HtmlElements {

  startedWalking = false;

  ui = {
    stats: {
      time   : findElement('.time-stats'),
      hunger : {
        bar  : findElement('.hunger .stats-green'),
        text : findElement('.hunger .stats-text' ),
       },
      sleepiness : {
        bar  : findElement('.sleepiness .stats-green'),
        text : findElement('.sleepiness .stats-text' ),
       },
      boredom : {
        bar  : findElement('.boredom .stats-green'),
        text : findElement('.boredom .stats-text' ),
       }
    },

    buttons : {
      feed:            findElement('.feed'              ),
      lightsOut:       findElement('.lights-out'        ),
      play:            findElement('.play'              ),
      changeNameStart: findElement('.change-name-start' ),
      changeName:      findElement('.change-name button'),
      toggleSpeed:     findElement('.speed'             ),
      increaseAge:     findElement('.inc-age'           ),
    },

    //Misc UI
    name            : findElement('.name'              ),
    briefing        : findElement('.speech-bubble span'),
    changeNameGroup : findElement('.change-name'       ),
    changeNameInput : findElement('.change-name input' ),
  }


  character = {
    full     : findElement('.character'      ),
    head     : findElement('.char-body'      ),
    face     : findElement('.char-body img'  ),
    lowerBody: findElement('.legs'           ),
    legs     : findElement('.legs line', true),
    leftArm  : findElement('.left-arm'       ),
    rightArm : findElement('.right-arm'      ),
    arms     : [
                 findElement('.left-arm line' ),
                 findElement('.right-arm line')
               ]
  }

  start() {
    this.ui.buttons.feed            .addEventListener('click', handleFeedClick           );
    this.ui.buttons.lightsOut       .addEventListener('click', handleLightsOutClick      );
    this.ui.buttons.play            .addEventListener('click', handlePlayClick           );
    this.ui.buttons.changeNameStart .addEventListener('click', handleChangeNameStartClick);
    this.ui.buttons.changeName      .addEventListener('click', handleChangeNameClick     );
    this.ui.buttons.toggleSpeed     .addEventListener('click', handleToggleSpeedClick    );
    this.ui.buttons.increaseAge     .addEventListener('click', handleIncreaseAgeClick    );
    this.update();
  }

  //Maybe create a timer to control this
  update() {
    let stats = this.ui.stats;
console.log(tomagatchi)
    stats.time.innerHTML      = `Time:       ${time}s<br>` +
                                `Age:        ${tomagatchi.age}<br>`;
    stats.name            = tomagatchi.name;
    stats.hunger.bar.style.width      = (tomagatchi.hunger*10)+"%";
    stats.hunger.text.textContent     = tomagatchi.hunger;
    stats.sleepiness.bar.style.width  = (tomagatchi.sleepiness*10)+"%";
    stats.sleepiness.text.textContent = tomagatchi.sleepiness;
    stats.boredom.bar.style.width     = (tomagatchi.boredom*10)+"%";
    stats.boredom.text.textContent    = tomagatchi.boredom;
    this.updateFace();
    this.morph();
  }
  
  updateFace() {
    
    //Discover the LowestStats
    let lowestStat = tomagatchi.hunger;
    if(lowestStat > tomagatchi.sleepiness) lowestStat = tomagatchi.sleepiness
    if(lowestStat > tomagatchi.boredom) lowestStat = tomagatchi.boredom

    //Choose Face Based On LowestStat
    if     (lowestStat >= 8) this.character.face.src = "./faces/char-joy.png";
    else if(lowestStat >= 6) this.character.face.src = "./faces/char-smile.png"; 
    else if(lowestStat >= 3) this.character.face.src = "./faces/char-indifferent.png";
    else if(lowestStat >  0) this.character.face.src = "./faces/char-sad.png"; 
    else if(lowestStat <= 0) this.character.face.src = "./faces/char-dead.png"; 

    //Choose Message Based On LowestStat
    if(gameStatus === 'normal') {
      if      (lowestStat >= 8) { this.ui.briefing.textContent = `${tomagatchi.name}: "Thank you for taking care of me!"`}
      else if (lowestStat >= 6) { this.ui.briefing.textContent = `${tomagatchi.name}: "You're great!"`                   }
      else if (lowestStat >= 3) { this.ui.briefing.textContent = `${tomagatchi.name}: "I don't feel too good..."`        }
      else if (lowestStat >  0) { this.ui.briefing.textContent = `${tomagatchi.name}: "Please save me!"`                 }
      else    {          
                this.ui.briefing.textContent = `${tomagatchi.name} has died...`;
                gameStatus = 'dead';
                this.character.full.style = '';
                this.character.full.classList.add('dead');
                clearInterval(timerWalk); clearInterval(timer); 
              }

    }
  }
  morph() {
    if(tomagatchi.age <= 0) {
      this.character.head.classList.add('egg');
      this.character.leftArm.classList.add('no-arm');
      this.character.rightArm.classList.add('no-arm');
      findElement('.legs').classList.add('no-legs');
      this.character.face.style.opacity = 0;
    } else if(tomagatchi.age === 1) {
      this.character.head.classList.remove('egg');
      this.character.head.classList.add('small');
      this.character.face.style.opacity = 1;
    } else if(tomagatchi.age === 2) {
      this.character.head.classList.remove('small');
    }
    else if (tomagatchi.age === 3) {
      findElement('.right-arm').classList.remove('no-arm');
      findElement('.left-arm').classList.remove('no-arm');
    }
    else if (tomagatchi.age === 4) {
      findElement('.legs').classList.remove('no-legs');
    }
    else if (tomagatchi.age === 5) {
      if(!this.startedWalking){
        timerWalk = setInterval(walk, 10);
        // let walkAnim = setInterval(timeTick, 10);
        walk()
        this.startedWalking = true
        console.log(this.character.arms)
        moveLegs(this.character.legs, this.character.arms)
      }
    }
  }
}

// #region Animation
function munipLine(element, x1, y1, x2, y2) {
    if(x1) element.setAttribute('x1',x1);
    if(y1) element.setAttribute('y1',y1);
    if(x2) element.setAttribute('x2',x2);
    if(y2) element.setAttribute('y2',y2);
}

// Declare variables
let character = findElement(".character"      ),
    legs      = findElement(".legs line", true),
    arms      = findElement("line", true      ),
    timerWalk,  pos = 250,  goRight = true;

function walk() {
  if (goRight) {
    if (pos === 550) {
      goRight = false;
      character.style.transform = "scaleX(-1)"
    }
    pos++;
  } else {
    if (pos === 0) {
      goRight = true;
      character.style.transform = "scaleX(1)"
    }
    pos--;
  }
  character.style.left = pos+"px";
}
let body = findElement(".char-body");

function moveLegs(legs){
    let walkAnim = setInterval(timeTick, 10);
    let rightPos = 120, leftPos = 0, goRight = false;
    function timeTick() {
        if (goRight) {
            if (rightPos === 120) {
              goRight = false;
            }
            rightPos += 1;
            leftPos -= 1;
          } else {
            if (rightPos === 0) {
              goRight = true;
            }
            rightPos -= 1;
            leftPos += 1;
          }
          munipLine(legs[0],null,null,leftPos);
          munipLine(legs[1],null,null,rightPos);
          munipLine(arms[0],null,null,(leftPos/2)+70);
          munipLine(arms[1],null,null,(rightPos+300)/2);
          if(gameStatus === 'dead') clearInterval(walkAnim)
    }
}
//#endregion Animation


class Tomagatchi {
  name = "Tomagatchi"
  hunger = 10;
  sleepiness = 10;
  boredom = 10;
  age = 0;
  feed(value) {
    this.hunger += value
    if(this.hunger > 10) this.hunger = 10;
  }
  lightsOut(value) {
    this.sleepiness += value
    if(this.sleepiness > 10) this.sleepiness = 10;
  }
  play(value) {
    this.boredom += value
    if(this.boredom > 10) this.boredom = 10;

  }
}

//#region button interactions
function handleFeedClick() {
  tomagatchi.feed(3);
  html.update();
}
function handleLightsOutClick() {
  tomagatchi.lightsOut(3);
  html.update();
}
function handlePlayClick() {
  tomagatchi.play(3);
  html.update();
}
function handleChangeNameStartClick() {
  if(html.ui.changeNameGroup.style.display === "block") html.ui.changeNameGroup.style.display = "none";
  else {
    html.ui.changeNameGroup.style.display = "block"; 
    html.ui.changeNameInput.focus();
  }
}
function handleChangeNameClick() {
  tomagatchi.name = html.ui.changeNameInput.value;
  html.ui.changeNameInput.value = ""; 
  html.ui.changeNameGroup.style.display = "none";
  html.update();
}
function handleToggleSpeedClick() {
  console.log('yeet')
  if(timerSpeed === 1000) timerSpeed = 100;
  else timerSpeed = 1000;
  clearInterval(timer);
  timer = setInterval(increaseTime, timerSpeed);
}
function handleIncreaseAgeClick() {
  tomagatchi.age++;
  html.update();
}
//#endregion

function increaseTime() {
  time++;
  if(time % 60 === 0) tomagatchi.age++;
  if(time % 10 === 0) {
    tomagatchi.hunger--;
    tomagatchi.sleepiness--;
    tomagatchi.boredom--;
  }
  html.update();
}


const html = new HtmlElements;
const tomagatchi = new Tomagatchi;
let time = 0, timerSpeed = 1000, gameStatus = 'normal';
let timer = setInterval(increaseTime, timerSpeed);
html.start();

