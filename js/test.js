'use strict';

const zombieBody = document.getElementById('bg-zombie');
const zombieNumber = document.getElementById('zombie-number');
const zombieImg = document.getElementById('zombie-img');
const colors = [
    '#ff765b',
    '#a9ff7e',
    '#b68fff',
    'rgba(255,221,108,0.76)',
    '#85faff',
    'bisque',
    '#6d768e',
    '#4f7aff',
    '#ffad7d',
    '#0effb5'
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

zombieBody.addEventListener('click', () => {
    let result = getRandomInt(1, 7);
    let number = 0;
    let img = '';

    if (result === 1 || result === 2) {
        number = 1;
        img = 'run';
    } else if (result === 3 || result === 4) {
        number = 2;
        img = 'bite';
    } else if (result === 5 ) {
        number = 3;
        img = 'hit';
    } else if (result === 6 ) {
        number = 4;
        img = 'shoot';
    }

    render(img, number);
});

function render(img, number) {
    zombieNumber.innerText = number;
    zombieImg.classList = ['dice-img', img].join(' ');
    zombieBody.style.backgroundColor = colors[getRandomInt(0, 10)];
}
