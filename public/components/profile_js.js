export default class profileComponent {
    #parent
    #data

    constructor(parent) {
        this.#parent = parent;
    }

    set data(value) {
        this.#data = value;
    }

    render() {
        root.innerHTML = "";

        const profileView = document.createElement('div');
        const span = document.createElement('span');
        span.innerHTML = this.#data.name;
        profileView.appendChild(span);

        const backBtn = document.createElement('a');
        backBtn.href = '/main';
        backBtn.textContent = 'назад';
        backBtn.dataset.section = 'main';
        profileView.appendChild(backBtn);

        this.#parent.appendChild(profileView);
    }
}
