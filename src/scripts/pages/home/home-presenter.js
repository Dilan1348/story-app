import { ACCESS_TOKEN_KEY } from '../../config';

export default class HomePresenter {
    #model;
    #view;

    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }

    async init() {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        const app = document.getElementById('main-content');

        if (!token) {
            app.innerHTML = '<p class="container">Login untuk melihat story. <a href="#/login"><b>login</b></a></p>';
            return;
        }
        try {
            const stories = await this.#model.getAllStories();
            this.#view.showStories(stories);
        } catch (err) {
            app.innerHTML = `<p class="container">Gagal memuat cerita: ${err.message}</p>`;
        }
    }
}