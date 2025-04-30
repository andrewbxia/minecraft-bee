"use strict";
const baseurl = window.location.host; // give them the port if the wanna!!!!
const fpsm = new PerSec(1000);
const dispfps = new MeteredTrigger(100, () => {eid("fps").innerText = fpsm.cntn();});
let prevfps = 0, maxfps = 0;
function fps(){
    fpsm.add();
    if(prevfps !== fpsm.cntn()){
        dispfps.fire();
        prevfps = fpsm.cntn();
        maxfps = max(maxfps, prevfps);
    }
    window.requestAnimationFrame(fps);
}
fps();
// TODO: ahve these be individual elements so i can use them for funny thingies
let mainhtext = [
    baseurl,
    "here to stay",
    "test3",
    "test4",
    "test5",
    "what",
];

const jointxt = `${sp}|${sp}`;
mainhtext = mainhtext.flatMap((e, i) => i < mainhtext.length ? [e, jointxt] : [e]);
mainhtext = mainhtext.concat(mainhtext);
const mainhnodes = nodelist(mainhtext.map((e) => {
    const node = mktxt("h1", e, {});
    if (e !== jointxt) 
        node.classList.add("main-h-text");
    return node;
}));

app(eid("main-h"), app(mk("div",{style: "min-width: fit-content;", id: "header-m-c"}), app(mk("span", {class: "marquee-100", id: "header-m"}), mainhnodes)));

// branding visuals
document.title = baseurl; // later have this textanimate based on branding activeq
const axia = eid("branding"), axiatxt = baseurl + "∫:p_d_";
axia.innerText = "";

for(let i = 0; i < axiatxt.length; i++){
    app(axia, mktxt("span", axiatxt[i], {class: "b-ch", id: "b-ch-"+i}));
}
window.addEventListener("resize", () => {
    axia.style.fontSize = `${axia.clientWidth * 1.5 / axiatxt.length}px`;
});
window.dispatchEvent(new Event("resize"));
const bsplash = new RollingActives(axia);
axia.childNodes.forEach((el, idx) => {
    el.addEventListener("mouseover", () => {
        bsplash.set([idx], 0, 250);
    })
})


function playbsplash() {
    if(!axia.matches(":hover")){
        let t = 0;
        
        const choice = rand(1);
        if (choice < 0.5){
            t = max(bsplash.pass(1), bsplash.pass(0));
        }
        else{
            t = max(bsplash.pass(1,1,20,70), bsplash.pass(0,1,20,70));
        }
        setTimeout(() => {
            playbsplash();
        }, t + randint(700, 300));
    }
    else{
        setTimeout(playbsplash, 100);
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


const scrollprogress = new MeteredTrigger(33, () => {
    eid("scroll-progress").style.width = `${(window.scrollY / (eid(containerlimiterid).offsetHeight - window.innerHeight)) * 100}%`;
});

window.addEventListener("scroll", () => {
    scrollprogress.fire();
});

const toggledark = () => document.documentElement.classList.toggle("dark");

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
    toggledark();
}
const toggletheme = new MeteredTrigger(250, () => {
    toggledark();
    // setTimeout(() => {
        resetscrollbars();
    // }, 250);
});



const barsizealert = () => {
    if(trueheight / window.innerHeight < 0.75){
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
const maxpxl = () => min(1080 * 5, trueheight * 3.75);
const maxscroll = () => window.innerHeight / trueheight * maxpxl();
const depths = [1, 2, 3, 4,];
depths.forEach(depth => {
    app(eid("bg-bars"), mk("div",{class: `c-${depth}` }));
});
styling(depths.map(depth => `.c-${depth}{ 
    z-index: -${depth};
    transition: transform ${depth * 0.6}s var(--ease-lessout);

    >div{
        filter: blur(${min(10, pow(depth, 2))}px);
    }
}
`).join("\n"));

let numbars = 0;
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
            for (let cnt = 0; cnt <= Math.log(depth); cnt++){
                numbars++;
                const bar = mk("div", {class: `bg-bar bg-a-${randint(3, 1)}`});
                const bgcolor = `hsl(${basecolor.h}, ${basecolor.s}%, ${rand( basecolor.l*invdepth / 5, basecolor.l * .75)}%)`;

                bar.style.height = `${(depth) * rand(depth) + 4* depth}vh`;
                bar.style.rotate = `${rand(50, -25)*depth}deg`;
                bar.style.left = `${rand(50, -25)}%`;
                bar.style.backgroundColor = bgcolor;
                bar.style.top = `${currpxl - rand(step, -0)}px`;
                bar.style.opacity = (invdepth) * rand(.35 * invdepth, .45);
                // bar.style.boxShadow = `0 0 ${pow((depth - 1), 2) * 10}px ${bgcolor}`; cool but laggy
                bar.style.animationDuration = `${rand(1.5,.5)}s`;
                app(eq("#bg-bars .c-" + depth), bar);
            }
        }
    }
}

const scrollbarst = new MeteredTrigger(100, () => {
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
        const stopmult = maxfps / 12;
        if(fpsm.cntn()+stopmult <= maxfps - invdepth * stopmult) return;
        eq("#bg-bars .c-" + depth).style.transform = `translateY(${(scroll * -panstrength * pow(invdepth, 2)) % min(maxscroll(),Infinity)}px)`;
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
const artzinfo = [
    ["IMG_1106.jpg", `old ahh 60 second portrait of me`],
    ["IMG_1366.jpg", `doodle for irl friend madeleine !!`],
    ["IMG_1378.jpg", `ORIIIIIIIIIIIIIIIIIIII`],
    ["IMG_1698.jpg", `${linkhtml("https://www.youtube.com/@RandomCatOnRoblox", "randomcat")} 
        fanart while i still thought he was cool`],
    ["IMG_1795.jpg", `rainstorm sh4rk doodle (saltwater boi)`],
    ["IMG_1853.jpg", `half shitty merc fleet doodle half learning impact frames 
        (i think the gun is pretty cool beans tho)`],
    ["IMG_1861.jpg", `yveltal slurp(ee)`],
    ["IMG_2119.jpg", `vandalizing my own 
        <i>${linkhtml(baseartzlink + "IMG_2119_og.jpg", "vandalized",{title: "trust me"})}</i> 
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
artzinfo.sort(() => Math.random() - 0.5);
const dirs = ["front", "back", "left", "right"];
const poss = [0, 4, 6, 2, 1, 5, 7, 3];
const imgprefix = "a";

function generateposs(cnt){
    const poss = [];


    return poss;
}

let trackimgcss = "";
for(let i = 0; i < dirs.length * 4; i++){
    trackimgcss += `
        .${imgprefix}${i}{
            --bg-url: url('${baseartzlink}${artzinfo[(i) % artzinfo.length][0]}');
        }\n
    `
}

function addtotrack(track, classadd = 0){
    for(let i = 0; i < dirs.length; i++){
        // log((i+classadd) % artzinfo.length)
        // app(track, app(mk("div",{class: `${dirs[i]}` }), mk("div",{class: `${imgprefix}${i+1+classadd} t-img`})));
        const transition = randarrchoose([
            "0.75s var(--ease-doublebacktrack);",
            "0.75s var(--ease-backtrack);",
            "none"]);
        // overflow cat for indices out of range
        const trackitem = app(mk("div",{class: `${dirs[i]}` }), 
            app(
                mk("div",{class: `${imgprefix}${(i + classadd)} t-img`,
                style: `animation-delay: calc(${-poss[(i + classadd) % poss.length]} * var(--spin-speed) / 16 - var(--spin-speed) / 4);`,
                }),
                app(
                    mk("div",{style: `transition: ${transition}`}), 
                    mktxt("p", artzinfo[(i+classadd) % artzinfo.length][1],{class: "t-img-desc"})
                ))
            );
        app(track, trackitem);
    }
}
styling(trackimgcss);
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
eqa(".t-img").forEach((e) => {
    const bimg = compst(e).backgroundImage;
    const bimgurl = bimg.substring(5, bimg.length - 2);

    const img = new Image();
    img.onload = () => {
        e.style.aspectRatio = `${img.width} / ${img.height}`;
    };
    // log(bimgurl);
    img.src = bimgurl;
});
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
