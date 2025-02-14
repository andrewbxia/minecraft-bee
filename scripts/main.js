// const eid = id => document.getElementById(id);
// const eq = query => document.querySelector(query);
// const eqa = query => document.querySelectorAll(query);

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
    ['bee-minecraft.jpg', 'palescreen.mp3'],
    ["snacko-cover.jpg", "dancefloor journey.mp3"],
    ["snacko-cover.jpg", "game time.mp3"],
    ["snacko-cover.jpg", "glittering seasons.mp3"],
    ["snacko-cover.jpg", "heartbeat of the land.mp3"],
    ["snacko-cover.jpg", "kingdom that echoes millennia.mp3"],
    ["snacko-cover.jpg", "snacko island party.mp3"],
    ["snacko-cover.jpg", "sunlight memories.mp3"],
];
const cdimgpath = "./assets/imgs/cds/", cdaudiopath = "./assets/audios/cds/";

const cdplayer = eid("cd-player");
const cdplay = eid("cd-play");
const cdstop = eid("cd-stop");
const cdnext = eid("cd-next");
const cdaudio = new Audio();
const bonk = new Audio("./assets/audios/bonk.mp3");
bonk.preload = "auto";
const cddim = 338;
let cdanimation = null;
const reverteasing = "cubic-bezier(0.5,0,0.25,1.5)";
function placecd(){
    if(cdplayer.querySelector(".cd")) throw new Error("cd already placed");
    const cd = document.createElement("div");
    cd.classList.add("cd");
    const cdimg = document.createElement("img");
    const selectedcd = randarrchoose(cds);
    cdimg.src = cdimgpath + selectedcd[0];
    cd.dataset.audio = cdaudiopath + selectedcd[1];
    cd.dataset.audioname = selectedcd[1];
    cd.appendChild(cdimg);
    cdplayer.appendChild(cd);

    const rotation = Math.random() * 360 + "deg";
    cd.style.rotate = rotation;
    cd.dataset.rotation = rotation;
    cd.animate([
        {left: -cddim + "px", rotate: 0 + "deg", width: "0px"},
        {left: "0px", rotate: rotation, width: cddim + "px"},
    ], {
        duration: 800,
        easing: "ease-in-out",
        // fill: "forwards"
    });
}
placecd();

cdaudio.addEventListener("ended", stopcd);

function playcd(){
    const cd = cdplayer.querySelector(".cd");
    if(!cdaudio.paused) return;
    new Ani(".cd").rule({
        from: [{rotate: "0deg"}],  
        to: [{rotate: "360deg"}],
        duration: 10000,
        easing: "linear",
        forwards: true,
        additive: [true, true],
        iterations: Infinity,
    });

    console.log(decodeURIComponent(cdaudio.src),cd.dataset.audioname)
    if(decodeURIComponent(cdaudio.src).indexOf(cd.dataset.audioname) === -1) cdaudio.src = cd.dataset.audio;
    // console.log(cdaudio.currentTime);
    cdaudio.play();
}
function stopcd(full = false, out = false){
    const cd = cdplayer.querySelector(".cd");
    if(!full && cdaudio.paused) return 0;

    // hacky
    const from2 = [{rotate: "0deg"}]; if(out) from2[0].right = 0 + "px";
    const to2 = [{rotate: full ? "0deg" : eq(".cd").dataset.rotation}]; 
    if(out) to2[0].right = -cddim + "px";


    const delay = new Ani(".cd").rule({
        from: [{rotate: "0deg"}],
        to: [{rotate: "5deg"}],
        duration: 300,
        easing: "ease-out",
        forwards: true,
        additive: [true, true],
    }).rule({
        from: from2,
        to: to2,
        duration: 600,
        easing: reverteasing,
        forwards: true,
        additive: [true, false],
    }).whendone();
    cdaudio.pause();
    // cdaudio.currentTime = 0;
    
    return delay;
}
function nextcdthisonesucks(event){
    const button = event.currentTarget;
    button.disabled = true;
    const delay = stopcd(true, true);
    const cd = eq(".cd");
    // do the animation here later of it dropping and colliding with the bottom screen or someth
    // and a funny one where it shoots off violently lol

    const hoffset = cdplayer.getBoundingClientRect().bottom;
    console.log(hoffset);

    // use #cd-player as the reference point, since .cd element spins
    // new Ani(".cd").delay(delay + 100)
    // .rule({
    //     from: [{rotate: "0deg"}],  
    //     to: [{rotate: "360deg"}],
    //     duration: 10000,
    //     easing: "linear",
    //     forwards: true,
    //     additive: [true, true],
    //     iterations: Infinity,
    //     intrusive: true,
    // });
    // new Ani(".cd").delay(delay + 100).then(() => {
    //     cd.style.transformOrigin = "50% 100%";
    // }).rule({
    //     from: [{rotate: "0deg"}],
    //     to: [{rotate: "90deg"}],
    //     duration: 1000,
    //     easing: "ease-in",
    //     forwards: true,
    //     additive: [true, true],
    // }).then(() => {
    //     const rect = cdplayer.getBoundingClientRect();
    //     console.log(rect.left, rect.top)
    //     cd.style.position = "fixed";
    //     document.body.before(cd);
    //     cd.style.top = `${rect.top}px`;
    //     cd.style.left = `${rect.right - cddim / 2}px`;
    //     console.log(cd.getBoundingClientRect().left);
    // })
    // .rule({
    //     from: [{top: "0px"}],
    //     to: [{top: `calc(100vh - ${cddim * 1.5}px)`}],
    //     duration: Math.sqrt(2 * (window.innerHeight - cddim * 1.5) / 9.8) * 100,
    //     easing: "ease-in",
    //     forwards: true,
    //     additive: [true, false],
    // }).rule({
    //     from: [{top: "0px"}],
    //     to: [{top: `-20px`}],
    //     duration: 100,
    //     easing: "ease-out",
    //     forwards: true,
    //     additive: [true, true],
    // })
    // .rule({
    //     from: [{top: "0px"}],
    //     to: [{top: `100vh`}],
    //     duration: 1000,
    //     easing: "ease-in",
    //     forwards: true,
    //     additive: [true, false],
    // })
    
    
    // .then(() => {
    //     console.log(cd.getBoundingClientRect().left);
    //     cd.remove();
    //     placecd();
    // });
    const bodywidth = document.body.getBoundingClientRect().width;

    new Ani(".cd").delay(delay + 100)
    .rule({
        from: [{rotate: "0deg"}],
        to: [{rotate: "-30deg"}],
        duration: 500,
        easing: "ease-in",
        forwards: true,
        additive: [true, true],
    })
    .then(() => {
        const rect = cdplayer.getBoundingClientRect();
        console.log(rect.right + cddim)
        cd.style.position = "fixed";
        document.body.before(cd);
        cd.style.top = `${rect.top}px`;
        cd.style.left = `${rect.right}px`;
        console.log(document.body.getBoundingClientRect().width - (rect.right),cd.getBoundingClientRect().right);
    })
    .rule({
        from: [{rotate: "0deg", left: "0px", top: "0px"}],
        to: [{rotate: "360deg", left: (bodywidth - cddim+50) + "px", top: "-50px"}],
        duration: 400,
        easing: "cubic-bezier(0.8,0,0.94,0.14)",
        forwards: true,
        additive: [true, false],
    })
    .then(() => {
        bonk.play();
        cd.style.zIndex = 1000;
    })
    
    .rule({
        from: [{left: "0px", top: "0px", rotate: "0deg"}],
        to: [{left: `${cddim}px`, top: `${window.innerHeight * (Math.random() * 2 + 1)}px`, rotate: "9000deg"}],
        duration: 200,
        easing: "ease-out",
        forwards: true,
        additive: [true, false],
    }).then(() => {
        cd.remove();
        placecd();
        button.disabled = false;
    });


    // setTimeout(() => {
    //     cdplayer.querySelector(".cd").remove();
    // }, 300);
    // chill music
    // high calibre

    //do animation and pass delay to next function
    /**
     * first do animation to bring it back to rightside up
     * then set transform origin to the middle bottom
     * rotate from there
     * do the funny anis
     */

    

    // setTimeout(() => {
    //     placecd();
    // }, 1000);
    // placecd();
}
