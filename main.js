import { Color } from "./files/color.js";
import { Ani } from "./files/animation3.js";

function log(str){
    const e = document.createElement("p");
    e.innerHTML = str;
    document.getElementById("log").appendChild(e);
}

const button = document.getElementById("mode-swap");
button.style.rotate = "0deg";
document.querySelectorAll("div").forEach((div) => {
    div.style.rotate = "0deg";
    console.error("yay")
});

button.addEventListener("click", () => {
    new Ani("svg").then(()=>{
        document.querySelectorAll("svg").forEach((svg) => {
            svg.style.rotate = "0deg";
        });
    }).rule({
        from: [{rotate: "0deg"}],
        to: [{rotate: "1000deg"}],
        duration: 300,
        easing: "ease-out",
        forwards: true,
        additive: [true, true],
    }).then(() => {
        // button.style.rotate = "180deg";
    }, 0).rule({
        from:[{rotate: "0deg"}],
        to:[{rotate: "0deg"}],
        duration: 600,
        easing: "ease-in-out",
        forwards: true,
        additive: [true, false],
    });

});


// button.addEventListener("click", () => {
//     new Ani("#mode-swap").then(()=>{
//         button.style.rotate = "1987983deg";
//         console.error("HEY")
//     }).rule({
//         from: [{rotate: "0deg", height: "0px", width: "0px"}],
//         to: [{rotate: "180deg", height: "0px", width: "0px"}],
//         duration: 300,
//         easing: "ease-out",
//         forwards: true,
//         additive: [true, true],
//     }).then(() => {
//         // log("WOO");
//     }, 0).rule({
//         from:[{rotate: "0deg"}],
//         to:[{rotate: "0deg"}],
//         duration: 600,
//         easing: "ease-in-out",
//         forwards: false,
//         additive: [true, false],
//     }).finish();
// });
    // .rule({
    //     from: [{rotate: "0deg"}],
    //     to: [{rotate: "0deg"}],
    //     duration: 600,
    //     easing: "ease-in-out",
    //     forwards: false,
    //     additive: [true, false],
    // })
    
// new Ani("div").rule({
//     from: [{rotate: "0deg"}],
//     to: [{rotate: "180deg"}],
//     duration: 0,
//     easing: "ease-in-out",
//     forwards: true,
//     additive: [true, true],
// }).rule({
//     from: [{rotate: "1803deg"}],
//     to: [{rotate: "0deg"}],
//     duration: 1000,
//     easing: "ease-in-out",
//     additive: [true, true],
// }).rule({
//     from:[{rotate: "11deg"}],
//     to:[{rotate: "0deg"}],
//     duration: 3000,
//     easing: "ease-in-out",
//     forwards: true,
//     additive: [true, false],
// })
