import notify from 'devextreme/ui/notify';
import store from '@/store'
import localize from "@/localize"

const consoleLog = process.env.NODE_ENV !== 'production';

function getAction(actionName) {
    let action = store.getters.getActionByName(actionName);
    if(!action) action = actionName;
    return action;
}

function getMessageText(type, action, obj, message, args) {
    let messageText = localize(type);
    if(action) {
        messageText += ". " + (action.Title ? action.Title : action);
    }
    if(obj) {
        if(obj.Title) {
            messageText += ": " + obj.Title;
        }
        else if(typeof obj === 'string') {
            messageText += ": " + obj;
        }
    }
    if(message) {
        messageText += ". " + localize(message);
    }
    if(args) {
        messageText += ". " + args.get_message();
        messageText += "\n" + args.get_stackTrace();
    }
    return messageText;
}

export default {

    info(actionName, obj, message) {
        if(message) {
            const action = getAction(actionName);
            const messageText = getMessageText("NotifyInfo", action, obj, message);
            notify(messageText, "info", 6000);
        }
    },
    warning(actionName, obj, message) {
        if(message) {
            const action = getAction(actionName);
            const messageText = getMessageText("NotifyWarning", action, obj, message);
            notify(messageText, "warning", 7000);
            if(consoleLog) {
                console.log(messageText, obj);
            }
        }
    },
    success(actionName, obj) {
        if(actionName) {
            const action = getAction(actionName);
            const messageText = getMessageText("NotifySuccess", action, obj);
            if(action.IsChange && action.Name != "UpdateAppUserSetting") {
                notify(messageText, "success", 6000);
            }
            if(consoleLog) {
                console.log(messageText, obj);
            }
        }
    },
    error(actionName, obj, e, args) {
        if(actionName) {
            const action = getAction(actionName);
            let message = null;
            if(e) {
                message = "";
                if(e.response && e.response.data && e.response.data.message) {
                    message += " " + e.response.data.message;
                }
                else if(e.message) {
                    message += e.message;
                }
            }
            const messageText = getMessageText("NotifyError", action, obj, message, args);
            notify(messageText, "error", 6000);
            if(consoleLog) {
                console.log(messageText, obj, e, args);
            }
        }
    },
}