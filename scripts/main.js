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

const progressinterval = setInterval(() => {   
    let progress = cdaudio.currentTime / cdaudio.duration * 100;
    if(isNaN(progress)) progress = 0;
    eid("cd-progress").value = progress;
    eid("cd-progress").style.backgroundSize = progress + "% 100%";
}, 100);

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
    });
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
}
function stopcd(full = false, out = false){
    const cd = cdplayer.querySelector(".cd");
    if(!full && cdaudio.paused && !cdaudio.ended) return 0;

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
    eid("cd-play").setAttribute("onclick", "playcd()");
    eid("cd-play").innerText = cdplaytext;
    // cdaudio.currentTime = 0;
    
    return delay;
}

function resetcd(){
    stopcd(false, false);
    cdaudio.currentTime = 0;
}

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
    ["IMG_1698.jpg", `${link("https://www.youtube.com/@RandomCatOnRoblox", "randomcat")} fanart`],
    ["IMG_1795.jpg", `rainstorm sh4rk doodle (saltwater boi)`],
    ["IMG_1853.jpg", `half merc fleet doodle half learning impact frames also i think the gun is pretty cool beans`],
    ["IMG_1861.jpg", `yveltal slurp(ee)`],
    ["IMG_2119.jpg", `vandalizing my own ${link(baseartzlink + "IMG_2119_og.jpg", "vandalized","_blank", {title: "trust me"})} ap chem booklet (jk thx alx and rachel i like it lol)`],
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
        button.tabIndex = 0;
        // button.onfocus = function(){
        //     this.style.outline = "none";
        // }
        
        
        const imgcontainer = document.createElement("div");
        
        const img = document.createElement("img");
        img.draggable = false;

        img.onload = function(){
            imgloaded++;
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