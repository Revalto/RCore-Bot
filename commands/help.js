module.exports = {
    tag: ["помощь"],
    button: ["help"],
    type: 'TYPE_PRIVATE',

    execute: async(context, { VKIO }) => {
        const { Keyboard } = VKIO;
        const { first_name } = context.user;

        await context.send({
            message: `${first_name}, текст сообщения`,
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
