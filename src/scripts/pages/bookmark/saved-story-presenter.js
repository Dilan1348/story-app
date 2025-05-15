export default class SavedPresenter {
    #model;
    #view;

    constructor({ model, view }) {
        this.#model = model;
        this.#view = view;
    }

    async init() {
        try {
            const stories = await this.#model.getSavedStories();
            this.#view.showStories(stories);
        } catch (error) {
            console.error('initialGalleryAndMap: error:', error);
        }
    }
}