import * as AuthModel from '../../utils/auth.js'
import * as StoryAPI from '../../data/api.js'
import LoginPresenter from './login-presenter.js';

export default class loginPage {
    #presenter = null;
    async render() {
        return `
        <div class="login-page-container">
            <h2>Login</h2>
            <form id="login-form">
                <div class="form-control">
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email" class="email-input" placeholder="Enter email" required />
                </div>
                <div class="form-control">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" class="password-input" placeholder="Password" required />
                </div>
                <div id="submit-button-container" class="form-control">
                    <button class="btn" type="submit">Masuk</button>
                </div>
            </form>
            <p class="login-form__do-not-have-account">Belum memiliki akun? <a href="#/register">Daftar</a></p>
            <p id="message"></p>
        </div>
        `
    }

    async afterRender() {
        this.#presenter = new LoginPresenter({
            model: StoryAPI,
            view: this,
            auth: AuthModel,
        });

        this.#setupForm();
    }

    #setupForm() {
        document.getElementById('login-form').addEventListener('submit', async (event) => {
            event.preventDefault();

            const data = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
            };
            await this.#presenter.getLogin(data);
        });
    }

    loginSuccessfully(message) {
        document.getElementById('message').innerHTML = message;
        console.log(message);

        location.hash = '#/';
    }

    loginFailed(message) {
        alert(message);
    }

    showSubmitLoadingButton() {
        document.getElementById('submit-button-container').innerHTML = `
        <button class="btn" type="submit" disabled>
            <i class="fas fa-spinner fa-spin loader-button"></i> Masuk
        </button>
        `;
    }

    hideSubmitLoadingButton() {
        document.getElementById('submit-button-container').innerHTML = `
        <button class="btn" type="submit">Masuk</button>
        `;
    }

}