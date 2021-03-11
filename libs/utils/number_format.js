module.exports = (number, decimals = 0) => parseFloat(number).toLocaleString("ru-RU", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: 2
})