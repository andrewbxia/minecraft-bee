// const eid = id => document.getElementById(id);
// const eq = query => document.querySelector(query);
// const eqa = query => document.querySelectorAll(query);
const randarridx = arr => Math.floor(Math.random() * arr.length);
const randarrchoose = arr => arr[randarridx(arr)];

const shootingbars = eid("shooting-bars");
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
    bar.style.width = width;
    bar.style.height = Math.random() * 100 + Math.pow((.75 - Math.random()), 2) * 100 + "px";
    bar.style.backgroundColor = `var(${color})`;
    bar.classList.add("shooting-bar");
    bar.style.top = `${Math.random() * (300)}px`; // height of shootingbars div
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
    for(const color of shootingbarcolors){
        if(!pageentered) break;
        for(let i = 0; i < density; i++){
            shootbar(color, randarrchoose(shootingbarwidths), randarrchoose(shootingbarheights));
        }
    }
    setTimeout(shootbars, 500);
    

}
shootbars();