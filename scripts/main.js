"use strict";


// hi debugger if its saturday for you rn u get a cookie
// also i explicitly state where in this code chatgpt was used n stuffies
// init funcs
KeySet.init();
checkvisit();
document.addEventListener("visitorstats", () => {
    eq("#visitor-stats span.total").innerText = visitorstats.visitor_count;
    eq("#visitor-stats span.unique").innerText = visitorstats.visitor_unique;
    const visitorid = pint(localStorage.getItem("visitorid"));
    log("visitorid", visitorid);
    if(visitorid){
        eq("#visitor-stats span.unique").setAttribute("data-hover", `(ur the ${numsuffix(visitorid)}!)`);
    }
    else{
        // huh
        localStorage.removeItem("lastvisit");
    }
})



// REJECT CAMEL CASE
const fpsm = new PerSec(1000);
const dispfps = new MeteredTrigger(100, () => {eid("fps").innerText = fpsm.cntn();});
let prevfps = 0, maxfps = 0;
function fps(){
    fpsm.add();
    if(prevfps !== fpsm.cntn()){
        dispfps.fire();
        prevfps = fpsm.cntn();
        maxfps = max(maxfps, prevfps);
        // log(typeof prevfps, typeof fpsm.cntn());
    }
    window.requestAnimationFrame(fps);
}
fps();

const keyset = eid("keyset");
const kps = new PerSec(600);
// const keysetsize = () => {
//     keyset.style.fontSize = `${sqrt(kps.cntn())}ch`;
//     window.requestAnimationFrame(keysetsize);
// }
// keysetsize();

KeySet.onnewkey = (key) => {
    kps.add();
    const keyel = p(key.key, {"data-key": key.ekey, style: `font-size: ${sqrt(kps.cntn())}ch;` });
    keyel.style.animationTimingFunction = `cubic-bezier(1,${pow(1.5, min(10, sqrt(kps.cntn())))},0.45,1.25)`;
    app(keyset, keyel);

}
KeySet.onoofkey = (key) => {
    const el = eq(`#keyset>[data-key="${key.ekey}"]`);
    if(el) el.remove();
}



// branding visuals
//document.title = baseurl; // later have this textanimate based on branding activeq
const axia = eid("branding"), 
    axiatxt = minurl + "·∫:p_d_", 
    axialen = axiatxt.length;
    // "axia.sh"
// const axiachstyle = styling(`
//     .b-ch{
//         font-size: ${1000/axialen}%;
//     }
//     `);
axia.innerText = "";

for(let i = 0; i < axialen; i++){
    app(axia, mktxt("span", axiatxt[i], {class: "b-ch", id: "b-ch-"+i}));
}
window.addEventListener("resize", () => {
    axia.style.fontSize = `${axia.clientWidth * 1.5 / axialen}px`;
});
window.dispatchEvent(new Event("resize"));


const bsplash = new RollingActives(axia, "active-100");
styling(`
#branding>span.b-ch{
    ${Array.from({length: 20}, (_, i) => `
        &.active-${(i + 1) * 10}{
            &::before{
                height: ${10 * (i + 2)}%;
            }
            &::after{
                bottom: ${100 - (i + 2) * 10}%;
                height: ${max(6, (i + 1) * .6)}px;
            }
        }
    `).reverse().join('')}
}
`);

axia.childNodes.forEach((el, idx) => {
    el.addEventListener("mouseover", () => {
        bsplash.set([idx], 0, 125);
    });
});
axia.addEventListener("click", (e) => {
    const el = e.target.closest("span.b-ch");
    if(!el)return;
    const idx = pint(el.id.substring("b-ch-".length));
    el.classList.add("active-40");
    setTimeout(() => {
        el.classList.remove("active-40");
    }, 100);
    bsplash.pass({reverse: 0, nucleationsites: 1, start: min(axialen, idx + 1), delay: 60, decay: 100});
    bsplash.pass({reverse: 1, nucleationsites: 1, start: max(0, idx - 1),       delay: 60, decay: 100});
});


const bsplashrand = new WeightedChoices([
    [() => max(bsplash.pass({reverse: 0}), bsplash.pass({reverse: 1})), 2],
    [() => max(bsplash.pass({reverse: 1, nucleationsites: 1, delay: 370}),
        bsplash.pass({reverse: 0, nucleationsites: 1, delay: 370})), 1],
]);

function playbsplash() {
    if(!axia.matches(":hover")){
        const t = bsplashrand.spinthelottery()();
        setTimeout(() => {
            playbsplash();
        }, t + 10 * randint(700, 300));
    }
    else{
        setTimeout(playbsplash, 1000);
    }
}
playbsplash();



//bg bars && theme transition
function tohsl(cssColor, components = false){
    let r, g, b, a = 1;
  
    // rgb
    if (cssColor.startsWith('rgb')){
        const vals = cssColor.substring(cssColor.indexOf('(') + 1, cssColor.lastIndexOf(')')).split(',').map(Number);
        r = vals[0] / 255;
        g = vals[1] / 255;
        b = vals[2] / 255;
        if (vals.length === 4){
            a = vals[3];
        }
    } 
    // rgba
    else if (cssColor.startsWith('#')){
        const hex = cssColor.slice(1);
        if (hex.length === 3){
            r = pint(hex[0]+hex[0], 16) / 15;
            g = pint(hex[1]+hex[1], 16) / 15;
            b = pint(hex[2]+hex[2], 16) / 15;
        }
        else if (hex.length === 6 || hex.length === 8){
            const values = hex.match(/.{2}/g).map(v => pint(v, 16) / 255);
            [r, g, b] = values;
            if (hex.length === 8){
                a = values[3];
            }
        }
        else{
            return null;
        }
    }
    else{
      return null;
    }
  
    const maxc = max(r, g, b);
    const minc = min(r, g, b);
    let h, s, l = (maxc + minc) / 2;
  
    if (maxc === minc){
      h = s = 0; // achromatic
    } else{
      const d = maxc - minc;
      s = l > 0.5 ? d / (2 - maxc - minc) : d / (maxc + minc);
      switch (maxc){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    h = round(h * 360); s = round(s * 100); l = round(l * 100);
    if(components){
        return{h: h, s: s, l: l, a: a};
    }
    return `hsl(${h}, ${s}%, ${l}%${a === 1 ? '' : `, ${a}`})`;
}

const scrollprogress = new MeteredQueueTrigger(70, () => {
    eid("scroll-progress").style.width = `${(window.scrollY / (eid(containerlimiterid).offsetHeight - window.innerHeight)) * 100}%`;
});
window.addEventListener("scroll", () => {
    scrollprogress.fire();
});

function togglewcb(){
    if(thememode === "dark")
        eid("wcb").classList.add("wcb-d");
    else
        eid("wcb").classList.remove("wcb-d");
}
togglewcb();
const triggertheme = new MeteredTrigger(250, () => {
    toggletheme();
    togglewcb();
    // setTimeout(() => {
        resetscrollbars();
    // }, 250);
});



const barsizealert = () => {
    // if(truheight / window.innerHeight < 0.75){
    if(false){
        alert(`
            hi! thanks for checking out my site :)\n
            with some browsers like firefox, the nifty background effect you see here may get pretty laggy when you zoom out a lot since they dont handle zoomed-out vw-scaled elements well, 
            however with chrome-based you shouldnt be too worried!\n
            also if its pretty laggy even at normal zoom, just like zoom in more to mask my bad coding :p (i really tried)\n
            ok thats it have fun!
                        ~~ andrew`);
        localStorage.setItem("barsizealert", "1");
        window.removeEventListener("resize", barsizealert);
    }
};
if(localStorage.getItem("barsizealert") !== "1"){
    window.addEventListener("resize", barsizealert);
}
function clearbarsizealert(){
    localStorage.removeItem("barsizealert");
}

const containerlimiterid = "page";
let basecolor = tohsl(compst(document.documentElement).getPropertyValue("--theme-light"), true);

let currpxl = 0;
const step = 1150;
const maxpxl = () => min(1080 * 5, truheight * 3.75);
const maxscroll = () => window.innerHeight / truheight * maxpxl();
const depths = [1, 2, 3, 4,];
const bardepthpower = 1.5;
const depthpows = depths.map(depth => pow(depth, bardepthpower));
const invdepthpows = depths.map(depth => pow(max(.5, depths.length - depth), bardepthpower));

depths.forEach(depth => {
    app(eid("bg-bars"), mk("div",{class: `c-${depth}` }));
});
styling(depths.map(depth => `.c-${depth}{ 
    z-index: -${depth};
    transition: transform ${depth * 0.6}s var(--ease-lessout);

    >div{
        filter: blur(${min(7.5, depthpows[depth - 1])}px);
    }
}
`).join("\n"));

let numbars = 0;
const barkeyframes = [
    "passdown", "passup", "passleft", "passright"
];
function bgbars(newheight){
    if (!eid("bg-bars")){
        log("nope");
        return;
    }

    while(currpxl <= maxpxl() && currpxl <= newheight + step){
        log("spawning more");
        currpxl += step;
        for (let depth of depths){
            const invdepth = max(.5, depths.length - depth);
            for (let cnt = 0; cnt <= depth / 3; cnt++){
                numbars++;
                const bar = mk("div", {class: `bg-bar`});
                // bg-a-${randint(3,1)}
                bar.style.animationName = randarrchoose(barkeyframes);
                if(chance(1.5)) bar.style.animationName += ", expand";
                // log(bar.style.animationName);
                // const bgcolor = `hsl(${basecolor.h }, ${basecolor.s}%, 
                // ${rand(basecolor.l / (depth), basecolor.l * .6 + invdepth * 5)}%)`;
                const bgcolor = `hsl(${basecolor.h}, ${basecolor.s}%, 
                ${rand( basecolor.l*invdepth / 4, basecolor.l * .75)}%)`;



                bar.style.height = `${(depth) * rand(depth) + 4* depth}vh`;
                bar.style.rotate = `${rand(40, -20)*depth}deg`;
                bar.style.left = `${rand(50, -25)}%`;
                bar.style.backgroundColor = bgcolor;
                bar.style.top = `${currpxl - rand(step, -0)}px`;
                bar.style.opacity = (invdepth) * rand(.35 * invdepth, .45);
                // bar.style.boxShadow = `0 0 ${pow((depth - 1), 2) * 10}px ${bgcolor}`; cool but laggy
                bar.style.animationDuration = `${rand(1.5,.5)}s`;
                const barinterval = 300;
                setTimeout(() => {
                    app(eq("#bg-bars .c-" + depth), bar);
                }, rand(barinterval/10, (depth - 2) * barinterval));
            }
        }
    }
}

const scrollbarst = new MeteredQueueTrigger(100, () => {
    // if(window.devicePixelRatio * 100 <= 60)return;
    // if(fpsm.cntn() <= 50) return; // dont run if not doing too hot
    const scroll = window.innerHeight + window.scrollY;
    if(currpxl < eid(containerlimiterid).offsetHeight){ 
        bgbars(scroll);
    }

    if(scroll >= eid(containerlimiterid).offsetHeight){
        return;
    }
    // log(window.scrollY + window.innerHeight, eid("container").offsetHeight);
    const panstrength = 0.1;
    for(let depth of depths){
        const invdepth = max(.5, depths.length - depth);
        const stopmult = maxfps / 10;
        if(fpsm.cntn() + stopmult <= maxfps - invdepth * stopmult) return;
        eq("#bg-bars .c-" + depth).style.transform = `translateY(${(scroll * -panstrength * invdepthpows[depth - 1]) % min(maxscroll(),Infinity)}px)`;
    }
});

let logging = false;
if(logging){
    setInterval(() => {
        eid("log").innerHTML = window.innerWidth;
    }, 1000);
}

window.addEventListener("scroll", () => {
    scrollbarst.fire();
});

function resetscrollbars(){
    currpxl = 0;
    numbars = 0;
    basecolor = tohsl(compst(document.documentElement).getPropertyValue("--theme-light"), true);
    eqa("#bg-bars>div").forEach((e) => {
        e.innerHTML = "";
    });
    bgbars(window.innerHeight + window.scrollY);
    scrollbarst.fire();
}





// once everything is loaded
document.addEventListener("DOMContentLoaded", () => {
    bgbars(currpxl);
    window.dispatchEvent(new Event("scroll"));
});


const baseartzlink = "../assets/imgs/artz/";

// have fun seeing the art i commented out
const artzinfo = [
    // ["IMG_1106.jpg", `old ahh 60 second portrait of me`],
    ["IMG_1366.webp", `old doodle for irl friend madeleine !!`],
    ["IMG_1378.webp", `ORIIIIIIIIIIIIIIIIIIII`],
    ["IMG_1698.webp", `${linkhtml("https://www.youtube.com/@RandomCatOnRoblox", "randomcat")} 
        fanart while i still thought he was cool`],
    ["IMG_1795.webp", `rainstorm sh4rk doodle (saltwater boi)`],
    ["IMG_1853.webp", `half shitty merc fleet doodle half learning impact frames 
        (i think the gun is pretty cool beans tho)`],
    ["IMG_1861.webp", `yveltal slurp(ee)`],
    ["IMG_2119.webp", `vandalizing my own 
        <i>${linkhtml(baseartzlink + "IMG_2119_og.webp", "vandalized",{title: "trust me"})}</i> 
        ap chem booklet (jk thx alx and rachel i like it lol)`],
    // ["IMG_2231.jpg", `christmas doodle 4 online kiddos`],
    ["IMG_2380.webp", `ap chemistry collab`],
    ["IMG_2000.webp", `my first dip into digital art (god why didnt i use any blending for the lighting lol),
         birthday piece done for online friend`],
    ["plutonium.webp", `did a bunch of the pixel art on ${
        linkhtml("https://wplace.live/?lat=35.85735782205856&lng=-106.30502962822266&zoom=16.18", 
            " the wplace periodic table at los alamos!"
        )
    } I think I like doing pixel art now :p`],
    ["miao_sticker.webp", `printed out a bunch of stickers of a cat I drew in roblox spray paint like 2 years ago lmao, 
        here's the proof ${linkhtml("https://stickermule.com", "StickerMule")} sent me`],
    ["IMG_2954.webp", `just bought acryllic markers and cooked on the BOOom`],
    ["sewh_shark.webp", `played ${linkhtml("https://sewh.miraheze.org/wiki/Main_Page",
        'S.E.W.H.'
    )} and liked it a lot! ${linkhtml("https://joeylent.dev/", 
        "Joey")} told me to add the (poorly drawn) blahaj lol`],
    ["IMG_3150.webp", `scuffed yveltal planner doodle ! !`],
    ["IMG_3151.webp", `other scuffed planner doodle`]

    // "IMG_.jpg",
    // "IMG_.jpg",
    // "IMG_.jpg",
    // "IMG_.jpg",
];

artzinfo.sort(() => chance(2)); // big brain
const dirs = ["front", "back", "left", "right"];
const poss = [0, 4, 6, 2, 1, 5, 7, 3];
const imgprefix = "chich";

function generateposs(cnt){
    const poss = [];
    return poss;
}

let trackimgcss = "", bgurlloaded = 0;
async function artzurl(idx){
    // // uncomment this out to have overflow cats but it eats up bandwidth which I dont feel good doing
    // if(idx >= artzinfo.length){
    //     idx %= artzinfo.length;
    //     const catdata = await fetch("https://api.thecatapi.com/v1/images/search")
    //         .then(response => response.json()).catch(e => e);
        
    //     if(!catdata.message){
    //         const url = catdata[0].url;
    //         return url;
    //     }
    // }
    
    return baseartzlink + artzinfo[idx % artzinfo.length][0];
    
}
(async () =>{
    const upper = dirs.length * 4;
    for(let i = 0; i < upper; i++){
        const url = await artzurl(i);
        trackimgcss += `
        .${imgprefix}${i} {
            --bg-url: url('${url}');
        }\n
        `;
        bgurlloaded++;
    }
    styling(trackimgcss);
    eqa(".t-img").forEach((e) => {
        const bimg = compst(e).backgroundImage;
        const bimgurl = bimg.substring(5, bimg.length - 2);
    
        const img = new Image();
        imglazy(img);
        img.onload = () => {
            e.style.aspectRatio = `${img.width} / ${img.height}`;
        };
        // log(bimgurl);
        img.src = bimgurl;
    });
})();

function trackitem(idx, transition = "none"){
    let desc = "";
    // if(idx >= artzinfo.length) desc = "index overflow cat!!";
    // else 
    desc = artzinfo[idx % artzinfo.length][1];
    return app(mk("div",{class: `${dirs[idx % dirs.length]}` }), 
        app(
            mk("div",
                {class: `${imgprefix}${(idx)} t-img`,
                    style: `animation-delay: calc(${-poss[idx % poss.length]} * var(--spin-speed) / 16 - var(--spin-speed) / 4);`,
            }),
            app(
                mk("div",{style: `transition: ${transition}`}), 
                mktxt("p", desc, {class: "t-img-desc"})
            ))
        );
}

function addtotrack(track, classadd = 0){
    for(let i = 0; i < dirs.length; i++){
        const transition = randarrchoose([
            "0.75s var(--ease-doublebacktrack);",
            "0.75s var(--ease-backtrack);",
            "none"]);
        // overflow cat for indices out of range
        const titem = trackitem(i + classadd, transition);
        app(track, titem);
    }
}

eqa(".track-outer .track-1.track:not(.other)").forEach((e) => {
    addtotrack(e);
});
eqa(".track-outer .track-1.track.other").forEach((e) => {
    addtotrack(e, dirs.length);
});
eqa(".track-outer .track-2.track:not(.other)").forEach((e) => {
    addtotrack(e, dirs.length * 2);
});
eqa(".track-outer .track-2.track.other").forEach((e) => {
    addtotrack(e, dirs.length * 3);
});

// eqa(".track-outer .track-3.track:not(.other)").forEach((e) => {
//     addtotrack(e, dirs.length * 1);
// });
// eqa(".track-outer .track-3.track.other").forEach((e) => {
//     addtotrack(e, dirs.length * 4);
// });

// experimental track thing

// eqa(".track-outer .track-3.track:not(.other)").forEach((e) => {
//     addtotrack(e, dirs.length * 1);
// });
// eqa(".track-outer .track-3.track.other").forEach((e) => {
//     addtotrack(e, dirs.length * 4);
// });
const track3 = eqa(".track .track3");
let lastscroll = 0;
function scrolltrack3(event){
    event.preventDefault();
    const diff = window.scrollY - lastscroll;
    lastscroll = window.scrollY;
}

for(const track of track3){
    track.addEventListener("scroll", scrolltrack3);
}
//todo: maybe make this handle n images instead of 4 with programatic css


const lmenu = eid("left-menu");
const lmenuops = eid("left-menu-options");
const lmenutime = 750;

const lmenuvis = new MeteredPatientTrigger(750, () => {
    setTimeout(() => {
        if(lmenu.matches(":hover") || lmenuops.matches(":hover")) return;
        lmenu.style.opacity = "0";
    }, lmenutime);
});



eqa("#left-menu-options>div").forEach(e => {
    const option = e;
    const name = option.dataset.name;
    const menuitem = eq(`#left-menu>.${name}`);
    
    const rotation = 35;
    const rotationr = rotation * deg2rad;
    option.classList.add(name);

    option.onmouseover = () => {
        lmenu.style.opacity = "1";
        menuitem.classList.add("active");

        // Get the perspective value from #left-menu
        const perspective = 1000;
        const realheight = brect(eid("left-menu")).height;
        // ((menuitem.clientHeight + menuitem.offsetTop) / eid("left-menu").clientHeight);
        // log(perspective);

        // perspective scaling code from chatgpt
        // Calculate the offset considering the perspective and rotation
        // Project the offsetTop into the transformed space
        // Approximate: scale offset by perspective / (perspective - z)
        // where z = menuitem.clientHeight * sin(rotationr)
        const z = menuitem.clientHeight * sin(rotationr);
        const scale = perspective / (perspective - z);

        const offset = (
            (menuitem.offsetTop * scale - option.offsetTop / cos(rotationr) 
                - (2 * menuitem.clientHeight * sin(rotationr / 2) * sin(rotationr / 2)) /
                sin((90 - rotation) * deg2rad) 
            ) 
        );

        eid("left-menu").style.transform = `
            rotateX(${rotation}deg) 
            translateY(${-offset}px)
        `;
        // eid("left-menu-outer").style.perspective = `${perspective}px`;
        // log(scale, offset);
    };
    menuitem.onmouseover = option.onmouseover; // hacky fix i think
    option.onmouseout = () => {
        menuitem.classList.remove("active");
        lmenuvis.fire();
    };
    menuitem.onmouseout = option.onmouseout;
});
eid("left-menu-outer").onmouseout = (e) => {

    // idk what chatgpt cooked up here but ti woirks
    // Only reset if the mouse actually leaves the container, not just moves between children
    if (!e.relatedTarget || !eid("left-menu-outer").contains(e.relatedTarget)) {
        eid("left-menu").style.transform = "";
        log("resetting left menu transform");
    }
}

// https://www.npmjs.com/package/ani-cursor/v/0.0.5
const ani2css = (selector, data) => window.AniCursor.convertAniBinaryToCSS(selector, data);
async function appcursor(selector, url) {
    const response = await fetch(url);
    const data = new Uint8Array(await response.arrayBuffer());

    styling(ani2css(selector, data));
}
//default
appcursor("body, ::-webkit-scrollbar-track", "../assets/cursors/don-chan/通常.ani");
//pointer
appcursor("a, button, ::-webkit-scrollbar-thumb, #self-88x31 img, #blog>nav>button, #theme-switch", "../assets/cursors/don-chan/リンクの選択.ani");
//text
appcursor("textarea, input, select, [contenteditable]", "../assets/cursors/don-chan/テキスト選択.ani");
//ew-resize
appcursor("#slider", "../assets/cursors/don-chan/左右に拡大縮小.ani");
//move
appcursor("#slider.grab", "../assets/cursors/don-chan/移動.ani");