// drop-in functions to insert elements into page
// requires helper.js and helper-classes.js

class FpsMeter{
    static #prevfps = 0;
    static #maxfps = 0;
    static #defaultwindow = 1000;
    static #updateint = 100;
    static #fpsm = new PerSec(FpsMeter.#defaultwindow);
    static #dispfps = 
        new MeteredTrigger(FpsMeter.#updateint, () => {
            eid("fps").innerText = FpsMeter.#fpsm.cntn();
        });

    static #fps(){
        FpsMeter.#fpsm.add();
        if(FpsMeter.#prevfps !== FpsMeter.#fpsm.cntn()){
            FpsMeter.#dispfps.fire();
            FpsMeter.#prevfps = FpsMeter.#fpsm.cntn();
            FpsMeter.#maxfps = max(FpsMeter.#maxfps, FpsMeter.#prevfps);
            // log(typeof prevfps, typeof fpsm.cntn());
        }
        window.requestAnimationFrame(FpsMeter.#fps);
    }

    static init(){
        if(!eid("fps")) appdoc(mk("div", 
            {id: "fps", style: `position: fixed; bottom: 4px; left: 0; z-index: 3; pointer-events: none;
                    text-shadow: .05em .05em 0px var(--theme-light);`}));
        window.requestAnimationFrame(FpsMeter.#fps);
    }

    static get maxfps(){
        return FpsMeter.#maxfps;
    }
    static currfps(){
        return FpsMeter.#fpsm.cntn();
    }
}
class KeySetSide{

    static #keyset = null;
    static #defaultwindow = 600;
    static #kps = new PerSec(KeySetSide.#defaultwindow);

    static init(){
        if(!eid("keyset")){
            appdoc(mk("div", {id: "keyset"}));
            styling(`
#keyset{
    position: fixed;
    z-index: 1;
    left: 0;
    top: var(--header-height);
    /* width: 1ch; */
    display: flex;
    flex-direction: column;
    >p{
        animation: pop-in 0.15s forwards;
    }
}
@keyframes pop-in{
    0%{
        transform: translate(-100%, 0);
        rotate: -25deg;
    }
    35%{
        margin-left: 1ch;
        transform: translate(.35ch, 0);
        rotate: 15deg;
    }
    100%{
        transform: translate(0, 0);
        rotate: 0deg;
    }
}    
`);
        }
        KeySetSide.#keyset = eid("keyset");

        KeySet.init();
        KeySet.onnewkey = (key) => {
            KeySetSide.#kps.add();
            const keyel = p(key.key, {"data-key": key.ekey, 
                style: `font-size: ${sqrt(KeySetSide.#kps.cntn())}ch;` });
            keyel.style.animationTimingFunction = `cubic-bezier(1,${pow(1.5, 
                min(10, sqrt(KeySetSide.#kps.cntn())))},0.45,1.25)`;

            app(KeySetSide.#keyset, keyel);
        }
        KeySet.onoofkey = (key) => {
            setTimeout(() => {
                const el = eq(`#keyset>[data-key="${key.ekey}"]`);
                    if(el) el.remove()
            }, 50);
        }
    }
}

class ScrollProgress{
    static #bar = null;
    static #trigger = null;
    static #containerlimiterid = null;

    static init(containerlimiterid = "none"){
        if(containerlimiterid === "none"){
            throw new Error("need id thingy");
        }
        ScrollProgress.#containerlimiterid = containerlimiterid;

        if(!eid("scroll-progress")){
            appdoc(mk("div", {id: "scroll-progress"}));
            styling(`        
#scroll-progress{
    position: fixed;
    z-index: 2;
    bottom: 0;
    left: 0;
    height: 8px;
    background-color: var(--theme-dark);
    --start-width: 100%;
    width: var(--start-width);
    transition: width 0.5s var(--ease-backtrack);
    transform: skew(30deg);
    --speed: 3s;
    &::before, &::after{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: var(--start-width);
    }
    &::before{
        background-color: var(--theme-light-other);
        animation: border-anim-lr var(--speed) var(--ease-more-in) infinite;
    }
    &::after{
        background-color: rgba(var(--theme-light-vals), .5);
        animation: border-anim-rl var(--speed) var(--ease-more-in) infinite;
        animation-delay: calc(var(--speed) * -1 / 4);
        
    }
}`);
        }
        ScrollProgress.#bar = eid("scroll-progress");
        ScrollProgress.#trigger = new MeteredQueueTrigger(70, () => {
            ScrollProgress.#bar.style.width = 
            `${(window.scrollY / 
                (eid(ScrollProgress.#containerlimiterid).offsetHeight - window.innerHeight)) * 100}%`;
        });
        
        window.addEventListener("scroll", () => {
            ScrollProgress.#trigger.fire();
        });
    }

}

class Debug{
    static init(){
        if(!eid("debug")){
            appdoc(mk("div", {id: "debug", style: `
position: fixed;
top: 0; 
left: 0;
font-size: 1.5vh;
background: var(--theme-light-other); 
color: var(--theme-dark-other); 
z-index: 10000;
transition-property: background, color;
transition-duration: .5s;
transition-timing-function: ease-out;
`}));
        }
    }
}

class ThemeSwitch{

    static #switcher = null;
    static #extra = nofunc;
    static #limiter = 250;
    static #triggertheme = new MeteredTrigger(ThemeSwitch.#limiter, (...args) => {
        toggletheme();
        ThemeSwitch.#extra(...args);
    });

    static init(onclick = nofunc, top = "0px"){
        ThemeSwitch.#extra = onclick;
        if(!eid("theme-switch")){
            const ts = fromhtml(`<div id="theme-switch">
    <div class="ts-container">
        <div class="container" id="c-moon" title="clik 4 dark mode">
            <!-- svgs from parkalex.dev -->
            <svg xmlns="http://www.w3.org/2000/svg" id="moon-svg"
                viewBox="0 0 24 24"> 
                <path d="M20.742 13.045a8.088 8.088 0 0 1-2.077.271c-2.135 0-4.14-.83-5.646-2.336a8.025 8.025 0 0 1-2.064-7.723A1 1 0 0 0 9.73 2.034a10.014 10.014 0 0 0-4.489 2.582c-3.898 3.898-3.898 10.243 0 14.143a9.937 9.937 0 0 0 7.072 2.93 9.93 9.93 0 0 0 7.07-2.929 10.007 10.007 0 0 0 2.583-4.491 1.001 1.001 0 0 0-1.224-1.224zm-2.772 4.301a7.947 7.947 0 0 1-5.656 2.343 7.953 7.953 0 0 1-5.658-2.344c-3.118-3.119-3.118-8.195 0-11.314a7.923 7.923 0 0 1 2.06-1.483 10.027 10.027 0 0 0 2.89 7.848 9.972 9.972 0 0 0 7.848 2.891 8.036 8.036 0 0 1-1.484 2.059z">
                </path> 
            </svg>
        </div>
        <div class="container" id="c-sun" title="clickies four light(better) mode">
            <svg xmlns="http://www.w3.org/2000/svg" id="sun-svg"
                viewBox="0 0 24 24"> 
                <path d="M6.993 12c0 2.761 2.246 5.007 5.007 5.007s5.007-2.246 5.007-5.007S14.761 6.993 12 6.993 6.993 9.239 6.993 12zM12 8.993c1.658 0 3.007 1.349 3.007 3.007S13.658 15.007 12 15.007 8.993 13.658 8.993 12 10.342 8.993 12 8.993zM10.998 19h2v3h-2zm0-17h2v3h-2zm-9 9h3v2h-3zm17 0h3v2h-3zM4.219 18.363l2.12-2.122 1.415 1.414-2.12 2.122zM16.24 6.344l2.122-2.122 1.414 1.414-2.122 2.122zM6.342 7.759 4.22 5.637l1.415-1.414 2.12 2.122zm13.434 10.605-1.414 1.414-2.122-2.122 1.414-1.414z">
                </path>
            </svg>
        </div>
    </div>
</div>`);
            document.body.prepend(ts);
            styling(`:root.dark #theme-switch{
    rotate: calc( 180deg);
    top: -50px;
    >.ts-container{
        rotate: 180deg;
    }
    &:hover{
        transform: translate(-1vw, 1vh);
        >.ts-container{
            rotate: calc(180deg - 3deg);
        }
    }
}

#theme-switch{
    /* --scale: 3; scale blurs out the svg */
    --slant: 15deg;
    --speed: .75s;
    position: fixed;
    z-index: 2;
    /*top: calc(50px + var(--header-height)); 2em (h1) + 0.67em from margin-block-startend  user-stylesheet*/
    top: calc(50px + ${top});
    right: 0px;
    transform-origin: -50vw 50svh; /* OH MY GOD THANK YOU LORD AND SAVIOR DVH CHROSIST OMG */
    /* nvm dvh is like really laggy lol */
    transition: var(--speed) var(--ease-backtrack);
    transition-property: rotate, transform, top, right;
    width: 0;
    height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    >.ts-container{
        background-color: var(--theme-light-other);
        transition-property: background-color, rotate;
        transition-duration: 2.65s, var(--speed);
        transition-timing-function: var(--ease-more-in), var(--ease-backtrack);
        display: flex;
        flex-direction: row;
        transform: skew(var(--slant));
        &::before, &::after{
            content: '';
            position: absolute;
            background-color: rgb(var(--theme-light-other-vals), 0.25);
            mix-blend-mode: plus-lighter;
            height: 4px;
            --speed: 10s;
        }
        &::before{
            bottom: 0;
            left: 0;
            height: 100%;
            animation: border-anim-lr var(--speed) linear infinite;
        }
        &::after{
            bottom: 0;
            left: 0;
            animation: border-anim-bt var(--speed) linear infinite;
            width: 100%;
            animation-delay: calc(var(--speed) * -1 / 4);
        }
        
    }
    >.ts-container>.container{
        height:100px;
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: skew(calc(-1 * var(--slant)));
        >svg{
            animation: rotate-full 2s ease-in-out infinite;
            transform-origin: 50% 50%;
            transition: 1.6s var(--ease-backtrack);
            transition-property: rotate, filter;
            /* scale: var(--scale); */
            fill: var(--theme-dark-other);
            height: 72px;
            width:  72px;
            /* Ensure the SVG viewBox matches the aspect ratio and size in your HTML:
            <svg viewBox="0 0 24 24" ...> for a 1:1 ratio */
        
            filter: drop-shadow(0px 0px 2px var(--theme-dark-other));
        }
        #sun-svg{
            animation-direction: reverse;
        }
    }
}

#theme-switch:hover{
    cursor: pointer;
    transform: translate(-1vw, 1vh);
    >.ts-container{
        rotate: -3deg;
        >.container>svg{
            animation-play-state: paused !important;
            rotate: 270deg;
            &#sun-svg{
                rotate: -270deg;
            }
            filter: drop-shadow(0px 0px 4px var(--theme-dark-other));
        }
    }
}
@keyframes theme-glow{
    0%{
        filter: drop-shadow(0px 0px 1px var(--theme-dark-other));
    }
    25%{
        filter: drop-shadow(0px 0px 2px var(--theme-dark-other));
    }
    100%{
        filter: drop-shadow(0px 0px 1px var(--theme-dark-other));
    }
}
@keyframes rotate-full{
    0%{
        transform: rotate(0deg);
    }
    100%{
        transform: rotate(360deg);
    }
    
}`);
        }
        ThemeSwitch.#switcher = eid("theme-switch");

        ThemeSwitch.#switcher.onclick = () => 
            ThemeSwitch.#triggertheme.fire();
    }
    static fire(){
        if(!ThemeSwitch.#switcher) return;
        ThemeSwitch.#triggertheme.fire();
    }
}