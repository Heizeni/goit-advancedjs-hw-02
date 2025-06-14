import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datetimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const stopButton = document.querySelector('[data-stop]');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let countdownInterval = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0];
        if (userSelectedDate.getTime() <= new Date().getTime()) {
            iziToast.error({
                title: 'Error',
                message: 'Please choose a date in the future',
                position: 'topRight',
            });
            startButton.disabled = true;
            stopButton.disabled = true;
        } else {
            startButton.disabled = false;
            stopButton.disabled = true;
        }
    },
};

flatpickr(datetimePicker, options);

startButton.addEventListener('click', () => {
    startButton.disabled = true;
    datetimePicker.disabled = true;
    stopButton.disabled = false;

    countdownInterval = setInterval(() => {
        const currentTime = new Date().getTime();
        const remainingTime = userSelectedDate.getTime() - currentTime;

        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            datetimePicker.disabled = false;
            startButton.disabled = true;
            stopButton.disabled = true;
            iziToast.success({
                title: 'Success',
                message: 'Countdown finished!',
                position: 'topRight',
            });
            return;
        }

        const { days, hours, minutes, seconds } = convertMs(remainingTime);
        updateTimerDisplay({ days, hours, minutes, seconds });
    }, 1000);
});

stopButton.addEventListener('click', () => {
    clearInterval(countdownInterval);
    iziToast.info({
        title: 'Stopped',
        message: 'Countdown has been stopped.',
        position: 'topRight',
    });
    startButton.disabled = true;
    stopButton.disabled = true;
    datetimePicker.disabled = false;
});


function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
    daysSpan.textContent = addLeadingZero(days);
    hoursSpan.textContent = addLeadingZero(hours);
    minutesSpan.textContent = addLeadingZero(minutes);
    secondsSpan.textContent = addLeadingZero(seconds);
}

startButton.disabled = true;
stopButton.disabled = true;