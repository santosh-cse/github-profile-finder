const historyContainer = document.querySelector("#history");
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
<div class="flex flex-col items-center justify-center py-16">

    <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

    <p class="mt-6 text-xl text-slate-300">
        Fetching GitHub Profile...
    </p>

</div>
`;
searchBtn.disabled = true;
searchBtn.textContent = "searching...";
searchBtn.classList.add("opacity-50","cursor-not-allowed");


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
                    <span class="bg-slate-700 px-4 py-2 rounded-full">
                        📅 Joined : ${new Date(data.created_at).toLocaleDateString("en-GB")}
                    </span>

                </div>
                   <a
                      href="${data.html_url}"
                          target="_blank"
                          class="inline-block mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition"
                             >
                              🔗 View GitHub Profile
                    </a>
            </div>

        </div>
        `;
        searchBtn.disabled = false;
        searchBtn.textContent = "Search";
        searchBtn.classList.remove("opacity-50","cursor-not-allowed");

        saveHistory(user);
        getRepos(user);

    } catch (error) {

        profileCard.innerHTML = `
    <div class="flex flex-col items-center justify-center py-16">

        <div class="text-7xl mb-4">😕</div>

        <h2 class="text-3xl font-bold text-red-500">
            User Not Found
        </h2>

        <p class="text-slate-400 mt-4 text-center">
            We couldn't find the GitHub user you're looking for.
            <br>
            Please check the username and try again.
        </p>

    </div>
    `;
    searchBtn.disabled = false;
    searchBtn.textContent = "Search";
    searchBtn.classList.remove("opacity-50","cursor-not-allowed");

        followers.textContent = "0";
        following.textContent = "0";
        repos.textContent = "0";
        gists.textContent = "0";

        repoContainer.innerHTML = "";
    }

}
  function saveHistory(user) {

    let users = JSON.parse(localStorage.getItem("history")) || [];

    users = users.filter((item) => item !== user);
    

    users.unshift(user);
    users = users.slice(0,5);

    localStorage.setItem("history",JSON.stringify(users));

    console.log(users);
    showHistory();

}
  function showHistory() {

    const users = JSON.parse(localStorage.getItem("history")) || [];

    historyContainer.innerHTML = "";

    users.forEach((user) => {

        historyContainer.innerHTML += `
            <button
                onclick="searchHistory('${user}')"
                class="bg-slate-700 hover:bg-blue-600 px-4 py-2 rounded-full transition"
              >
                ${user}
            </button>
        `;

    });

}

async function getRepos(user) {

    const response = await fetch(`https://api.github.com/users/${user}/repos?sort=updated`);

    const repos = await response.json();

    repoContainer.innerHTML = "";

    repos.slice(0, 6).forEach((repo) => {

        repoContainer.innerHTML += `
<a
    href="${repo.html_url}"
    target="_blank"
    class="block bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-blue-500 hover:scale-105 transition duration-300"
>

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
        </a>
        `;
    });

}

showHistory();