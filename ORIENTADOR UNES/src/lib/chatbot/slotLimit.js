import { AppStorage } from '../appStorage'

const STORAGE_KEY = 'orientador_unes_slot_limits'
const MAX_MESSAGES_PER_SLOT = 20

function getMxDateString() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date())
}

export async function getSlotLimitData() {
  const today = getMxDateString()
  const defaultData = { slots: { slot_0: 0, slot_1: 0 }, lastDate: today }

  try {
    const stored = await AppStorage.get(STORAGE_KEY)
    if (!stored) {
      await AppStorage.set(STORAGE_KEY, JSON.stringify(defaultData))
      return defaultData
    }

    const data = JSON.parse(stored)

    if (data.lastDate !== today) {
      await AppStorage.set(STORAGE_KEY, JSON.stringify(defaultData))
      return defaultData
    }
    return data
  } catch (error) {
    return defaultData
  }
}

async function saveSlotLimitData(data) {
  try {
    await AppStorage.set(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {}
}

export async function getSlotRemainingMessages(slotId = 'slot_0') {
  const data = await getSlotLimitData()
  const count = data.slots[slotId] || 0
  return Math.max(0, MAX_MESSAGES_PER_SLOT - count)
}

export async function incrementSlotMessageCount(slotId = 'slot_0') {
  const data = await getSlotLimitData()
  if ((data.slots[slotId] || 0) >= MAX_MESSAGES_PER_SLOT) return false

  data.slots[slotId] = (data.slots[slotId] || 0) + 1
  await saveSlotLimitData(data)
  return true
}

export async function syncSlotLimitData(slotId, realCount) {
  const data = await getSlotLimitData()
  data.slots[slotId] = realCount
  await saveSlotLimitData(data)
}
