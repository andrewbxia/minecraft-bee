// const eid = id => document.getElementById(id);
// const eq = query => document.querySelector(query);
// const eqa = query => document.querySelectorAll(query);
const hostname = window.location.origin;
const randarridx = arr => Math.floor(Math.random() * arr.length);
const randarrchoose = arr => arr[randarridx(arr)];
const shootingbars = eid("shooting-bars");
let shootingbarsheight = 0;
const shootingbarwidths = [
    "200px",
    "150px",
    "100px",
    "250px",
    "350px"
];
const shootingbarheights = [
    "60px",
    "80px",
    "20px",
    "90px",
];
const shootingbarcolors = [
    "--theme-secondary",
    "--theme-pink",
    "--theme-tertiary",
    "--theme-orange",
];
function shootbar(color, width, height){
    const bar = document.createElement("div");
    const duration = Math.random() * 5 + 2;
    const blinkduration = Math.random() * .2 + .1;
    const multiplier = shootingbarsheight / 300;
    bar.style.width = width;
    bar.style.height = (multiplier * (Math.random() * 100 + Math.pow((.75 - Math.random()), 2) * 120))+ "px";
    bar.style.backgroundColor = `var(${color})`;
    bar.classList.add("shooting-bar");
    bar.style.top = `${Math.random() * (multiplier * 300)}px`; // height of shootingbars div
    bar.style.animationDuration = `${duration}s, ${blinkduration}s`;
    if(Math.random() < .05){
        bar.innerText = randarrchoose([
            ":3",
            ":p"
        ]);
    }
    shootingbars.appendChild(bar);
    setTimeout(() => {
        bar.remove();
    }, duration * 1000);
}
function shootbars(){
    const density = 3;
    shootingbarsheight = shootingbars.clientHeight;
    console.log(shootingbarsheight);
    for(const color of shootingbarcolors){
        if(!pageentered) break;
        for(let i = 0; i < density; i++){
            shootbar(color, randarrchoose(shootingbarwidths), randarrchoose(shootingbarheights));
        }
    }
    setTimeout(shootbars, 500);
    

}
// shootbars();
// cd stuff

const cds = [ // implement artist and desc and source laterz
    ['bee-minecraft.jpg', 'palescreen.wav'],
    ["snacko-cover.jpg", "dancefloor journey.mp3"],
    ["snacko-cover.jpg", "game time.mp3"],
    ["snacko-cover.jpg", "glittering seasons.mp3"],
    ["snacko-cover.jpg", "heartbeat of the land.mp3"],
    ["snacko-cover.jpg", "kingdom that echoes millennia.mp3"],
    ["snacko-cover.jpg", "snacko island party.mp3"],
    ["snacko-cover.jpg", "sunlight memories.mp3"],
];
const cdimgpath = hostname + "/assets/imgs/cds/", cdaudiopath = hostname + "/assets/audios/cds/";

const cdplayer = eid("cd-player");
const cdplay = eid("cd-play");
const cdstop = eid("cd-stop");
const cdnext = eid("cd-next");
const cdaudio = new Audio();
let cdanimation = null;
function placecd(){
    if(cdplayer.querySelector(".cd")) throw new Error("cd already placed");
    const cd = document.createElement("div");
    cd.classList.add("cd");
    const cdimg = document.createElement("img");
    const selectedcd = randarrchoose(cds);
    cdimg.src = cdimgpath + selectedcd[0];
    cd.dataset.audio = cdaudiopath + selectedcd[1];
    cd.appendChild(cdimg);
    cdplayer.appendChild(cd);

    cd.style.rotate = Math.random() * 360 + "deg";
    cdanimation = cd.animate([
        {transform: "rotate(0deg)"},
        {transform: "rotate(360deg)"}
        ], {
            duration: 10000,
            iterations: Infinity,
            fill: "forwards",
        }
    );
    cdanimation.pause();
}
placecd();

function playcd(){
    const cd = cdplayer.querySelector(".cd");
    if(cdanimation.playState === "running") return;
    cdanimation.play();
    if(decodeURIComponent(cdaudio.src) != cd.dataset.audio){ cdaudio.src = cd.dataset.audio; console.log(cdaudio.src , cd.dataset.audio)}
    // console.log(cdaudio.currentTime);
    cdaudio.play();
}
function stopcd(){
    const cd = cdplayer.querySelector(".cd");
    if(cdanimation.playState === "paused") return;
    cdanimation.pause();
    new Ani(".cd").rule({
        from: [{rotate: "0deg"}],
        to: [{rotate: "5deg"}],
        duration: 300,
        easing: "ease-out",
        forwards: true,
        additive: [true, true],
    });
    cdaudio.pause();
    // cdaudio.currentTime = 0;
}
function nextcdthisonesucks(){
    stopcd();
    // do the animation here later of it dropping and colliding with the bottom screen or someth
    // and a funny one where it shoots off violently lol
    setTimeout(() => {
        cdplayer.querySelector(".cd").remove();
    }, 300);

    //do animation and pass delay to next function
    /**
     * first do animation to bring it back to rightside up
     * then set transform origin to the middle bottom
     * rotate from there
     * do the funny anis
     */

    setTimeout(() => {
        placecd();
    }, 1000);
    // placecd();
}
