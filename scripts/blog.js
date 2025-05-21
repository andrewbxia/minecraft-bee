// blog
const pagepostlimit = pagelimit;
let pageidx = nullnum(pint(params.get("page")));
let postid =  nullnum(pint(params.get("post")));


const posts = [];

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

function clearblog(){
    log("clearing blog");
    eqa("#blog>*:not(#post-0), #blog-nav").forEach(el => el.remove());
}

function addpost(postsidx){
    // log(postsidx);
    const post = posts[postsidx];
    const postel = generatepost(post);
    
    app(eid("blog"), postel);
}

function dispposts(){
    for(let i = 0; i < posts.length; i++){
        addpost(i);
    }
}


function generatepost(post){
    const id = post.id || 0;
    const title = post.title || "TITLE";
    const desc = post.description || "DESC";
    const tags = post.tags || ["omg", "wow", "amazin"];
    const created = new Date(post.created_at) || new Date(0);
    const edited = new Date(post.edited_at) || new Date(0);
    // log(created.getTime(), edited.getTime(), edited);
    const cover = post.cover_url;
    const content = post.content || "AMAZING CONTENT";
    
    const postel = mk("article", {class: "post", "data-id": id, id: `post-${id}`});
    const posth = mk("center", {class: "post-header", title: title});
    const postc = mktxt("p", content, {class: "post-content"});
    const postt = app(mk("h2", {class: "post-title"}), link(`?post=${id}`, title, "_self"));
    app(posth, postt);
    app(posth, mktxt("h3", desc, {class: "post-subtitle"}));
    const misc = mk("span", {class: "post-misc"});

    const dayms = 1000*60*60*24;
    const hasedited = (created.getTime() + dayms / 2) < edited.getTime();
    const datestr = created.toDateString() + (hasedited ? ` (${edited.toDateString()})` : "");
    appmany(misc, 
        [p(datestr), p(`${tags.join(" · ")}`)]
    );
    
    app(posth, misc);
    app(postel, posth);
    app(postel, postc);
    return postel;
}


// todo: create blogwriting system that mimics helper.js functions so i dont have
// to write fully in html wow :o
/*
like:

text text yap yap yap

para(text yap yap yap

wowwwooiejfiejfiejfeifjei

)
para(text yap yap yap)

would be: 
||||||||||||||||||||||||||||||||||||||||
<article>
text text yap yap yap

<p>text yap yap yap

wowwwooiejfiejfiejfeifjei

</p>
<p>text yap yap yap</p>




</article>


*/

let viewingmode = "page";


// pages ordered by descending id so flip ur head
function blogislast(){
    if(viewingmode === "post"){
        return postid === lastpostid;
    }
    else{
        return pageidx === 0;
    }
}
function blogisfirst(){
    if(viewingmode === "post"){
        return postid === minpostid;
    }
    else{
        return pageidx === floor((lastpostid - 1) / pagepostlimit);
    }
}
function placenav(){
        const nav = mk("nav", {id: "blog-nav"});
        const previous = mk("button", {id: "blog-previous"});
        const next = mk("button", {id: "blog-next"});
        if(!blogisfirst()){
            previous.innerText = `<<< older ${viewingmode}s`;
            previous.onclick = () => displayblog("previous");
        }
        if(!blogislast()){
            next.innerText = `fresher ${viewingmode}s >>>`;
            next.onclick = () => displayblog("next");
        }

        app(eid("blog"), appmany(nav, [previous, next]));
}


let editorinit = false;
eid("blog").innerHTML = "";
if(pageidx === null && postid === null)
    pageidx = 0;
if(pageidx === null)
    viewingmode = "post";

function displayblog(change = "none"){

    if(change !== "none")
        posts.length = 0;

    if(change === "previous"){
        if(blogisfirst()){
            throw new Error(`cant no more ${viewingmode} boi`);
        }
        if(viewingmode === "post"){
            postid--;
        }
        else{
            pageidx++;
        }
    }
    else if(change === "next"){
        if(blogislast()){
            throw new Error(`cant no more ${viewingmode} boi`);
        }
        if(viewingmode === "post"){
            postid++;
        }
        else{
            pageidx--;
        }
    }
    params.set(viewingmode, viewingmode === "post" ? postid : pageidx);


    clearblog();
    (viewingmode === "post" ? getpost(postid) : getpage(pageidx)).then(data => {
        posts.push(...data);
        dispposts();
        // window.location.href = "#blog";
        if(viewingmode === "post")
            window.location.href = `#post-${postid}`;
        // else if(viewingmode === "page")
        //     window.location.href = `#post-${posts[0].id}`;
        if(lastpostid === null){
            numposts().then(() => {
                placenav();
            });
        }
        else{
            placenav();
        }

    }).catch(error => {
        err(error);
        eid("blog").innerHTML += `<center>posts didnt load...maybe ${mkhtml("a", "reload?", {href: ""}) }
        <br>.₊̣̇.ಇ/ᐠˬ ͜   ˬ ᐟ\∫.₊̣̇.</center>`;
    }).finally(() => {
        if(params.has("b-edit") && !editorinit){
            script("./scripts/blog-editor.js", true);
            editorinit = true;
        }
    });
}


displayblog("none");