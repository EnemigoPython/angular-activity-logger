export interface UserStats {
    date: string | null,
    days: number | null,
    completed: string | null,
    percent: number | typeof NaN
}