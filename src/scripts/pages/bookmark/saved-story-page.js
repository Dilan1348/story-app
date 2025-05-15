import { generateStoryTemplate } from '../../template.js'
import Database from '../../data/database';
import SavedPresenter from './saved-story-presenter.js';

export default class SavedPage {
    #presenter = null;

    async render() {
        return `
        <section class="saved-page-container">
            <h1>Story Tersimpan</h1>
            <div id="saved-story-container" class="saved-story-container"></div>
            </div>
        </section>
        `;
    }

    async afterRender() {
        this.#presenter = new SavedPresenter({
            model: Database,
            view: this,
        });
        await this.#presenter.init();
    };

    showStories(stories) {
        const list = document.getElementById("saved-story-container");
        list.innerHTML = "";

        stories.forEach(story => {
            const storyGroup = generateStoryTemplate({
                id: story.id,
                photoUrl: story.photoUrl,
                name: story.name,
                description: story.description,
                createdAt: story.createdAt,
            });

            const wrapper = document.createElement("div");
            wrapper.innerHTML = storyGroup;
            list.appendChild(wrapper.firstElementChild);
        });
    }
}