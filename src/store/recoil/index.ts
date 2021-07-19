import { atom } from 'recoil'
import defaultAppSettings from 'configs/default-app-settings.json'

export const appState = new Proxy({
    appSettings: {
        ...defaultAppSettings,
        dev_mode: process.env.NODE_ENV === "development"
    }
}, {
    get: function (target: any, prop) {
        return target[prop]
    },
    set: function (target, property, value) {
        target[property] = value;
        // @ts-ignore
        return Reflect.set(...arguments);
    }
})

export const $appSettings = atom({
    key: 'appSettings',
    default: appState.appSettings,
})
