import GithubAPIService from "../../services/github.js";

const githubAPIService = new GithubAPIService();

async function load() {
    const headerName         = document.querySelector("header .name");

    const profilePicture     = document.querySelector("#profile .picture");
    const profileName        = document.querySelector("#profile .name");
    const profileDescription = document.querySelector("#bio");
    const profileLocation    = document.querySelector("#location");
    const profileSite        = document.querySelector("#site");
    const profileFollowers   = document.querySelector("#followers-link");

    const repoQuantity       = document.querySelector("#repo .quantity");

    const repoSection = document.querySelector("#repo > div:nth-child(2)");

    githubAPIService.getUser(true).then(userData => {
        console.log(userData);

        headerName.innerText = userData.name;

        profilePicture.src = userData.avatar_url;
        profileName.innerText = `${userData.login} (${userData.name})`;
        if(userData.bio) profileDescription.innerText = userData.bio;
        if(userData.location) profileLocation.innerText = userData.location;
        if(userData.blog) profileSite.innerText = profileSite.href = userData.blog;
        profileFollowers.href = `${userData.html_url}?tab=followers`;
        profileFollowers.children[1].innerText = userData.followers;

        repoQuantity.innerText = userData.public_repos;

        let repos = [], offset = 0, batch = 40;
        getRepos(userData.public_repos, repos).then(() => {
            loadRepos(repoSection, repos.splice(offset, offset + batch));
            offset += batch;
            function scrollHandler() {
                const multiplier = repoSection.offsetWidth / repoSection.children[0]?.offsetWidth;
                if(repoSection.scrollTop / repoSection.children[0]?.offsetHeight * multiplier > offset / multiplier) {
                    loadRepos(repoSection, repos.splice(offset, offset + batch));
                    offset += batch;
                    if(offset >= repos.length) repoSection.removeEventListener("scroll", scrollHandler);
                }
            }
            repoSection.addEventListener("scroll", scrollHandler);
        });
    }).catch(err => alert(err.message));
}

async function getRepos(total, repos = [], page = 1) {
    const reposData = await githubAPIService.getRepos(page, true);
    total -= reposData.length;
    repos.push(...reposData);
    return total > 0 ? getRepos(total, repos, page + 1).catch(err => alert(err.message)) : true;
}

async function loadRepos(reposHolder, reposData) {
    for(const repo of reposData) {
        const cardWrapper = document.createElement("div");
        cardWrapper.classList.add("col", "col-12", "col-md-6", "col-xl-4", "col-xxl-3");

        const card = document.createElement("div");
        card.classList.add("card", "h-100");

        cardWrapper.appendChild(card);

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body", "d-flex", "flex-column", "justify-content-between");
        card.appendChild(cardBody);

        const cardTop = document.createElement("div");

        const cardTitle = document.createElement("h3");
        const cardLink = document.createElement("a");
        cardLink.href = `./repo.html?name=${repo.name}`;
        cardLink.innerText = repo.name;
        cardTitle.append(cardLink);

        cardTop.appendChild(cardTitle);

        if(repo.fork) {
            const cardSubTitle = document.createElement("h4");
            cardSubTitle.classList.add("fs-6", "card-subtitle", "mb-3", "text-truncate");
            cardSubTitle.innerText = "Forked from ";

            const cardForkLink = document.createElement("a");
            cardForkLink.target = "_blank";
            cardSubTitle.appendChild(cardForkLink);

            githubAPIService.getRepo(repo.name).then(repoFull => {
                cardForkLink.innerText = repoFull.parent.full_name;
            }).catch(err => {});
        }

        const cardDescription = document.createElement("p");
        cardDescription.classList.add("card-text");
        cardDescription.innerText = repo.description;

        const cardBottom = document.createElement("div");
        cardBottom.classList.add("mt-2", "fs-5");

        let cardStar, cardWatchers, cardForks;
        if(repo.stargazers_count > 0) {
            cardStar = document.createElement("a");
            cardStar.classList.add("text-decoration-none", "me-2");
            cardStar.target = "_blank";
            cardStar.href = `${repo.html_url}/stargazers`;
        } else {
            cardStar = document.createElement("span");
            cardStar.classList.add("text-muted", "me-2");
        }

        const cardStarIcon = document.createElement("i");
        cardStarIcon.classList.add("me-1", "fa-regular", "fa-star");
        const cardStarCount = document.createElement("span");
        cardStarCount.innerText = repo.stargazers_count;
        cardStar.append(cardStarIcon, cardStarCount);

        if(repo.watchers_count > 0) {
            cardWatchers = document.createElement("a");
            cardWatchers.classList.add("text-decoration-none", "me-2");
            cardWatchers.target = "_blank";
            cardWatchers.href = `${repo.html_url}/watchers`;
        } else {
            cardWatchers = document.createElement("span");
            cardWatchers.classList.add("text-muted", "me-2");
        }

        const cardWatchersIcon = document.createElement("i");
        cardWatchersIcon.classList.add("me-1", "fa-regular", "fa-eye");
        const cardWatchersCount = document.createElement("span");
        cardWatchersCount.innerText = repo.watchers_count;
        cardWatchers.append(cardWatchersIcon, cardWatchersCount);

        if(repo.forks > 0) {
            cardForks = document.createElement("a");
            cardForks.classList.add("text-decoration-none", "me-2");
            cardForks.target = "_blank";
            cardForks.href = `${repo.html_url}/watchers`;
        } else {
            cardForks = document.createElement("span");
            cardForks.classList.add("text-muted");
        }

        const cardForksIcon = document.createElement("i");
        cardForksIcon.classList.add("me-1", "fa-regular", "fa-eye");
        const cardForksCount = document.createElement("span");
        cardForksCount.innerText = repo.forks;
        cardForks.append(cardForksIcon, cardForksCount);

        cardBottom.append(cardStar, cardWatchers, cardForks);
        cardBody.append(cardTop, cardBottom);
        reposHolder.appendChild(cardWrapper);
    }
}

window.addEventListener("load", () => {
    if(!githubAPIService.ready) githubAPIService.whenReady(load);
    load().then();
});