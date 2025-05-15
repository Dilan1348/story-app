import NotFoundView from '../notFound/notfound-view';

export default class NotFoundPresenter {
    constructor() {
        this.view = new NotFoundView();
    }

    async render(container) {
        container.innerHTML = this.view.getHtml();

        container.querySelectorAll('a[data-link]').forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const path = link.getAttribute('href');
                window.history.pushState({}, '', path);
                window.dispatchEvent(new PopStateEvent('popstate'));
            });
        });
    }
}