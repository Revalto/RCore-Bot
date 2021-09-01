const Controller = require('../../Core/Controller/Controller');

class BaseController extends Controller {
    constructor(app) {
        super();

        this.app = app;

        this.help = this.help.bind(this);
    }

    help(context) {
        console.log(context, this.app);
    }

    static getArgs() {
        return ['app'];
    }

    static getPath() {
        return '/';
    }
}

module.exports = BaseController;