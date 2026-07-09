const videoSections = document.querySelector('.yt');

fetch(' https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=UU9vEpC13F0cnGN8jNvoSGPA&key=AIzaSyCNJY3B-JMZLGkIysS1GBES3XE216A5Jk8')
.then(res => res.json())
.then(data=>{
    data.items.forEach(el =>{
        videoSections.innerHTML += `<a  target="_blank" href="https://www.youtube.com/watch?v=${el.snippet.resourceId.videoId}" class="yt-video">
        <img src="${el.snippet.thumbnails.maxres.url}" />
        <h3> ${el.snippet.title}</h3>
        </a>`
    });
}).catch(err =>{
    console.log(err)
    videoSections.innerHTML = "<h3> Sorry something went wrong, try again later</h3>"
});