export default class DetailPresenter {
    #model;
    #view;
    #detailId;
    #dbModel;


    constructor(detailId, { model, view, dbModel }) {
        this.#model = model;
        this.#view = view;
        this.#detailId = detailId;
        this.#dbModel = dbModel;
    }

    async init() {
        this.#view.showStorytDetailLoading();
        try {
            const story = await this.#model.getDetailStory(this.#detailId);

            this.#view.showStoryDetail(story);
            // this.#view.showMapLocation(latitude, longitude);
        } catch (err) {
            const container = document.getElementById('container');
            container.innerHTML = `<p>Gagal memuat cerita: ${err.message}</p>`;
        } finally {
            this.#view.hideStoryDetailLoading();
        }
    }

    async showReportDetailMap() {
        this.#view.showMapLoading();
        try {
            await this.#view.initialMap();
        } catch (error) {
            console.error('showReportDetailMap: error:', error);
        } finally {
            this.#view.hideMapLoading();
        }
    }

    async saveStory() {
        try {
            const story = await this.#model.getDetailStory(this.#detailId);
            await this.#dbModel.putStory(story);

            this.#view.saveToBookmarkSuccessfully('Berhasil menyimpan story');
        } catch (error) {
            console.error('saveStory: error:', error);
            this.#view.saveToBookmarkFailed(error.message);
        }
    }

    async removeStory() {
        try {
            await this.#dbModel.removeStory(this.#detailId);

            this.#view.removeFromBookmarkSuccessfully('Success to remove from bookmark');
        } catch (error) {
            console.error('removeReport: error:', error);
            this.#view.removeFromBookmarkFailed(error.message);
        }
    }

    async showSaveButton() {
        if (await this.#isStorySaved()) {
            this.#view.renderRemoveButton();
            return;
        }

        this.#view.renderSaveButton();
    }

    async #isStorySaved() {
        return !!(await this.#dbModel.getStoryById(this.#detailId));
    }
}