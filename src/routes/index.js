module.exports = (commandManager, ControllerManager) => {
    commandManager.addCommand('help', ControllerManager.getController('/BaseController').help);
}