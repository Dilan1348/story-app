import * as RegisterAPI from '../../data/api';
import RegisterPresenter from '../register/register-presenter';

export default class RegisterPage {
    #presenter = null;
    async render() {
        return `
        <div class="register-page-container">
            <h2>Register</h2>
            <form id="register-form">
                <div class="form-control">
                    <label for="name">Nama lengkap</label>
                    <input type="text" name="name" id="name" class="register-name" placeholder="Nama Lengkap" required />
                </div>
                <div class="form-control">
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email" class="register-email" placeholder="Enter email" required /><br/>
                </div>
                <div class="form-control">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" class="register-password" placeholder="Password" required /><br/>
                </div>
                <div id="submit-button-container" class="form-control">
                    <button type="submit" class="btn">Daftar</button>
                </div>
                <p class="register-form__have-account">Sudah memiliki akun? <a href="#/login">Log In</a></p>
                <p id="message"></p>
            </form>
        </div>
        `
    }

    async afterRender() {
        this.#presenter = new RegisterPresenter({
            model: RegisterAPI,
            view: this,
        });

        this.#setupForm();
    }

    #setupForm() {
        document.getElementById('register-form').addEventListener('submit', async (event) => {
            event.preventDefault();

            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
            };
            await this.#presenter.getRegistered(data);
        });
    }

    registeredSuccessfully(message) {
        document.getElementById('message').innerHTML = message;
        console.log(message);

        location.hash = '/login';
    }

    registeredFailed(message) {
        alert(message);
    }

    showSubmitLoadingButton() {
        document.getElementById('submit-button-container').innerHTML = `
        <button class="btn" type="submit" disabled>
            <i class="fas fa-spinner fa-spin loader-button"></i> Daftar
        </button>
        `;
    }

    hideSubmitLoadingButton() {
        document.getElementById('submit-button-container').innerHTML = `
        <button class="btn" type="submit">Daftar</button>
        `;
    }
}