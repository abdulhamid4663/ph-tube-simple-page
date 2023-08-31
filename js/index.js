const loadCategories = async (isSorted) => { // Load Categories Data
    const res = await fetch('https://openapi.programming-hero.com/api/videos/categories');
    const data = await res.json();
    const categories = data.data;

    showCategories(categories, isSorted);
};

const showCategories = (categories, isSorted) => { // Show Categories Data
    const categoriesContainer = document.getElementById('categories-container');
    categoriesContainer.textContent = '';

    categories.forEach(category => { // Each Category Data
        const newDiv = document.createElement('div');
        newDiv.innerHTML = `
            <button onclick="loadVideosData('${category.category_id}', '${isSorted}')" class="btn text-lg font-medium text-[#252525B2] normal-case">${category.category}</button>
            `;
        categoriesContainer.appendChild(newDiv);
    });
};

const loadVideosData = async (videosId, isSorted) => { // Load Videos Data
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${videosId}`);
    const data = await res.json();
    let videos = data.data;

    if (isSorted === "true") {
        videos = videos.sort((a, b) => parseFloat(b.others.views) - parseFloat(a.others.views));
    };
    
    showVideos(videos);
};

const showVideos = (videos) => { // Show Videos Data
    const videosContainer = document.getElementById('videos-container');
    const errorDiv = document.getElementById('errorDiv'); 

    if (videos.length === 0) {
        errorDiv.classList.add('flex');
        errorDiv.classList.remove('hidden');
    } else {
        errorDiv.classList.add('hidden');
    };

    videosContainer.textContent = "";
    videos.forEach(video => { // Each Videos Data
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
                            ${video?.authors[0]?.verified === false || video?.authors[0]?.verified === "" ? "" : `<p><img src="./images/tickmark.png" class="cursor-pointer"></p>`}
                        </div>
                        <p class="text-sm font-normal text-[#171717B2] pt-2">${video?.others?.views} views</p>
                    </div>
                </div>
            </div>
        `;
        videosContainer.appendChild(newDiv);
    });
};

const sortByView = () => {
    loadCategories(true);
};

const showBlogModal = () => {
    my_modal_1.showModal()
};

loadCategories();
loadVideosData("1000");