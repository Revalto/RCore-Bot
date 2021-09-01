class ControllerManager {
    constructor(container) {
        this._container = container;
    }

    addController(controller) {
        const name = controller.name;
        const path = controller.getPath();
        const args = controller.getArgs();

        this._container.service(`${path}${path.slice(-1) === '/' ? '' : '/'}${name}`, c => {
            const params = [...args].map(res => this._container[res]);

            return new controller(...params);
        });
    }

    getController(name) {
        return this._container[name];
    }
}

module.exports = ControllerManager;