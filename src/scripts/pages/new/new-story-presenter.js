export default class NewStoryPresenter {
    #view;
    #model;

    constructor({ view, model }) {
        this.#view = view;
        this.#model = model;
    }

    async postNewStory({ description, photo, lat, lon }) {
        this.#view.showSubmitLoadingButton();
        try {
            const response = await this.#model.storeNewStory({ description, photo, lat, lon });

            if (!response.ok) {
                console.error('postNewStory: response:', response);
                this.#view.storeFailed(response.message);
                return;
            }

            this.#view.storeSuccessfully(response.message);
        } catch (error) {
            console.error('postNewStory: error:', error);
            this.#view.storeFailed(error.message);
        } finally {
            this.#view.hideSubmitLoadingButton();
        }
    }

    async showNewFormMap() {
        try {
            await this.#view.initialMap();
        } catch (error) {
            console.error('showNewFormMap: error:', error);
        }
    }
}