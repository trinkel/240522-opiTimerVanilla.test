export interface AppDefaults {
	practiceLength: 1 | 6 | 7 | 8 | 10 | 11 | 12;
	pauseBetweenSelector: 'yes' | 'no'; // Pause between teams
	pauseLength: number; // Length of pause between sessions in seconds
	groupStartType: number;
	groupStartTime: Date;
	operationMode: 0 | 1; // Anonymous (0) | List (1)
	teamList: string[]; // List of team names (Separated by CR from form)
	numberTeams: number; // Number of teams

	// App passthrough settings
	dBugg: number;
	warp: number; // Speed factor for demos (1-8 typical)
	tick: number; // Component sleep interval in milliseconds
	pendingWarn: number; // Time before warning-time to flash badge "pending" in milliseconds
	pendingEndSession: number; // Time before end-session to display "leave the ice" badge in milliseconds
}

export const appDefaults: AppDefaults = {
	// User editable settings
	practiceLength: 6, // Length of each practice session
	pauseBetweenSelector: 'no',
	pauseLength: 0, // Length of pause between sessions
	groupStartType: 0,
	groupStartTime: new Date(0),
	operationMode: 0, // Anonymous (0) | List (1)
	teamList: [''],
	numberTeams: 3,

	// App passthrough settings
	dBugg: 0,
	warp: 0, // Speed factor for demos (1-8)
	tick: 0, // Component timeout interval in milliseconds (200)
	pendingWarn: 0, // Time before warning-time to flash badge "pending" in milliseconds (3000)
	pendingEndSession: 0, // Time before end-session to display "leave the ice" badge in milliseconds (15000)
};
