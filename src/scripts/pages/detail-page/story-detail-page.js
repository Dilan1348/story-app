import * as StoryAPI from '../../data/api.js';
import DetailPresenter from './story-detail-presenter.js';
import { generateStoryDetailTemplate, generateLoaderAbsoluteTemplate, generateSaveStoryButtonTemplate, generateRemoveStoryButtonTemplate } from '../../template.js'
import { parseActivePathname } from '../../routes/url-parser.js'
import Map from '../../utils/map.js';
import Database from '../../data/database';

export default class DetailPage {
  #presenter = null;
  #map = null;

  async render() {
    return `
        <section class="detail-page-container">
            <div id="story-detail-loading-container"></div>
            <h1>Detail Story</h1>
            <div id="story-detail" class="story-detail-container"></div>
            <div id="save-container" class="save-story-container">
            </div>
        </section>
        `;
  }

  async afterRender() {
    this.#presenter = new DetailPresenter(parseActivePathname().id, {
      model: StoryAPI,
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

  async showStoryDetail(story) {
    const detailContainer = document.getElementById('story-detail');

    detailContainer.innerHTML = generateStoryDetailTemplate({
      id: story.id,
      photoUrl: story.photoUrl,
      name: story.name,
      description: story.description,
      createdAt: story.createdAt,
      lat: story.lat,
      lon: story.lon,
    });

    if (story.lat === null && story.lon === null) {
      document.getElementById('location-lat').innerHTML = 'Lokasi tidak tersedia.'
      document.getElementById('location-lon').innerHTML = 'Lokasi tidak tersedia.'
    }

    await this.#presenter.showReportDetailMap();
    if (this.#map) {
      const reportCoordinate = [story.lat, story.lon];
      const markerOptions = { alt: story.name };
      const popupOptions = { content: story.name };
      this.#map.changeCamera(reportCoordinate);
      this.#map.addMarker(reportCoordinate, markerOptions, popupOptions);
    }

    document.getElementById('location').innerHTML = await Map.getPlaceNameByCoordinate(story.lat, story.lon);

    this.renderSaveButton();
  }

  showStorytDetailLoading() {
    document.getElementById('story-detail-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideStoryDetailLoading() {
    document.getElementById('story-detail-loading-container').innerHTML = '';
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  renderSaveButton() {
    document.getElementById('save-container').innerHTML =
      generateSaveStoryButtonTemplate();

    document.getElementById('story-detail-save').addEventListener('click', async () => {
      await this.#presenter.saveStory();
      await this.#presenter.showSaveButton();
    });
  }

  renderRemoveButton() {
    document.getElementById('save-container').innerHTML =
      generateRemoveStoryButtonTemplate();

    document.getElementById('story-detail-save').addEventListener('click', async () => {
      await this.#presenter.saveStory();
    });
  }

  saveToBookmarkSuccessfully(message) {
    console.log(message);
  }

  saveToBookmarkFailed(message) {
    alert(message);
  }
}