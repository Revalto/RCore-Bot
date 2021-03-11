const { resolveResource } = require("vk-io");

module.exports = async(context) => {
    const { args } = context.command.about;
    const fwdUser = (context.replyMessage 
            ? [context.replyMessage.senderId] 
            : undefined) 
        || (context.forwards && context.forwards[0]
            ? Array.from(new Set(context.forwards.map(res => res.senderId)))
            : undefined)
        || [];
    
    if(fwdUser.length == 0 && args.length != 0) {
        try {
            const result = await resolveResource({
                api: context.api,
                resource: args[0]
            });
            
            return [result.type == 'group' ? -result.id : result.id];
        } catch(e) {
            if(e.code != 'RESOURCE_NOT_FOUND') {
                throw new Error(e);
            }
        }
    }

    return fwdUser;
}