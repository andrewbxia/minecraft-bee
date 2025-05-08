// prob the worst code ive ever written, dont reuse for your own projects lmao
// prob the worst code ive ever written, dont reuse for your own projects lmao
// prob the worst code ive ever written, dont reuse for your own projects lmao
// prob the worst code ive ever written, dont reuse for your own projects lmao
// prob the worst code ive ever written, dont reuse for your own projects lmao
// prob the worst code ive ever written, dont reuse for your own projects lmao
// prob the worst code ive ever written, dont reuse for your own projects lmao
// prob the worst code ive ever written, dont reuse for your own projects lmao

const cds = { // implement artist and desc and source laterz
    chill:[
        ['palescreen_jacket.jpg', 'palescreen.mp3'],
        ["snacko-cover.jpg", "dancefloor journey.mp3"],
        ["snacko-cover.jpg", "game time.mp3"],
        ["snacko-cover.jpg", "glittering seasons.mp3"],
        ["snacko-cover.jpg", "heartbeat of the land.mp3"],
        ["snacko-cover.jpg", "kingdom that echoes millennia.mp3"],
        ["snacko-cover.jpg", "snacko island party.mp3"],
        ["snacko-cover.jpg", "sunlight memories.mp3"],
        ["nhato-dawnsaga.jpg", "4.24 Dawn Saga (Extended Mix).mp3"],
        ["tf40k.jpg", "путь льда(put' l'da).mp3"],
    ],
    hicalibre:[
        // ["snacko-cover.jpg", "lCwVr2s-pF0"],
        ["tf40k.jpg", "Backbeat Maniac.mp3"],
        ["planet_shaper_jacket.jpg", "bass bomb.mp3"],
    ]
    
};

const cdcategories = Object.keys(cds);
let cdcategory = 0;


/*
needs this html somewhere
<div id="cd-player">
        <div id="cd-cover"></div>
        <div id="cd-controls">
            <p id="cd-status" style="margin: 0; color: var(--theme-light)">d(-w-)b</p>
            <input type="range" id="cd-progress" value="0" min="0" max="100" step="1" 
            oninput="cdprogress(event)">
            <input type="range" id="cd-volume" value="100" min="0" max="100" step="1" 
            oninput="cdvolume(event)"
            >
            <input type="checkbox" id="cd-autoplay" name="autoplay" 
            oninput="cdautoplay(event)">
            <button id="cd-play" onclick="playcd(event)">
                <p>▶</p>
            </button>
            <button id="cd-reset" onclick="resetcd(event)">
                <p>■</p>
            </button>
            <button id="cd-next" onclick="nextcdthisonesucks(event)">
                <!-- wow u really hate this one!!! or just wanna see the animations -->
                <p>nxt</p>
            </button>
        </div>
    </div>

*/
const dir = 0; // 0 = left, 1 = right
const dirstr = dir ? "left" : "right";
const dirstrop = dir ? "right" : "left";
const cdheight = 338;

styling(`#cd-player{
    user-select: none;
    width: calc(${cdheight}px / 2);
    aspect-ratio: 1/2;
    position: fixed;
    ${dirstr}: 0;
    bottom: 0;
    &.editing{
        display: none;
    }
    >#cd-controls{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: first baseline;
        padding: 0;
    color: var(--theme-light);
        >button{
            width: 50px;
            height: 50px;
            background-color: var(--theme-light);
            color: var(--theme-dark);
            border: none;
            border-top-right-radius: 50%;
            border-bottom-right-radius: 50%;
            margin: 5px;
            margin-left: 0;
            margin-bottom: 0;
            font-size: 1em;
            cursor: pointer;
            transition: background-color 0.5s;
            >p{
                margin: 0;
            }
            &:not(:disabled):hover{
                background-color: var(--theme-tertiary);
            }
        }
    }
}
#cd-status{
    text-align: center;
    width: 100%;
}
#cd-volume{
    position: absolute;
    right: 0;
    bottom: 0;
    rotate: -90deg;
    transform-origin: 40% -300%;
}

#cd-vol-bar{
    position: absolute;
    width: 100%;
    height: 3px;
    background-color: var(--theme-light-other);
    bottom: 0;
    left: 0;
    opacity: 0.5;
    transition: bottom 0.05s ease-out;
}
#cd-cover{
    width: ${cdheight/2}px;
    height: ${cdheight}px;
    /* position: relative; */
}
.cd{
    z-index: -1;
    width: ${cdheight}px;
    height: ${cdheight}px;
    position: absolute;
    top: 0;
    transition: rotate 0.25s ease-out;
    transform-origin: ${cdheight/2}px ${cdheight/2}px;
    /* left: 0; */
    ${dirstrop}: -100%;
    >img{
        width: 100%;
        height: 100%;
        clip-path: url("./assets/imgs/cd-main.svg#cd-clip");
        rotate: 0deg;
        position: relative;
    }
    /* &.playing{
        animation: cd-spin 5s linear infinite forwards;
    } */
    
}
.cd::before{
    content: "";
    display: block;
    width: ${cdheight}px;
    height: ${cdheight}px;
    background-image: url("./assets/imgs/cd-overlay.svg");
    position: absolute;
    top: 0;
    left: 0;
    /* z-index: 1; */
}

#cd-offset{
    height: ${cdheight}px;
    filter: none;
    background-color: transparent !important;
    backdrop-filter: none !important;
}

@keyframes cd-spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }    
}`);

// utub api
// ALSO FOR CHILL HAVE RANDOM YT NHATO MUSIC

const cdimgpath = "./assets/imgs/cds/", cdaudiopath = "./assets/audios/cds/";

const cdplayer = eid("cd-player");
const cdplay = eid("cd-play");
const cdstop = eid("cd-stop");
const cdnext = eid("cd-next");
const cdaudio = new Audio();
const bonk = new Audio("./assets/audios/bonk.mp3");
let autoplay = false;
cdaudio.preload = "auto";
bonk.preload = "auto";
const cddim = cdheight;
let cdanimation = null;
const reverteasing = "cubic-bezier(0.5,0,0.25,1.5)";
let cdok = false, cdpaused = true;
let cdtitleframe = 0;
const cdframes = [
    "d(-w-)b",
    "d(-wo)b",
    "d(owo)b",
    "d(ow-)b",
    "d(owo)b",
    "d(owo)b",
    "dc(owo)ↄb",
    "d^∩(owo)ↄ",
    "d^bc(owo)",
];

const cdtitleinterval = setInterval(() => {
    if(!cdaudio.paused) cdtitleframe = max(0, cdtitleframe - 1);
    else cdtitleframe = min(cdframes.length - 1, cdtitleframe + 1);
    if(cdtitleframe === 0 && eid("cd-status").innerText[0] !== '♪'){
        eid("cd-status").innerText = "♪" + cdframes[cdtitleframe] + "♪";
    }
    else eid("cd-status").innerText = cdframes[cdtitleframe];
}, 300);



const cdaudiocontext = new AudioContext();
const analyser = cdaudiocontext.createAnalyser();
analyser.fftSize = Math.pow(2, 6);
let audioarray = new Uint8Array(analyser.frequencyBinCount);
const source = cdaudiocontext.createMediaElementSource(cdaudio);
source.connect(analyser);
source.connect(cdaudiocontext.destination);

let baseweight = 10;
function getcdvolume() { //TODO: make this an actual visualizer, maybe make this a separate class
    if (!cdok) return 0;
    if (cdaudio.paused) return 0;
    analyser.getByteTimeDomainData(audioarray);
    let sum = 0;
    for (let i = 0; i < audioarray.length; i++) {
        const value = audioarray[i] / 128 - 1;
        let add =  value * value;
        if(audioarray[i] < 128) add = Math.log(1 + baseweight * add);
        sum += add;
    }
    const volume = sqrt(sum / audioarray.length);
    // return maxvol / 128 - 1;
    return volume;
}

const avgvols = new RollingAvg(15), avgvolsvp = new RollingAvg(5), avgvolsvn = new RollingAvg(5);
let prevvol = 0, volv = 0;
const coverbars = 100;
const cdcanvas = eid("cd-cover");
const ctx = cdcanvas.getContext("2d", {willReadFrequently: true, 
    desynchronize: true});
// cdcanvas.width = cdheight / 2;
// cdcanvas.height = cdheight;
function shiftcdcoverbars(){
    let percentage = pow(avgvols.get(), 2);
    let percentagevp = pow(avgvolsvp.get(), 2);
    // let percentagevn = pow(avgvolsvn.get(), 3);
    let percentagevn = avgvolsvn.get();
    const width = cdcanvas.width;
    const height = cdcanvas.height;
    const midheight = height / 2;
    const barwidth = 3;
    const barheight = height * percentage;
    const barheightvp = height * percentagevp;
    const left = width - barwidth;
    const barheightvn = height * percentagevn;
    eid("cd-vol-bar").style.bottom = `${barheight*cdheight/(width/2)}px`;
    // log(width, height)

    const imagedata = ctx.getImageData(barwidth, 0, left, height);
    ctx.putImageData(imagedata, 0, 0);
    ctx.clearRect(left, 0, barwidth, height);

    ctx.fillStyle = docproperty('--theme-dark');
    ctx.fillRect(left, 0, barwidth, height - barheight);

    ctx.fillStyle = docproperty('--theme-dark-other');
    // ctx.fillRect(width - barwidth, 0, barwidth, barheightvn);
    ctx.fillRect(left, midheight - barheightvn, barwidth, barheightvn);
    ctx.fillRect(left, height - barheightvp, barwidth, barheightvp);

    ctx.fillStyle = docproperty('--theme-light');
    ctx.fillRect(left, height - barheight, barwidth, barheight - barheightvp);


    
}



function visualizer(){
    let volume = 0;
    if(!cdaudio.paused)
        volume = getcdvolume() / max(0.05, cdaudio.volume);
    avgvols.add(volume);
    volv = volume - prevvol;
    if(volv >= 0) avgvolsvp.add(volv);
    avgvolsvn.add(volv);

    prevvol = volume;
    // eid("cd-cover").style.filter = `brightness(${1 + (abs(avgvols.get()) * 100) * (avgvols.get() < 0 ? -1 : 1)})`; 
    shiftcdcoverbars();
    
    
    
    //lol
    if(autoplay){
        // eqa("p,h1,h2,h3").forEach(p => {p.style.marginLeft = `${avgvols.add(volume) * 100}px`});
        // eid("main-h").style.paddingTop = `${avgvols.get() * 100}px`;
        // eid("cd-player").style.right = `${avgvols.add(volume) * 100}px`;
    }
    requestAnimationFrame(visualizer);
}
visualizer();

function placecd(e){
    if(eq(".cd")) throw new Error("cd already placed");

    const cd = mk("div");
    cd.classList.add("cd");

    const cdimg = mk("img");
    const selectedcd = randarrchoose(cds[cdcategories[cdcategory]]);

    cdimg.src = cdimgpath + selectedcd[0];
    cd.dataset.audio = cdaudiopath + selectedcd[1];
    cd.dataset.audioname = selectedcd[1];
    cdaudio.src = cd.dataset.audio;
    
    app(cdplayer, app(cd, cdimg));
    const rotation = (rand(3) * 360 * (rand(1)<.5 ? 1 : -1)) + "deg";
    cd.style.rotate = rotation;
    cd.dataset.rotation = rotation;
    cdpaused = true;

    if(autoplay) playcd(e);
    cd.animate([
        {[dirstrop]: cddim * (dir ? 1: -1) + "px", rotate: 0 + "deg", width: "1000px"},
        {[dirstrop]: "-100%", rotate: rotation, width: cddim + "px"},
    ], {
        duration: 800,
        easing: docproperty("--ease-backtrack"),
    }).onfinish = (e) => {
        cdok = true;
    };
}
placecd();

cdaudio.onended = () => {
    if(autoplay)
        nextcdthisonesucks();
    else stopcd();
};

const cdplaytext = "▶", cdstoptext = "❚❚";

function playcd(e){// have to pass event so browser know its user interaction guhhhhh
    if(cdaudiocontext.state === "suspended") cdaudiocontext.resume();
    const cd = cdplayer.querySelector(".cd");
    
    if(!cdaudio.paused) return;
    if(decodeURIComponent(cdaudio.src).indexOf(cd.dataset.audioname) === -1)
        cdaudio.src = cd.dataset.audio;
    cdaudio.play();
    
    cdpaused = false;
    new Ani(".cd").rule({
        from: [{rotate: "0deg"}],  
        to: [{rotate: "360deg"}],
        duration: 10000,
        easing: "linear",
        forwards: false,
        additive: [true, true],
        iterations: Infinity,
    });

    eid("cd-play").setAttribute("onclick", "stopcd()");
    eid("cd-play").innerText = cdstoptext;
    cdok = true;
}
function stopcd(full = false, out = false){

    if(!full && cdaudio.paused && !cdaudio.ended) return 0;
    cdaudio.pause();
    
    // hacky
    const from2 = [{rotate: "0deg"}]; 
    const to2 = [{rotate: full ? "0deg" : eq(".cd").dataset.rotation}]; 
    if(out) from2[0][dirstrop] = 0 + "px";
    if(out) to2[0][dirstrop] = -cddim + "px";

    // cdok = false;

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
    eid("cd-play").setAttribute("onclick", "playcd(event)");
    eid("cd-play").innerText = cdplaytext;
    // cdaudio.currentTime = 0;
    return delay;
}

function resetcd(){
    stopcd(false, false);
    cdaudio.currentTime = 0;
}
const progressinterval = setInterval(() => {   
    let progress = 0;
    
    if(cdaudio.duration > 0){
        progress = cdaudio.currentTime / cdaudio.duration;
    }
    progress *= 100;
    if(isNaN(progress)) progress = 0;
    eid("cd-progress").value = progress;
}, 500);

function cdprogress(event){
    const newprogress = event.currentTarget.value;
    let newtime = cdaudio.duration * newprogress / 100;
    cdaudio.currentTime = newtime;
}

function cdvolume(event){
    cdaudio.volume = event.currentTarget.value / 100;
}

function cdautoplay(event){
    const value = event.currentTarget.checked;
    autoplay = value;
}

function nextcdthisonesucks(){
    // button.disabled = true;
    eqa("#cd-controls button").forEach(b => b.disabled = true);
    const delay = stopcd(true, true);
    const cd = eq(".cd");
    const hoffset = brect(cdplayer).bottom;
    const bodywidth = window.innerWidth;

    new Ani(".cd").delay(delay + 100).then(() => {
        cdok = false;
    })
    .rule({
        from: [{rotate: "0deg"}],
        to: [{rotate: "-30deg"}],
        duration: 500,
        easing: "ease-in",
        forwards: true,
        additive: [true, true],
    })
    .rule({ // hacky fix since animation style declarations have higher priortiy
        // than direct css
        from: [{[dirstrop]: `0px`}],
        to: [{[dirstrop]: `${(dir * bodywidth) + (dir ? -1: 1) * brect(cdplayer)[dirstrop]-cddim}px`}],
        duration: 0,
        forwards: true,
        additive: [true, false],
    })
    .then(() => {
        Ani.rmvani(eq(".cd").dataset.ani);
        const rect = brect(cdplayer);
        // log(rect[dirstrop] + cddim);
        cd.style.position = "fixed";
        cd.style.zIndex = 1;
        document.body.before(cd);
        cd.style.top = `${rect.top}px`;
        // log(dirstrop, `${rect[dirstrop]}px`);
        // log(`${brect(cd)[dirstrop]}px`);
        // log(brect(document.body).width - (rect[dirstrop]),brect(cd)[dirstrop]);
    })
    .rule({
        from: [{rotate: "0deg", [dirstrop]: "0px", top: "0px"}],
        to: [{rotate: "360deg", [dirstrop]: ( + extrrand(bodywidth)) + "px", top: "-50px"}],
        duration: 400,
        easing: "cubic-bezier(0.8,0,0.94,0.14)",
        forwards: true,
        additive: [true, false],
    })
    .then(() => {
        if (document.visibilityState === "visible") bonk.play();
    })
    .rule({
        from: [{[dirstrop]: "0px", top: "0px", rotate: "0deg"}],
        to:   [{[dirstrop]: `${cddim}px`, top: `${window.innerHeight * (Math.random() * 2 + 1)}px`, rotate: "9000deg"}],
        duration: 200,
        easing: "ease-out",
        forwards: true,
        additive: [true, false],
    }).then(() => {
        cd.remove();
        placecd();
        // button.disabled = false;
        eqa("#cd-controls button").forEach(b => b.disabled = false);
    });
}