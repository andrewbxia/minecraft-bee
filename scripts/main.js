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
    log(shootingbarsheight);
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
let autoplay = false;
cdaudio.preload = "auto";
bonk.preload = "auto";
const cddim = 338;
let cdanimation = null;
const reverteasing = "cubic-bezier(0.5,0,0.25,1.5)";
let cdok = false;
let cdtitleframe = 0;
const cdframes = [
    "d(-w-)b",
    "d(-wo)b",
    "d(owo)b",
    "d(owo)b",
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

const progressinterval = setInterval(() => {   
    let progress = cdaudio.currentTime / cdaudio.duration * 100;
    if(isNaN(progress)) progress = 0;
    eid("cd-progress").value = progress;
    eid("cd-progress").style.backgroundSize = progress + "% 100%";
}, 100);

const cdaudiocontext = new AudioContext();
const analyser = cdaudiocontext.createAnalyser();
analyser.fftSize = Math.pow(2, 6);
let audioarray = new Uint8Array(analyser.frequencyBinCount);
const source = cdaudiocontext.createMediaElementSource(cdaudio);
source.connect(analyser);
source.connect(cdaudiocontext.destination);
function getVolume() {
    analyser.getByteTimeDomainData(audioarray);
    let sum = 0, maxvol = 0;
    for (let i = 0; i < audioarray.length; i++) {
        const value = audioarray[i] / 128 - 1;
        maxvol = max(maxvol, audioarray[i]);
         // bass multiplier
         sum += value * value * (audioarray[i] < 128 ? 2 : 1);
    }
    const volume = Math.sqrt(sum / audioarray.length);
    // return maxvol / 128 - 1;
    return volume;
}

setInterval(() => {
    const volume = getVolume();
    eid("cd-cover").style.filter = `brightness(${1 + (volume) * 2})`;
}, 1000/60);

function placecd(){
    if(cdplayer.querySelector(".cd")) throw new Error("cd already placed");
    const cd = document.createElement("div");
    cd.classList.add("cd");
    const cdimg = document.createElement("img");
    const selectedcd = randarrchoose(cds);
    cdimg.src = cdimgpath + selectedcd[0];
    cd.dataset.audio = cdaudiopath + selectedcd[1];
    cd.dataset.audioname = selectedcd[1];
    cdaudio.src = cd.dataset.audio;
    // loadAudio(cd.dataset.audio);
    cd.appendChild(cdimg);
    cdplayer.appendChild(cd);
    const rotation = Math.random() * 360 + "deg";
    cd.style.rotate = rotation;
    cd.dataset.rotation = rotation;
    
    if(autoplay) playcd();
    cd.animate([
        {left: -cddim + "px", rotate: 0 + "deg", width: "0px"},
        {left: "0px", rotate: rotation, width: cddim + "px"},
    ], {
        duration: 800,
        easing: "ease-in-out",
        // fill: "forwards"
    }).onfinish = () => {
        cdok = true;
    };
}
placecd();
cdaudio.onended = () => {
    log("ended");
    if(autoplay){
        nextcdthisonesucks();
    }
    else stopcd();
};
// cdaudio.addEventListener("ended", stopcd);
const cdplaytext = "▶", cdstoptext = "❚❚";

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

    // log(decodeURIComponent(cdaudio.src),cd.dataset.audioname)
    if(decodeURIComponent(cdaudio.src).indexOf(cd.dataset.audioname) === -1) cdaudio.src = cd.dataset.audio;
    // log(cdaudio.currentTime);
    eid("cd-play").setAttribute("onclick", "stopcd()");
    eid("cd-play").innerText = cdstoptext;
    cdaudio.play();
    cdok = true;
}
function stopcd(full = false, out = false){
    if(!full && cdaudio.paused && !cdaudio.ended) return 0;

    // hacky
    const from2 = [{rotate: "0deg"}]; if(out) from2[0].right = 0 + "px";
    const to2 = [{rotate: full ? "0deg" : eq(".cd").dataset.rotation}]; 
    if(out) to2[0].right = -cddim + "px";

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
    cdaudio.pause();
    eid("cd-play").setAttribute("onclick", "playcd()");
    eid("cd-play").innerText = cdplaytext;
    // cdaudio.currentTime = 0;
    
    return delay;
}

function resetcd(){
    stopcd(false, false);
    cdaudio.currentTime = 0;
}

// const cdsliderspin = new MeteredTrigger(100, (progress) => {
//     eq(".cd").getAnimations().forEach(ani => {
//         ani.cancel();
//     });
//     eq(".cd").style.rotate = progress*3.6 + "deg";
// });

// let cdspinspeed = 0;
// const cdspingravity = 0.5;
// const cdspininterval = setInterval(() => {
//     const cd = eq(".cd");
//     if(cd && cdok){
//         const currrotation = parseInt(cd.style.rotate) || 0;
//         const target = parseInt(eid("cd-progress").value || 0) * 3.6;
//         const diff = target - currrotation;
//         if(abs(diff) < 1) return;
//         cdspinspeed += cdspingravity * (target - currrotation);
//         //log(`${currrotation + cdspinspeed}deg`);
//         cd.style.rotate = `${currrotation + cdspinspeed}deg`;
//         cdspinspeed *= (1 - cdspingravity);
//     }
//     else{} // probably loading another cd
// }, 100);

function cdprogress(event){
    const newprogress = event.currentTarget.value;
    let newtime = cdaudio.duration * newprogress / 100;
    // if(isNaN(newtime)) newtime = 0;
    cdaudio.currentTime = newtime;
}
function cdvolume(event){
    cdaudio.volume = event.currentTarget.value / 100;
}
function cdautoplay(event){
    const value = event.currentTarget.checked;
    log(value);
    autoplay = value;
    // cdaudio.onended();
}

function nextcdthisonesucks(){
    // button.disabled = true;
    eqa("#cd-controls button").forEach(b => b.disabled = true);
    const delay = stopcd(true, true);
    const cd = eq(".cd");
    // do the animation here later of it dropping and colliding with the bottom screen or someth
    // and a funny one where it shoots off violently lol

    const hoffset = cdplayer.getBoundingClientRect().bottom;
    log(hoffset);

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
    //     log(rect.left, rect.top)
    //     cd.style.position = "fixed";
    //     document.body.before(cd);
    //     cd.style.top = `${rect.top}px`;
    //     cd.style.left = `${rect.right - cddim / 2}px`;
    //     log(cd.getBoundingClientRect().left);
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
    //     log(cd.getBoundingClientRect().left);
    //     cd.remove();
    //     placecd();
    // });
    const bodywidth = document.body.getBoundingClientRect().width;

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
    .then(() => {
        const rect = cdplayer.getBoundingClientRect();
        log(rect.right + cddim)
        cd.style.position = "fixed";
        document.body.before(cd);
        cd.style.top = `${rect.top}px`;
        cd.style.left = `${rect.right}px`;
        log(document.body.getBoundingClientRect().width - (rect.right),cd.getBoundingClientRect().right);
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
        if (document.visibilityState === "visible") {
            bonk.play();
        }
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
        // button.disabled = false;
        eqa("#cd-controls button").forEach(b => b.disabled = false);
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
// blog

eid("blog-writing").style.display = params.has("b-edit") ? "block" : "none";


// artz

let artzpageidx = 0;
const displaylimit = 4;
const baseartzlink = "./assets/imgs/artz/";
const nexthtml = `
<div class="artz-nav">
    <button onclick="nextartz()">Next</button>
</div>
`, prevhtml = `
<div class="artz-nav">
    <button onclick="prevartz()">Previous</button>
</div>
`;


const imginfo = [
    ["IMG_1106.jpg", `old ahh 60 second drawing of me`],
    ["IMG_1366.jpg", `doodle for irl friend madeleine !!`],
    ["IMG_1378.jpg", `ORIIIIIIIIIIIIIIIIIIII`],
    ["IMG_1698.jpg", `${linkhtml("https://www.youtube.com/@RandomCatOnRoblox", "randomcat")} fanart while i still thought he was cool`],
    ["IMG_1795.jpg", `rainstorm sh4rk doodle (saltwater boi)`],
    ["IMG_1853.jpg", `half merc fleet doodle half learning impact frames also i think the gun is pretty cool beans`],
    ["IMG_1861.jpg", `yveltal slurp(ee)`],
    ["IMG_2119.jpg", `vandalizing my own <i>${linkhtml(baseartzlink + "IMG_2119_og.jpg", "vandalized","_blank", {title: "trust me"})}</i> ap chem booklet (jk thx alx and rachel i like it lol)`],
    ["IMG_2231.jpg", `christmas doodle 4 online kiddos`],
    ["IMG_2380.jpg", `ap chemistry collab`],
    // "IMG_.jpg",
    // "IMG_.jpg",
    // "IMG_.jpg",
    // "IMG_.jpg",
];
function shufflearr(arr) {
    /// shuffles in place
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// shuffle(imginfo);
imginfo.sort((a,b) => {
    // highest IMG number first, latest always displayed
    return a < b ? 1 : -1;
});

function nextartz(){
    artzpageidx++;
    displayartz();
}
function prevartz(){
    artzpageidx--;
    displayartz();
}
function displayartz(){
    const endpageidx = Math.ceil(imginfo.length / displaylimit) - 1;    
    artzpageidx = max(0, min(artzpageidx, endpageidx));

    const artz = eid("artz");
    const prevheight = artz.clientHeight;
    artz.style.minHeight = prevheight + "px";
    artz.innerHTML = "";

    // setting nav icons displaies
    eq("#artz-nav-t .artz-prev").style.display = (artzpageidx > 0) ? "block" : "none";
    eq("#artz-nav-t .artz-next").style.display = (artzpageidx < endpageidx) ? "block" : "none";
    eq("#artz-nav-b .artz-prev").style.display = (artzpageidx > 0) ? "block" : "none";
    eq("#artz-nav-b .artz-next").style.display = (artzpageidx < endpageidx) ? "block" : "none";
    eid("artz-nav-t-page").innerText = artzpageidx + 1;
    
    const start = artzpageidx * displaylimit;
    const loadcnt = min(displaylimit, imginfo.length - start);
    let imgidx = start;
    let imgloaded = 0;

    while(imgidx < imginfo.length && imgidx - start < displaylimit){
        const button = document.createElement("button");
        button.tabIndex = 0; // allow :focus-within to work on mobile
        // button.onfocus = function(){
        //     this.style.outline = "none";
        // }
        
        
        const imgcontainer = document.createElement("div");
        
        const img = document.createElement("img");
        img.draggable = false;

        img.onload = function(){
            imgloaded++;
            img.style.aspectRatio = `${this.width}/${this.height}`;
            if(imgloaded === loadcnt){
                artz.style.minHeight = "auto";
            }
        }

        img.src = baseartzlink + imginfo[imgidx][0];

        const caption = document.createElement("p");
        caption.classList.add("caption");
        caption.innerHTML = "-- " + imginfo[imgidx][1];
        img.title = caption.innerText;

        imgcontainer.appendChild(img);
        imgcontainer.appendChild(caption);
        button.appendChild(imgcontainer);
        artz.appendChild(button);
        imgidx++;
    }
    // artz.style.height = "auto";
}

log(imginfo);

displayartz();

// 88x31 buttons

const buttonspath = "./88x31/";
const ctn8831 = eid("container-88-31");

const buttons = {
    hotlinked:[
        `<a href="https://nekoweb.org/"><img src="https://nekoweb.org/assets/buttons/button11.gif"></a><!-- button by milkyway.moe -->`,

    ],
    filed:[
        ["firefox.gif", "https://www.mozilla.org/en-US/firefox/new/"],
    ]
};
buttons.filed.forEach(button => {
    ctn8831.appendChild(app(link(button[1] || ""), img(buttonspath + button[0])));
});
buttons.hotlinked.forEach(button => {
    ctn8831.innerHTML += button;
});


// bg bars


let currpxl = 0;
const step = 500;

function bgbars(newheight) {
    if (!eid("bg-bars")) {
        log("nope");
        return;
    }

    while(currpxl < newheight + step){
        
    log("spawning more");
        for (let depth of [1, 2, 3]) {
            const invdepth = 4 - depth;
            for (let cnt = 0; cnt < depth * rand(1); cnt++) {
                const bar = mk("div", { class: `bg-bar bg-bar-${depth} bg-a-${randint(3, 1)}` });
                const bgcolor = `hsl(41 ${rand(40, 31)}% ${rand(20, 74.7)}%)`;
                bar.style.zIndex = -depth;
                bar.style.height = `${(depth) * rand(5 + depth) + 4}vh`;
                bar.style.rotate = `${rand(50, -25)}deg`;
                bar.style.left = `${rand(50, -25)}%`;
                bar.style.backgroundColor = bgcolor;
                bar.style.top = `${currpxl - rand(step) / 2}px`;
                bar.style.filter = `opacity(${(invdepth) * rand(.1 * invdepth, .15)})`;
                bar.style.boxShadow = `0 0 ${pow((depth - 1), 2) * 10}px ${bgcolor}`;
                // bar.style.animationDelay = `${rand(0.5)}s`;
                bar.style.animationDuration = `${rand(1, 0.5)}s`;
                app(eq("#bg-bars .c-" + depth), bar);
            }
        }
        currpxl += step;
    }
}
/**
 * 
 * 
 * 
let currpxl = 0;
const step = 500;

function bgbars(newheight) {
    if (!eid("bg-bars")) {
        log("nope");
        return;
    }

    while(currpxl < newheight + step){
        
    log("spawning more");
        for (let depth of [1, 2, 3]) {
            for (let cnt = 0; cnt < depth * rand(1); cnt++) {
                const bar = mk("div", { class: `bg-bar bg-bar-${depth}` });
                const bgcolor = `hsl(41 ${rand(40, 31)}% ${rand(20, 74.7)}%)`;
                log(bgcolor);
                bar.style.zIndex = -depth;
                bar.style.height = `${(4 - depth) * rand(5) + 4}vh`;
                bar.style.rotate = `${Math.random() * 50 - 25}deg`;
                bar.style.left = `${Math.random() * 100}%`;
                bar.style.backgroundColor = bgcolor;
                bar.style.top = `${currpxl - rand(step) / 2}px`;
                bar.style.filter = `opacity(${depth * 0.25})`;
                bar.style.boxShadow = `0 0 ${pow((depth - 1), 2) * 10}px ${bgcolor}`;
                app(eq("#bg-bars .c-" + depth), bar);
            }
        }
        currpxl += step;
    }
}



window.addEventListener("scroll", () => {
    const scroll = window.innerHeight + window.scrollY;
    if(currpxl < eid("container").offsetHeight) {
        
    bgbars(scroll);
    }

    if(window.scrollY + window.innerHeight >= eid("container").offsetHeight){
        return;
    }
    log(window.scrollY + window.innerHeight, eid("container").offsetHeight);
    const panstrength = 0.1;
    for(let depth of [1, 2, 3]){
        eq("#bg-bars .c-" + depth).style.transform = `translateY(${((window.scrollY) * panstrength * pow(4 - depth, 2)) % floor(window.innerHeight)}px)`;
    }
    // bgbars(currpxl);
});
document.addEventListener("DOMContentLoaded", () => {
    bgbars(currpxl);
    window.dispatchEvent(new Event("scroll"));
    // putheader();
    // putfooter();
});
 */


window.addEventListener("scroll", () => {
    const scroll = window.innerHeight + window.scrollY;
    if(currpxl < eid("container").offsetHeight) { 
        bgbars(scroll);
    }

    if(window.scrollY + window.innerHeight >= eid("container").offsetHeight){
        return;
    }
    // log(window.scrollY + window.innerHeight, eid("container").offsetHeight);
    const panstrength = 0.15;
    for(let depth of [1, 2, 3]){
        eq("#bg-bars .c-" + depth).style.transform = `translateY(${((window.scrollY) * -panstrength * pow(4 - depth, 2)) % floor(window.innerHeight)}px)`;
    }
    // bgbars(currpxl);
});
document.addEventListener("DOMContentLoaded", () => {
    bgbars(currpxl);
    window.dispatchEvent(new Event("scroll"));
    // putheader();
    // putfooter();
});