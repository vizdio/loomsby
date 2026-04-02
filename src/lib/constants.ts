export const APP_STRINGS = {
    appName: 'Loomsby',
    tagline: 'Build communities, boards, chat, and visual flows.',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    pin: 'Pin',
    lock: 'Lock',
    addPal: 'Add Pal',
    noData: 'No data yet.',
} as const

export const PALS_STATUS = {
    pending: 'pending',
    accepted: 'accepted',
    blocked: 'blocked',
} as const

export type PalsStatus = (typeof PALS_STATUS)[keyof typeof PALS_STATUS]

export const ROUTES = {
    home: '/',
    login: '/login',
    signup: '/signup',
    boards: '/boards',
    chat: '/chat',
    builder: '/builder',
    profile: '/profile',
} as const

export const NODE_TYPES = {
    input: 'input',
    output: 'output',
    logic: 'logic',
    display: 'display',
} as const

export const STORAGE_BUCKETS = {
    avatars: 'avatars',
    media: 'media',
} as const
