export default class JSONServerService {
    constructor() {
        this.baseURL = "http://localhost:3000";
    }

    async getSuggestions() {
        const suggestions = await fetch(`${this.baseURL}/suggestions`);

        if(!suggestions.ok) throw new Error("Erro ao buscar as sugestões");

        return suggestions.json();
    }

    async getCoworkers() {
        const coworkers = await fetch(`${this.baseURL}/coworkers`);

        if(!coworkers.ok) throw new Error("Erro ao buscar os colegas de trabalho");

        return coworkers.json();
    }
}