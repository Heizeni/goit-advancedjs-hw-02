import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');

form.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
    event.preventDefault();

    const delayInput = event.currentTarget.elements.delay;
    const stateInput = event.currentTarget.elements.state;

    const delay = Number(delayInput.value);
    const state = stateInput.value;

    createPromise(delay, state)
        .then(delayValue => {
            iziToast.success({
                title: 'Success',
                message: `✅ Fulfilled promise in ${delayValue}ms`,
                position: 'topRight',
            });
        })
        .catch(delayValue => {
            iziToast.error({
                title: 'Error',
                message: `❌ Rejected promise in ${delayValue}ms`,
                position: 'topRight',
            });
        });
    form.reset();
}

function createPromise(delay, state) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === 'fulfilled') {
                resolve(delay);
            } else {
                reject(delay);
            }
        }, delay);
    });
}