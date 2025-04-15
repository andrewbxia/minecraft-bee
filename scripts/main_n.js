const fpsm = new PerSec(1000);
const dispfps = new MeteredTrigger(100, () => {eid("fps").innerText = fpsm.cntn();});
let prevfps = 0;
function fps(){
    fpsm.add();
    if(prevfps !== fpsm.cntn()){
        dispfps.fire();
        prevfps = fpsm.cntn();
    }
    window.requestAnimationFrame(fps);
}
fps();
// TODO: ahve these be individual elements so i can use them for funny thingies
let mainhtext = [
    "axia.sh",
    "here to stay",
    "test3",
    "test4",
    "test5",
];
const jointxt = " | ";
mainhtext = jointxt + mainhtext.concat(mainhtext).join(jointxt);
/*
main container
    container (for accurate size of child)
        content container
*/
app(eid("main-h"), app(mk("div", {style: "min-width: fit-content;", id: "header-m-c"}), mktxt("h1", mainhtext, {class: "marquee-100", id: "header-m"})));
function tohsl(cssColor, components = false) {
    let r, g, b, a = 1;
  
    // Handle RGB/RGBA
    if (cssColor.startsWith('rgb')) {
        const vals = cssColor.substring(cssColor.indexOf('(') + 1, cssColor.lastIndexOf(')')).split(',').map(Number);
        r = vals[0] / 255;
        g = vals[1] / 255;
        b = vals[2] / 255;
        if (vals.length === 4) {
            a = vals[3];
        }
    } 
    // Handle HEX
    else if (cssColor.startsWith('#')) {
        const hex = cssColor.slice(1);
        if (hex.length === 3) {
            r = pint(hex[0]+hex[0], 16) / 15;
            g = pint(hex[1]+hex[1], 16) / 15;
            b = pint(hex[2]+hex[2], 16) / 15;
        }
        else if (hex.length === 6 || hex.length === 8) {
            const values = hex.match(/.{2}/g).map(v => pint(v, 16) / 255);
            [r, g, b] = values;
            if (hex.length === 8) {
                a = values[3];
            }
        }
        else {
            return null; // Invalid hex format
        }
    }
    else {
      return null; // Unsupported format
    }
  
    const maxc = max(r, g, b);
    const minc = min(r, g, b);
    let h, s, l = (maxc + minc) / 2;
  
    if (maxc === minc) {
      h = s = 0; // achromatic
    } else {
      const d = maxc - minc;
      s = l > 0.5 ? d / (2 - maxc - minc) : d / (maxc + minc);
      switch (maxc) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    h = round(h * 360); s = round(s * 100); l = round(l * 100);
    log({h, s, l});
    if(components){
        return {h: h, s: s, l: l, a: a};
    }
    return `hsl(${h}, ${s}%, ${l}%${a === 1 ? '' : `, ${a}`})`;
}
// bg bars

const containerlimiterid = "page";
const basecolor = tohsl(compst(document.documentElement).getPropertyValue("--theme-light"), true);

let currpxl = 0;
const step = 1250;
const maxpxl = () => min(1080 * 5, window.innerHeight * 3);
const depths = [1, 2, 3, 4,];
depths.forEach(depth => {
    app(eid("bg-bars"), mk("div", {class: `c-${depth}` }));
});
app(document.head, mktxt("style", 
    depths.map(depth => `.c-${depth}{ 
        z-index: -${depth};
        transition: transform ${depth * 0.6}s var(--ease-lessout);

        >div{
            filter: blur(${min(10, pow(depth, 2))}px);
        }
    }
    `).join("\n")
));
let numbars = 0;
function bgbars(newheight) {
    if (!eid("bg-bars")) {
        log("nope");
        return;
    }

    while(currpxl <= maxpxl() && currpxl <= newheight + step){
        log("spawning more");
        currpxl += step;
        for (let depth of depths) {
            const invdepth = max(.5, depths.length - depth);
            for (let cnt = 0; cnt < Math.log(depth) + 1; cnt++) {
                numbars++;
                const bar = mk("div", { class: `bg-bar bg-a-${randint(3, 1)}`});
                const bgcolor = `hsl(${basecolor.h}, ${basecolor.s}%, ${rand( basecolor.l*invdepth / 6, basecolor.l * .75)}%)`;
                
                // bar.style.zIndex = -depth;
                bar.style.height = `${(depth) * rand(5 + depth) + 4}vh`;
                bar.style.rotate = `${rand(50, -25)*depth}deg`;
                bar.style.left = `${rand(50, -25)}%`;
                bar.style.backgroundColor = bgcolor;
                bar.style.top = `${currpxl - rand(step)}px`;
                bar.style.opacity = (invdepth) * rand(.2 * invdepth, .35);
                // bar.style.boxShadow = `0 0 ${pow((depth - 1), 2) * 10}px ${bgcolor}`;
                // bar.style.animationDelay = `${rand(0.5)}s`;
                bar.style.animationDuration = `${rand(2, .5)}s`;
                app(eq("#bg-bars .c-" + depth), bar);
            }
        }
    }
}

const scrollbars = new MeteredTrigger(100, () => {
    // if(window.devicePixelRatio * 100 <= 60)return;
    // if(fpsm.cntn() <= 50) return; // dont run if not doing too hot
    const scroll = window.innerHeight + window.scrollY;
    if(currpxl < eid(containerlimiterid).offsetHeight) { 
        bgbars(scroll);
    }

    if(scroll >= eid(containerlimiterid).offsetHeight){
        return;
    }
    // log(window.scrollY + window.innerHeight, eid("container").offsetHeight);
    const panstrength = 0.1;
    for(let depth of depths){
        const invdepth = max(.5, depths.length - depth);
        if(fpsm.cntn() <= 60 - invdepth * 5) return;
        eq("#bg-bars .c-" + depth).style.transform = `translateY(${(scroll * -panstrength * pow(invdepth, 2)) % min(maxpxl(),Infinity)}px)`;
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





// blog
const blogpagelimit = 3;
let pageidx = nullnum(pint(params.get("pg")));
let postid =  nullnum(pint(params.get("id")));
const posts = [];

if(pageidx === null && postid === null)
    pageidx = 0;

(pageidx === null ? getpost(postid) : getpage(pageidx)).then(data => {
    posts.push(...data);
    dispposts();
    if(postid !== null)
        window.location.href = `#${postid}`;
}).catch(error => {
    err(error);
    eid("blog").innerHTML = `<center>posts didnt load...maybe ${mkhtml("a", "reload?", {href: ""}) }
    <br>.₊̣̇.ಇ/ᐠˬ ͜   ˬ ᐟ\∫.₊̣̇.</center>`;
});

// if(pageidx !== null){
//     getpage(pageidx).then(data => {
//         posts.push(...data);
//         dispposts();
//         if(postid !== null)
//             window.location.href = `#${postid}`;
//     });
// }
// else if(postid !== null){
//     getpost(postid).then(data => {
//         posts.push(data[0]);
//         dispposts();
//     });
// }

function dispposts(){
    for(let i = 0; i < posts.length; i++){
        addpost(i);
    }
}

function addpost(postsidx){
    log(postsidx);
    const post = posts[postsidx];
    const id = post.id;
    const title = post.title;
    const desc = post.description;
    const tags = post.tags;
    const created = new Date(post.created_at);
    const edited = new Date(post.edited_at);
    const cover = post.cover_url;
    const content = post.content;
    log(content)
    
    const postel = mk("article", {class: "post", title: title, dataset: {id: id}});
    const posth = mk("center", {class: "post-header"});
    const postc = mktxt("p", content, {class: "post-content"});
    app(posth, mktxt("h2", title, {class: "post-title"}));
    app(posth, mktxt("h3", desc, {class: "post-subtitle"}));
    const misc = mk("span", {class: "post-misc"});
    // app(misc, mk("span", ))
    const hasedited = post.created_at !== post.edited_at;
    const datestr = created.toDateString() + (hasedited ? ` (${edited.toDateString()})` : "");
    appmany(misc, 
        [p(datestr), p(`${post.tags.join(" · ")}`)]
    );
    
    app(posth, misc);
    app(postel, posth);
    app(postel, postc);
    app(eid("blog"), postel);
}

