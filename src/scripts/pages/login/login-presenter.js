export default class LoginPresenter {
    #model;
    #view;
    #auth;

    constructor({ model, view, auth }) {
        this.#model = model;
        this.#view = view;
        this.#auth = auth;
    }

    async getLogin({ email, password }) {
        this.#view.showSubmitLoadingButton();
        try {
            const response = await this.#model.getLogin({ email, password });

            if (!response.ok) {
                console.error('getLogin: response:', response);
                this.#view.loginFailed(response.message);
                return;
            }

            this.#auth.putAccessToken(response.loginResult.token);

            this.#view.loginSuccessfully(response.message, response.loginResult);
        } catch (error) {
            console.error('getLogin: error:', error);
            this.#view.loginFailed(error.message);
        } finally {
            this.#view.hideSubmitLoadingButton();
        }
    }
}