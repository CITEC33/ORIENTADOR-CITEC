import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'

export const AppStorage = {
  get: async (key) => {
    if (Capacitor.isNativePlatform()) {
      const { value } = await Preferences.get({ key })
      return value
    }
    return localStorage.getItem(key)
  },
  set: async (key, value) => {
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({ key, value })
    } else {
      localStorage.setItem(key, value)
    }
  }
}
