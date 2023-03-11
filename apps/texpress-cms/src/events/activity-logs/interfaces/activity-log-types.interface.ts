export interface ActivityLogEventTypes {
    'log-event': [
        {
            module: string;
            action: string;
            description: string;
            userId: number;
            activityTimestamp: Date;
        }
    ];
}
