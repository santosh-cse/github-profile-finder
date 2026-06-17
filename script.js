const username = document.querySelector(".username");
const searchBtn = document.querySelector(".searchBtn");
const profileCard = document.querySelector("#profileCard");
const repoContainer = document.querySelector("#repoContainer");
const followers = document.querySelector("#followers");
const following = document.querySelector("#following");
const repos = document.querySelector("#repos");
const gists = document.querySelector("#gists");

searchBtn.addEventListener("click", () => {
    const user = username.value.trim();

    if (user === "") {
        alert("Please enter username");
        return;
    }

    getUser(user);
});

username.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

async function getUser(user) {

    profileCard.innerHTML = `
        <h2 class="text-center text-2xl">Loading...</h2>
    `;

    repoContainer.innerHTML = "";

    try {

        const response = await fetch(`https://api.github.com/users/${user}`);

        if (!response.ok) {
            throw new Error("User Not Found");
        }

        const data = await response.json();
        followers.textContent = data.followers;
        following.textContent = data.following;
        repos.textContent = data.public_repos;
        gists.textContent = data.public_gists;

        profileCard.innerHTML = `
        <div class="flex flex-col md:flex-row gap-8 items-center">

            <img src="${data.avatar_url}"
            class="w-40 h-40 rounded-full border-4 border-blue-500">

            <div class="flex-1">

                <h2 class="text-3xl font-bold">
                    ${data.name || "No Name"}
                </h2>

                <p class="text-blue-400 text-lg">
                    @${data.login}
                </p>

                <p class="text-slate-300 mt-5">
                    ${data.bio || "No Bio Available"}
                </p>

                <div class="flex flex-wrap gap-4 mt-6">

                    <span class="bg-slate-700 px-4 py-2 rounded-full">
                        📍 ${data.location || "Unknown"}
                    </span>

                    <span class="bg-slate-700 px-4 py-2 rounded-full">
                        👥 Followers : ${data.followers}
                    </span>

                    <span class="bg-slate-700 px-4 py-2 rounded-full">
                        ➡ Following : ${data.following}
                    </span>

                    <span class="bg-slate-700 px-4 py-2 rounded-full">
                        📦 Repositories : ${data.public_repos}
                    </span>

                </div>

            </div>

        </div>
        `;

        getRepos(user);

    } catch (error) {

        profileCard.innerHTML = `
        <h2 class="text-center text-red-500 text-3xl">
            User Not Found
        </h2>
        `;
    }

}

async function getRepos(user) {

    const response = await fetch(`https://api.github.com/users/${user}/repos?sort=updated`);

    const repos = await response.json();

    repoContainer.innerHTML = "";

    repos.slice(0, 6).forEach((repo) => {

        repoContainer.innerHTML += `
        <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-blue-500 transition">

            <h3 class="text-xl font-semibold">
                ${repo.name}
            </h3>

            <p class="text-slate-400 mt-3">
                ${repo.description || "No description available"}
            </p>

            <div class="flex justify-between mt-6">

                <span class="text-yellow-400">
                    ⭐ ${repo.stargazers_count}
                </span>

                <span class="text-green-400">
                    ${repo.language || "Unknown"}
                </span>

            </div>

        </div>
        `;
    });

}