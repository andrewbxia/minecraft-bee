const supaurl = "https://rvlvbcvqtwmliwwrgqjg.supabase.co";
// i have rls policies enabled, we should be goog goog
const publicanonkey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2bHZiY3ZxdHdtbGl3d3JncWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MDU3MjcsImV4cCI6MjA1NTA4MTcyN30.oysqGbhO9qgDl9RogWjpwAkgY7-letEY_sIR0WYIP4s";
const overviewparameters = [
    "title",
    "id",
    "description",
    "tags",
    "created_at",
    "edited_at",
    "cover_url"
].join(",");
const postparameters = [ "id", "created_at", "edited_at", "content", 
    "cover_url", "title", "tags", "description" ];
const qlimit = 5;
const pagelimit = 3;

async function getpostsoverview(){
    const response = await fetch(`${supaurl}/rest/v1/posts?select=${overviewparameters}&order=created_at.desc&limit=${qlimit}`, {
        headers: {
            apikey: publicanonkey,
            "Authorization": `Bearer ${publicanonkey}`,
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    console.log(data);
    return data;
}

async function getpage(pageidx){
    const response = await fetch(`${supaurl}/rest/v1/posts?order=created_at.desc&limit=${pagelimit}&offset=${pageidx * pagelimit}`, {
        headers: {
            apikey: publicanonkey,
            "Authorization": `Bearer ${publicanonkey}`,
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    console.log(data);
    return data;
}

async function getpost(id){
    const response = await fetch(`${supaurl}/rest/v1/posts?id=eq.${id}`, {
        headers: {
            apikey: publicanonkey,
            "Authorization": `Bearer ${publicanonkey}`,
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    console.log(data);
    return data;
}

async function numposts(){
    const response = await fetch(`${supaurl}/rest/v1/posts?select=id`, {
        headers: {
            apikey: publicanonkey,
            "Authorization": `Bearer ${publicanonkey}`,
            "Content-Type": "application/json",
            "Prefer": "count=exact",
            "Range": "0-0",
        }
    });
    return response.headers.get("Content-Range").split("/")[1];
}

// getpostsoverview().then(posts => {
//     console.log(posts);
// });
