const supaurl = "https://rvlvbcvqtwmliwwrgqjg.supabase.co";
// i have rls policies enabled, we should be goog goog
const publicanonkey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2bHZiY3ZxdHdtbGl3d3JncWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MDU3MjcsImV4cCI6MjA1NTA4MTcyN30.oysqGbhO9qgDl9RogWjpwAkgY7-letEY_sIR0WYIP4s";

async function getpostsoverview(){
    const response = await fetch(`${supaurl}/rest/v1/posts?select=title,id,description,tags,created_at,cover_url&order=created_at.desc&limit=5`, {
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

// getpostsoverview().then(posts => {
//     console.log(posts);
// });
