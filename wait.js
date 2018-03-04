var sleep = require('sleep');

function wait() {
    sleep.msleep(5000);
}

setTimeout(wait, 1000);