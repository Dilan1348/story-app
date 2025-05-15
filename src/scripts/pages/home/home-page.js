import * as StoryAPI from '../../data/api.js'
import HomePresenter from './home-presenter.js'
import { generateStoryTemplate } from '../../template.js'

export default class HomePage {
  #presenter = null;
  async render() {
    return `
      <section class="home-page-container">
        <h1>Home Page</h1>
        <div class="new-story-container">
          <p>Share Your own stories with everyone</p>
          <div class="story-button">
          <div class="button save-page-button"><a href="#/saved" class="new-story__link"><i class="fas fa-save"></i> Story Tersimpan</a></div>
          <div class="button new-story-button"><a href="#/stories" class="new-story__link"><i class="fas fa-plus"></i> Buat Story</a></div>
          </div>
        </div>
        <div id="stories-container" class="stories-container"></div>

      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      model: StoryAPI,
      view: this,
    });
    await this.#presenter.init();
  };

  showStories(stories) {
    const list = document.getElementById("stories-container");
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
