export interface LuxuryEventData {
    type: keyof LuxuryEvents
    data: any
}

export interface VibrateEventData {
    strength: number
}

export interface InfoEventData {
    strength: number
}
export enum LuxuryEvents {
    vibrate,
    info
}