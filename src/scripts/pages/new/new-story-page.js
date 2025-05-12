import * as StoryAPI from '../../data/api.js';
import NewStoryPresenter from './new-story-presenter.js';
import Map from '../../utils/map.js';
import Camera from '../../utils/camera.js';

export default class NewStory {
    #presenter;
    #form;
    #camera;
    #map;
    #isCameraOpen = false;

    async render() {
        return `
        <section class="container">
            <h1>Create New Story</h1>
            <form id="create-story-form" class="create-story-form">
                <div class="form-control">
                    <label for="title-input">Judul Story</label>
                    <input id="title-input" name="title" placeholder="Masukkan judul Story">
                </div>
                <div class="form-control">
                    <label for="description">Deskripsi</label>
                    <textarea id="description" name="description" placeholder="Masukkan deskripsi Story" required></textarea>
                </div>
                <div class="form-control">
                    <label for="image-upload">Upload Foto</label>
                    <input type="file" accept="image/*" id="image-upload" name="image-upload" />
                </div>
                <div class="form-control">
                    <div class="camera-container">
                        <div class="button-container">
                            <button type="button" id="start-camera" class="btn">Buka Kamera</button>
                            <button type="button" id="capture" class="btn">Ambil Foto</button>
                        </div>
                        <select id="camera-select" hidden></select>
                        <video id="video" autoplay style="display: none;" width="100%"></video>
                        <canvas id="canvas" style="display: none;"></canvas>
                    </div>
                </div>
                <div class="map-container">
                    <h2>Lokasi</h2>
                    <div class="location-container">
                        <div class="form-control">
                            <label for="longitude">Longitude</label>
                            <input type="text" id="longitude" name="longitude"/>
                        </div>
                        <div class="form-control">
                            <label for="latitude">Latitude</label>
                            <input type="text" id="latitude" name="latitude"/>
                        </div>
                    </div>
                    <div id="map" style="height: 600px;"></div>
                </div>
                <div id="submit-button-container" class="form-control">
                    <div class="button-container">
                        <button class="btn" type="submit">Buat Story</button>
                        <a class="btn cancel-button" href="#/">Batal</a>
                    </div>
                </div>
            </form>
            <div id="status"></div>
        </section>
        `;
    }

    async afterRender() {
        this.#presenter = new NewStoryPresenter({
            view: this,
            model: StoryAPI,
        });

        this.#setupForm();
        this.#setupCamera();
        this.#presenter.showNewFormMap();
    }

    #setupForm() {
        this.#form = document.getElementById('create-story-form');

        this.#form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const imageInput = document.getElementById('image-upload');
            const canvas = document.getElementById('canvas');

            let photo;
            if (imageInput.files.length > 0) {
                photo = imageInput.files[0];
            } else {
                const dataURL = canvas.toDataURL('image/jpeg');
                photo = this.dataURLtoBlob(dataURL);
            }

            const latValue = this.#form.elements.namedItem('latitude')?.value;
            const lonValue = this.#form.elements.namedItem('longitude')?.value;

            const data = {
                description: this.#form.elements.namedItem('description').value,
                photo,
                lat: latValue || null,
                lon: lonValue || null,
            };

            await this.#presenter.postNewStory(data);
        });
    }

    #setupCamera() {
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const cameraSelect = document.getElementById('camera-select');
        const startBtn = document.getElementById('start-camera');
        const captureBtn = document.getElementById('capture');
        // let stream = navigator.mediaDevices.getUserMedia({ video: true });

        this.#camera = new Camera({
            video,
            canvas,
            cameraSelect,
        });

        startBtn.addEventListener('click', async () => {
            this.#isCameraOpen = !this.#isCameraOpen;

            if (this.#isCameraOpen) {
                await this.#camera.launch();
                video.style.display = 'block';
                canvas.style.display = 'none';
                startBtn.textContent = 'Tutup Kamera';
                cameraSelect.hidden = false;
                captureBtn.disabled = false;
            } else {
                this.#camera.stop();
                video.style.display = 'none';
                canvas.style.display = 'none';
                startBtn.textContent = 'Buka Kamera';
                cameraSelect.hidden = true;

            }
        });

        captureBtn.addEventListener('click', async () => {
            if (!this.#isCameraOpen) return;
            await this.#camera.takePicture();
            video.style.display = 'none';
            canvas.style.display = 'block';
            this.#camera.stop();
            captureBtn.disabled = true;
        });
    }

    async initialMap() {
        this.#map = await Map.build('#map', {
            zoom: 15,
            locate: true,
            scrollWheelZoom: true,
        });

        const centerCoordinate = this.#map.getCenter();

        this.#updateLatLngInput(centerCoordinate.latitude, centerCoordinate.longitude);

        const draggableMarker = this.#map.addMarker(
            [centerCoordinate.latitude, centerCoordinate.longitude],
            { draggable: 'true' },
        );

        draggableMarker.addEventListener('move', (event) => {
            const coordinate = event.target.getLatLng();
            this.#updateLatLngInput(coordinate.lat, coordinate.lng);
        });

        this.#map.addMapEventListener('click', (event) => {
            draggableMarker.setLatLng(event.latlng);
            event.sourceTarget.flyTo(event.latlng);
        });
    }

    #updateLatLngInput(latitude, longitude) {
        this.#form.elements.namedItem('latitude').value = latitude;
        this.#form.elements.namedItem('longitude').value = longitude;
    }

    dataURLtoBlob(dataURL) {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new Blob([u8arr], { type: mime });
    }

    storeSuccessfully(message) {
        console.log(message);
        this.clearForm();
        location.href = '#/';
    }

    storeFailed(message) {
        alert(message);
    }

    clearForm() {
        this.#form.reset();
    }

    showSubmitLoadingButton() {
        document.getElementById('submit-button-container').innerHTML = `
        <div class="button-container">
            <button class="btn" type="submit" disabled><i class="fas fa-spinner loader-button"></i> Buat Story</button>
            <a class="btn cancel-button" href="#/">Batal</a>
        </div>
        `;
    }

    hideSubmitLoadingButton() {
        document.getElementById('submit-button-container').innerHTML = `
        <div class="button-container">
            <button class="btn" type="submit"><i class="fas fa-spinner loader-button"></i> Buat Story</button>
            <a class="btn cancel-button" href="#/">Batal</a>
        </div>
        `;
    }
}