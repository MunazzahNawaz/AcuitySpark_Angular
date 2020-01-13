import { Time } from '@angular/common';


export class Schedule {
    ruleScheduleId: number;
    scheduleName: string;
    scheduleType: ScheduleType;
    startDate: Date;
    ruleSetId: number;
    frequencyType: FrequencyType;
    frequencyInterval: number;
    endDate: Date;
    startTime: Time;

    public static getScheduleTypes() {
        const types = [];
        for (const key of Object.keys(ScheduleType)) {
            if (!Number.isNaN(parseInt(key, 10))) {
                types.push(ScheduleType[key]);
            }
        }
        return types;
    }
    public static getFrequencyTypes() {
        const types = [];
        for (const key of Object.keys(FrequencyType)) {
            if (!Number.isNaN(parseInt(key, 10))) {
                types.push(FrequencyType[key]);
            }
        }
        return types;
    }
    public static getFrequencyInterval_Weekly() {
        const types = [];
        for (const key of Object.keys(FrequencyInterval_Weekly)) {
            if (!Number.isNaN(parseInt(key, 10))) {
                types.push(FrequencyInterval_Weekly[key]);
            }
        }
        return types;
    }
    public static getFrequencyInterval_Monthly() {
        const types = [];
        for (const key of Object.keys(FrequencyInterval_Monthly)) {
            if (!Number.isNaN(parseInt(key, 10))) {
                types.push(FrequencyInterval_Monthly[key]);
            }
        }
        return types;
    }
}
export enum ScheduleType {
    'Once Only' = 1,
    'Recurring' = 2
}
export enum FrequencyType {
    Daily = 4,
    Weekly = 8,
    Monthly = 16
}
export enum FrequencyInterval_Weekly {
    Sunday = 1,
    Monday = 2,
    Tuesday = 4,
    Wednesday = 8,
    Thursday = 16,
    Friday = 32,
    Saturday = 64
}
export enum FrequencyInterval_Monthly {
    Sunday = 1,
    Monday = 2,
    Tuesday = 3,
    Wednesday = 4,
    Thursday = 5,
    Friday = 6,
    Saturday = 7
}