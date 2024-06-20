export default class GithubAPIService {
    constructor() {
        this.urlBase = 'https://api.github.com';
        this.userName = 'kamranahmedse';
        this.headers = {};
        this.ready = false;
        this.readyCallbacks = [];

        fetch("../services/github_token").then(async response => {
            this.token = await response.text();
            this.generateHeaders();
            this.setReady();
        });
    }

    setReady() {
        this.ready = true;
        this.readyCallbacks.forEach(callback => callback());
    }

    whenReady(callback) {
        this.readyCallbacks.push(callback);
    }

    generateHeaders() {
        if(this.token) this.headers['Authorization'] = `Bearer ${this.token}`;
    }

    async getUser() {
        const init = {
            method: "GET",
            headers: this.headers,
        };
        const user = await fetch(`${this.urlBase}/users/${this.userName}`, init);

        if(!user.ok) throw new Error("Falha ao buscar o usuário");

        return user.json();
    }

    async getSocialMedia() {
        const init = {
            method: "GET",
            headers: this.headers
        };
        const socialMedia = await fetch(`${this.urlBase}/users/${this.userName}/social_accounts`);

        if(!socialMedia.ok) throw new Error("Falha ao buscar as redes sociais");

        return socialMedia.json();
    }

    async getRepos(page = 1) {
        const init = {
            method: "GET",
            headers: this.headers,
        };
        const repos = await fetch(`${this.urlBase}/users/${this.userName}/repos?per_page=100&page=${page}&sort=updated`, init);

        if(!repos.ok) throw new Error("Falha ao buscar repositórios");

        return repos.json();
    }

    async getRepo(repoName) {
        const init = {
            method: "GET",
            headers: this.headers,
        }
        const repo = await fetch(`${this.urlBase}/repos/${this.userName}/${repoName}`, init);

        if(!repo.ok) throw new Error("Falha ao buscar o repositório");

        return repo.json();
    }
}