module.exports = {
    tag: ["помощь"],
    button: ["help"],
    func: async(context, { Keyboard }) => {
        await context.send({
            message: `Текст сообщения`,
            keyboard: Keyboard.keyboard([
                [
                    Keyboard.textButton({ label: 'Кнопка 1', payload: { command: 'button1' }, color: Keyboard.POSITIVE_COLOR }),
                    Keyboard.textButton({ label: 'Кнопка 2', payload: { command: 'button2' }, color: Keyboard.PRIMARY_COLOR }),
                ],
                Keyboard.textButton({ label: 'Помощь', payload: { command: 'help' }, color: Keyboard.PRIMARY_COLOR })
            ])
        });
    }
};
