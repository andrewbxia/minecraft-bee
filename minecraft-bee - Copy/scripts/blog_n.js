



// blog
const blogpagelimit = 3;
let pageidx = nullnum(pint(params.get("pg")));
let postid =  nullnum(pint(params.get("id")));
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

function dispposts(){
    for(let i = 0; i < posts.length; i++){
        addpost(i);
    }
}

function generatepost(post){
    const id = post.id;
    const title = post.title;
    const desc = post.description;
    const tags = post.tags;
    const created = new Date(post.created_at);
    const edited = new Date(post.edited_at);
    const cover = post.cover_url;
    const content = post.content;
    log(content)
    
    const postel = mk("article", {class: "post", title: title, "data-id": id, id: `post-${id}`});
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
    return postel;
}

function addpost(postsidx){
    log(postsidx);
    const post = posts[postsidx];
    const postel = generatepost(post);
    
    app(eid("blog"), postel);
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

//todo: maybe make this handle n images instead of 4 with programatic css

if(params.has("b-edit")) script("./scripts/blog-editor.js", true);

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
