export default class DetailPresenter {
    #model;
    #view;
    #detailId;


    constructor(detailId, { model, view }) {
        this.#model = model;
        this.#view = view;
        this.#detailId = detailId;
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
}