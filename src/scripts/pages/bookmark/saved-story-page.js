import { generateStoryDetailTemplate, generateLoaderAbsoluteTemplate, generateSaveStoryButtonTemplate, generateRemoveStoryButtonTemplate } from '../../template.js'
import { parseActivePathname } from '../../routes/url-parser.js'
import Map from '../../utils/map.js';
import Database from '../../data/database';

export default class SavedPage {
    #presenter = null;
    #map = null;

    async render() {
        return `
        <section class="saved-page-container">
            <h1>Story Tersimpan</h1>
            <div id="story-detail" class="saved-story-container"></div>
            </div>
        </section>
        `;
    }

    async afterRender() {
        this.#presenter = new DetailPresenter(parseActivePathname().id, {
            view: this,
            dbModel: Database,
        });

        await this.#presenter.init();
    }

    async initialMap() {
        this.#map = await Map.build('#map', {
            zoom: 15,
            locate: true,
            scrollWheelZoom: true,
        });
    }

    showMapLoading() {
        document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
    }

    hideMapLoading() {
        document.getElementById('map-loading-container').innerHTML = '';
    }
}