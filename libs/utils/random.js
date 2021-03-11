const allCapsAlpha = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"]; 
const allLowerAlpha = [..."abcdefghijklmnopqrstuvwxyz"]; 
const allUniqueChars = [...`~!@#$%^&*()_+-=[]\{}|;:'",./<>?`];
const allNumbers = [..."0123456789"];

const base = [...allCapsAlpha, ...allNumbers, ...allLowerAlpha, ...allUniqueChars];

const int = (min, max) => Math.round(min - 0.5 + Math.random() * (max - min + 1));

const str = (len) => [...Array(len)]
    .map(i => base[Math.random() * base.length|0])
    .join('');

module.exports = { int, str };