export function generateStoryTemplate({ id, photoUrl, name, description, createdAt }) {
  return `
      <div class="stories-item-container">
        <div class="stories-item">
          <h2 class="stories-item__name">${name}</h2>
          <p class="stories-item__date">Dibuat pada: ${formatReadableDate(createdAt)}</p>
          <img class="stories-item__image" src="${photoUrl}" alt="Name: ${name}">
          <p class="stories-item__desc">${description}</p>
          <div class="detail-button"><a href="#/stories/${id}" class="stories-item__link">Lihat Selengkapnya <i class="fas fa-angle-right"></i></a></div>
        </div>
      </div>
    `;
}

export function generateStoryDetailTemplate({ id, photoUrl, name, description, createdAt, lat, lon }) {
  return `
      <h2 class="story-detail__name">${name}</h2>
      <p class="story-detail__date">Dibuat pada: ${formatReadableDate(createdAt)}</p>
      <div class="coor-location" data-value="${lat}">
        <p id="location-lat">Latitude: ${lat}</p>
        <p id="location-lon">Latitude: ${lon}</p>
      </div>
      <p id="location" class="city-location"></p>
      <p class="story-detail__desc">${description}</p>
      <div class="detail-image-container">
        <img src="${photoUrl}" alt="${name}" class="story-detail__image">
      </div>
      <div id="map-container" class="map-container">
        <h2>Peta Lokasi</h2>
        <div id="map" class="map" style="height: 600px;"></div>
        <div id="map-loading-container"></div>
      </div>
  `;
}

function formatReadableDate(isoDate) {
  const date = new Date(isoDate);
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  };
  return date.toLocaleString('id-ID', options) + ' WIB';
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute"></div>
  `;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li><button class="subscribe-button" id="subscribe-button">Subscribe</button></li>
    <li><button class="subscribe-button" id="unsubscribe-button" hidden>Unsubscribe</button></li>
    <li><a href="#/">Beranda</a></li>
    <li><a href="#/about">About</a></li>
    <li><a href="#/login">login</a></li>
    <li><a href="#/register">Register</a></li>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
    <li><button class="subscribe-button" id="subscribe-button">Subscribe</button></li>
    <li><button class="subscribe-button" id="unsubscribe-button" hidden>Unsubscribe</button></li>
    <li><a href="#/">Beranda</a></li>
    <li><a href="#/about">About</a></li>
    <li><a id="logout-button" class="out-button" href="#/logout"><i class="fas fa-sign-out-alt"></i> logout</a></li>
  `;
}

export function generateSaveStoryButtonTemplate() {
  return `
    <button id="story-detail-save" class="button save-button">
      Simpan Story <i class="far fa-save"></i>
    </button>
  `;
}

export function generateRemoveStoryButtonTemplate() {
  return `
    <button id="story-detail-remove" class="button remove-button">
      Hapus Story <i class="fas fa-save"></i>
    </button>
  `;
}