// const eid = id => document.getElementById(id);
// const eq = query => document.querySelector(query);
// const eqa = query => document.querySelectorAll(query);


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


const artzinfo = [
    ["IMG_1106.jpg", `old ahh 60 second drawing of me`],
    ["IMG_1366.jpg", `doodle for irl friend madeleine !!`],
    ["IMG_1378.jpg", `ORIIIIIIIIIIIIIIIIIIII`],
    ["IMG_1698.jpg", `${linkhtml("https://www.youtube.com/@RandomCatOnRoblox", "randomcat")} 
        fanart while i still thought he was cool`],
    ["IMG_1795.jpg", `rainstorm sh4rk doodle (saltwater boi)`],
    ["IMG_1853.jpg", `half shitty merc fleet doodle half learning impact frames 
        (i think the gun is pretty cool beans tho)`],
    ["IMG_1861.jpg", `yveltal slurp(ee)`],
    ["IMG_2119.jpg", `vandalizing my own 
        <i>${linkhtml(baseartzlink + "IMG_2119_og.jpg", "vandalized", {title: "trust me"})}</i> 
        ap chem booklet (jk thx alx and rachel i like it lol)`],
    ["IMG_2231.jpg", `christmas doodle 4 online kiddos`],
    ["IMG_2380.jpg", `ap chemistry collab`],
    ["IMG_2000.jpg", `my first dip into digital art (god why didnt i use any blending for the lighting lol),
         birthday piece done for online friend`],
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

// shuffle(artzinfo);
artzinfo.sort((a,b) => {
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
    const endpageidx = Math.ceil(artzinfo.length / displaylimit) - 1;    
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
    const loadcnt = min(displaylimit, artzinfo.length - start);
    let imgidx = start;
    let imgloaded = 0;

    while(imgidx < artzinfo.length && imgidx - start < displaylimit){
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
            // img.style.aspectRatio = `${this.width}/${this.height}`;
            if(imgloaded === loadcnt){
                artz.style.minHeight = "auto";
            }
        }

        img.src = baseartzlink + artzinfo[imgidx][0];

        const caption = document.createElement("p");
        caption.classList.add("caption");
        caption.innerHTML = "-- " + artzinfo[imgidx][1];
        img.title = caption.innerText;

        imgcontainer.appendChild(img);
        imgcontainer.appendChild(caption);
        button.appendChild(imgcontainer);
        artz.appendChild(button);
        imgidx++;
    }
    // artz.style.height = "auto";
}

log(artzinfo);

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
        ["jhlee.gif"],
        ["despacito.png"],
    ]
};
buttons.filed.forEach(button => {
    let btn = img(buttonspath + button[0]);
    if(button[1]) btn = app(link(button[1]), btn);
    ctn8831.appendChild(btn);
});
buttons.hotlinked.forEach(button => {
    ctn8831.innerHTML += button;
});

// banners section

const bannerspath = "./assets/imgs/banners/";
const ctnbanners = eid("banners");
const loopinterval = 5000;
let bannercycle = 0;

const banners = [
    ["osumania.gif", "https://osu.ppy.sh/u/beebp",  {title: "clik for mah oss profile"}],
    // ["osumania2.gif", "https://osu.ppy.sh/u/beebp", {title: "clik for mah oss profile"}],
    ["osumania3.gif", "https://osu.ppy.sh/u/beebp", {title: "clik for mah oss profile"}],
    // ["osumania4.gif", "https://osu.ppy.sh/u/beebp", {title: "clik for mah oss profile"}],
];

banners.forEach(banner => {
    let bannerel = img(bannerspath + banner[0]);
    bannerel.loading = "lazy";
    if(banner[1]) bannerel = app(link(banner[1], "", banner[2] || ""), bannerel);
    bannerel.style.display = "none";
    app(ctnbanners, bannerel);
});

function cyclebanners(){
    ctnbanners.childNodes[bannercycle].style.display = "none";
    bannercycle = (bannercycle + 1) % banners.length;
    ctnbanners.childNodes[bannercycle].style.display = "block";
}
bannercycle = randint(banners.length - 1);
ctnbanners.childNodes[bannercycle].style.display = "block";
const bannercycleinterval = setInterval(cyclebanners, loopinterval);

// bg bars
const containerlimiterid = "container";
let currpxl = 0;
const step = 750;
const maxpxl = () => min(4096, window.innerHeight * 1.414*1.414);
const depths = [1, 2, 3, 4,];
depths.forEach(depth => {
    app(eid("bg-bars"), mk("div", {class: `c-${depth}` }));
});
app(document.head, mktxt("style", 
    depths.map(depth => `.c-${depth}{ 
        z-index: -${depth};
        transition: transform ${depth * 0.3}s ease;

        >div{
            filter: blur(${min(20, pow(depth - 1, 2) * 5)}px);
        }
    }
    `).join("\n")
));

function bgbars(newheight) {
    if (!eid("bg-bars")) {
        log("nope");
        return;
    }

    while(currpxl <= maxpxl() && currpxl <= newheight + step){
        log("spawning more");
        currpxl += step;
        for (let depth of depths) {
            const invdepth = depths.length - depth;
            for (let cnt = 0; cnt < depth ; cnt++) {
                const bar = mk("div", { class: `bg-bar bg-a-${randint(3, 1)}`});
                const bgcolor = `hsl(41 ${rand(40, 31)}% ${rand(20, 74.7)}%)`;
                // bar.style.zIndex = -depth;
                bar.style.height = `${(depth) * rand(5 + depth) + 4}vh`;
                bar.style.rotate = `${rand(50, -25)*depth}deg`;
                bar.style.left = `${rand(50, -25)}%`;
                bar.style.backgroundColor = bgcolor;
                bar.style.top = `${currpxl - rand(step)}px`;
                bar.style.opacity = (invdepth) * rand(.1 * invdepth, .15);
                // bar.style.boxShadow = `0 0 ${pow((depth - 1), 2) * 10}px ${bgcolor}`;
                // bar.style.animationDelay = `${rand(0.5)}s`;
                bar.style.animationDuration = `${rand(2, .5)}s`;
                app(eq("#bg-bars .c-" + depth), bar);
            }
        }
    }
}

const scrollbars = new MeteredTrigger(100, () => {
    const scroll = window.innerHeight + window.scrollY;
    if(currpxl < eid(containerlimiterid).offsetHeight) { 
        bgbars(scroll);
    }

    if(scroll >= eid(containerlimiterid).offsetHeight){
        return;
    }
    // log(window.scrollY + window.innerHeight, eid("container").offsetHeight);
    const panstrength = 0.15;
    for(let depth of depths){
        eq("#bg-bars .c-" + depth).style.transform = `translateY(${(scroll * -panstrength * pow(depths.length - depth, 2)) % min(maxpxl(), currpxl)}px)`;
    }
});

window.addEventListener("scroll", () => {
    scrollbars.fire();
});

// once everything is loaded
document.addEventListener("DOMContentLoaded", () => {
    bgbars(currpxl);
    window.dispatchEvent(new Event("scroll"));
});

// const fpsc = new PerSec(1000);
// let prevfps = 0;
// const fps = () => {
//     fpsc.add();
//     if(fpsc.cnt() !== prevfps){
//         eid("fps").innerText = fpsc.cnt() + " fps";
//         prevfps = fpsc.cnt();
//     }
//     requestAnimationFrame(fps);
// }
// requestAnimationFrame(fps);
