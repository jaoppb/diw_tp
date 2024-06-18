import GithubAPIService from "../../services/github.js";

const repoName = new URLSearchParams(window.location.search).get("name");
const githubAPIService = new GithubAPIService();

async function loadInfo() {
    document.querySelector("#profile-name")
        .innerText = githubAPIService.getUserName();

    const name = document.querySelector("#repo-name");
    const description = document.querySelector("#repo-description");
    const creationDate = document.querySelector("#creation-date");
    const language = document.querySelector("#language");
    const license = document.querySelector("#license");
    const link = document.querySelector("#repo-link");
    const topics = document.querySelector("#topics");
    const numbers = document.querySelector("#numbers-info");

    const repoInfo = await githubAPIService.getRepo(repoName);
    name.innerText = repoInfo.name;
    description.innerText = repoInfo.description;

    const date = new Date(repoInfo.created_at);
    creationDate.innerText = date.toLocaleDateString();

    language.innerText = repoInfo.language;
    license.innerText = repoInfo.license.name;

    link.target = "_blank";
    link.href = link.innerText = repoInfo.html_url;

    repoInfo.topics.forEach(topic => {
        const element = document.createElement("span");
        element.classList.add("badge", "text-bg-secondary");
        element.innerText = topic;
        topics.appendChild(element);
    });

    let star, watchers, forks;
    if(repoInfo.stargazers_count > 0) {
        star = document.createElement("a");
        star.classList.add("text-decoration-none", "me-2");
        star.target = "_blank";
        star.href = `${repoInfo.html_url}/stargazers`;
    } else {
        star = document.createElement("span");
        star.classList.add("text-muted", "me-2");
    }

    const starIcon = document.createElement("i");
    starIcon.classList.add("me-1", "fa-regular", "fa-star");
    const starCount = document.createElement("span");
    starCount.innerText = repoInfo.stargazers_count;
    star.append(starIcon, starCount);

    if(repoInfo.watchers_count > 0) {
        watchers = document.createElement("a");
        watchers.classList.add("text-decoration-none", "me-2");
        watchers.target = "_blank";
        watchers.href = `${repoInfo.html_url}/watchers`;
    } else {
        watchers = document.createElement("span");
        watchers.classList.add("text-muted", "me-2");
    }

    const watchersIcon = document.createElement("i");
    watchersIcon.classList.add("me-1", "fa-regular", "fa-eye");
    const watchersCount = document.createElement("span");
    watchersCount.innerText = repoInfo.watchers_count;
    watchers.append(watchersIcon, watchersCount);

    if(repoInfo.forks > 0) {
        forks = document.createElement("a");
        forks.classList.add("text-decoration-none", "me-2");
        forks.target = "_blank";
        forks.href = `${repoInfo.html_url}/watchers`;
    } else {
        forks = document.createElement("span");
        forks.classList.add("text-muted");
    }

    const forksIcon = document.createElement("i");
    forksIcon.classList.add("me-1", "fa-solid", "fa-code-fork");
    const forksCount = document.createElement("span");
    forksCount.innerText = repoInfo.forks;
    forks.append(forksIcon, forksCount);

    numbers.append(star, watchers, forks);
}

window.addEventListener("load", () => {
    loadInfo().then();
});