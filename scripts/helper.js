const eid = (id) => document.getElementById(id);
const eq = (query) => document.querySelector(query);
const eqa = (query) => document.querySelectorAll(query);
const log = (message) => console.log(message);
const err = (message) => console.error(message);

function max(a, b){
    if(typeof a !== typeof b) console.warn("types not same");
    return a > b ? a : b;
}
function min(a, b){
    if(typeof a !== typeof b) console.warn("types not same");
    return a < b ? a : b;
}
const floor = (a) => Math.floor(a);
const ceil = (a) => Math.ceil(a);


const params = new URLSearchParams(window.location.search);
document.addEventListener("DOMContentLoaded", function(){
    eqa("iframe").forEach(iframe => {
        iframe.onload = function() {
            
            // set the height of the iframe as 
            // the height of the iframe content
            iframe.style.height = iframe.contentWindow.document.body.scrollHeight +'px';
            iframe.contentWindow.document.addEventListener("googies_loaed", () => {
                iframe.style.height = iframe.contentWindow.document.body.scrollHeight +'px';
                iframe.parentNode.style.height = iframe.contentWindow.document.body.scrollHeight +'px';
                // iframe.style.width  = iframe.contentWindow.document.body.scrollWidth + 15 + 'px';

            });
            // iframe.style.height = "196px";
            // set the width of the iframe as the 
            // width of the iframe content
            // iframe.style.width  = iframe.contentWindow.document.body.scrollWidth + 15 + 'px';
        }
    });
});

function addclicklistener(query, callback){
    document.addEventListener("click", (e) => {
        if(e.target.matches(query)){
            callback(e);
        }
    })
}


function link(url, txt, target = "_blank", attr = {}){
    const attributes = Object.entries(attr).map(([key, value]) => `${key}="${value}"`).join(" ");
    return `<a href="${url}" target="${target}" ${attributes}>${txt === "" ? url : txt}</a>`;
};