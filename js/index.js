async function loadCategories() {
    const res = await fetch('https://openapi.programming-hero.com/api/videos/categories');
    const data = await res.json();
    const categories = data.data;

    return categories;
}

async function loadCategoriesList(categoryId) {
    const videosList = await loadVideosData(categoryId);
    showVideos(videosList)
}

async function loadVideosData(categoryId) {
    const sortBtn = document.querySelector("#sortBtn");
    sortBtn.value = categoryId;
    
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`);
    const data = await res.json();
    const videos = data.data;
    
    return videos;
}

async function sortList(categoryId){
    const videos = await loadVideosData(categoryId);
    const sortedVideosList = videos.sort((a,b) => parseFloat(b.others.views) - parseFloat(a.others.views) )
    
    showVideos(sortedVideosList)
}

async function showVideos(videos){
    const videosContainer = document.getElementById('videos-container')
    videosContainer.textContent = "";

    const errorDiv = document.getElementById('errorDiv');
    videos.length === 0 ? errorDiv.classList.remove('hidden') : errorDiv.classList.add('hidden')

    videos.forEach(video => {
        const newDiv = document.createElement('div');

        const seconds = Number.parseInt(video?.others?.posted_date);
        const toMinutes = seconds / 60;
        const minutesFormat = Number.parseInt(toMinutes % 60);
        const hoursFormat = Number.parseInt(toMinutes / 60);

        newDiv.innerHTML = `
            <div class="card-compact">
                <figure class="relative">
                    <img src="${video?.thumbnail ? video.thumbnail : "No thumbnail available."}" alt="${video?.title}" class=" w-full h-[14.6875rem] rounded-xl cursor-pointer"/>
                    ${video.others.posted_date ? `<h1 class="bg-[#171717] text-white text-[0.625rem] font-normal absolute bottom-2 right-3 p-1 rounded-md cursor-pointer">${hoursFormat}h ${minutesFormat}m ago</h1>` : ""}
                </figure>
                <div class="flex pt-5 gap-3 ">
                    <img src="${video?.authors[0]?.profile_picture}" alt="${video?.title}" class=" w-10 h-10 rounded-full cursor-pointer" />
                    <div>
                        <h2 class="card-title text-base font-bold text-[#171717] cursor-pointer">${video?.title ? video.title : ""}</h2>
                        <div class="flex gap-2 items-center">
                            <a class="link link-hover text-sm font-normal text-[#171717B2]">${video.authors[0].profile_name}</a>
                            ${video?.authors[0]?.verified === false || video?.authors[0]?.verified === "" ? "" : `<p><img src="./images/tick-mark.png" class="cursor-pointer"></p>`}
                        </div>
                        <p class="text-sm font-normal text-[#171717B2] pt-2">${video?.others?.views} views</p>
                    </div>
                </div>
            </div>
        `;
        videosContainer.appendChild(newDiv);
    });
}

async function renderData() {
    const categories = await loadCategories();

    const categoriesContainer = document.getElementById('categories-container');

    categories.forEach(category => {
        const newDiv = document.createElement('div');
        newDiv.innerHTML = `
            <button onclick="loadCategoriesList('${category.category_id}')" class="btn text-lg font-medium text-[#252525B2] normal-case">${category.category}</button>
            `;
        categoriesContainer.appendChild(newDiv);
    });

    const videoList = await loadVideosData(categories[0].category_id)
    showVideos(videoList)
}

function showBlogModal(){
    my_modal_1.showModal()
}
renderData()