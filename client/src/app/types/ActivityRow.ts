import { Activity } from './Activity';

export interface ActivityRow {
    [key: string]: Activity["name"]
}