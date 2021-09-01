const BaseController = require('./BaseController');

module.exports = (Controller) => {
    Controller.addController(BaseController);
}