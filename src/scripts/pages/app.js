import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { getAccessToken, getLogout } from '../utils/auth';
import {
  generateAuthenticatedNavigationListTemplate,
  generateUnauthenticatedNavigationListTemplate,
} from '../template';
import { transitionHelper, isServiceWorkerAvailable } from '../utils';
import { subscribe, unsubscribe, isCurrentPushSubscriptionAvailable } from '../utils/notification-helper';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
    this.setUpNav();
    this.setupPushNotification();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      })
    });
  }

  setUpNav() {
    const isLogin = !!getAccessToken();
    const navList = document.getElementById('nav-list');

    if (!isLogin) {
      navList.innerHTML = generateUnauthenticatedNavigationListTemplate();
      return;
    }
    navList.innerHTML = generateAuthenticatedNavigationListTemplate();

    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', (event) => {
      event.preventDefault();

      if (confirm('Apakah Anda yakin ingin keluar?')) {
        getLogout();

        location.hash = '/login';
      }
    });
  }

  async setupPushNotification() {
    const isSubscribed = await isCurrentPushSubscriptionAvailable();
    const subButton = document.getElementById('subscribe-button');
    const unsubButton = document.getElementById('unsubscribe-button');
    if (isSubscribed) {
      subButton.setAttribute('hidden', '');
      unsubButton.removeAttribute('hidden')

      unsubButton.addEventListener('click', () => {
        unsubscribe().finally(() => {
          this.setupPushNotification();
        });
      });

      return;
    }

    unsubButton.setAttribute('hidden', '');
    subButton.removeAttribute('hidden')
    subButton.addEventListener('click', () => {
      subscribe().finally(() => {
        this.setupPushNotification();
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    const transition = transitionHelper({
      updateDOM: async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      },
    });
    transition.ready.catch(console.error);
    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: 'instant' });
      this.setUpNav();

      if (isServiceWorkerAvailable()) {
        this.setupPushNotification();
      }
    });
  }
}

export default App;
