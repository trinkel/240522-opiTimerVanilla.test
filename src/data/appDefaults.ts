import { format } from 'date-fns';

export type operationModes = 'anonymous' | 'list';
export type practiceLengthTimes = 1 | 6 | 7 | 8 | 10 | 11 | 12;
export type groupStartTypeTypes = 'scheduled' | 'manual' | 'dbugg';

export interface AppDefaults {
	practiceLength: practiceLengthTimes;
	pauseBetweenSelector: 'yes' | 'no'; // Pause between teams
	pauseLength: number; // Length of pause between sessions in seconds
	groupStartType: groupStartTypeTypes;
	groupStartTime: Date;
	groupStartTimeStr: string;
	operationMode: operationModes; // anonymous | list
	teamList: string[]; // List of team names (Separated by CR from form)
	numberTeams: number; // Number of teams

	// App passthrough settings
	dBugg: number;
	warp: number; // Speed factor for demos (1-8 typical)
	tick: number; // Component sleep interval in milliseconds
	pendingWarn: number; // Time before warning-time to flash badge "pending" in milliseconds
	pendingEndSession: number; // Time before end-session to display "leave the ice" badge in milliseconds
	init: () => void;
}

export const appDefaults: AppDefaults = (() => {
	const defaults: AppDefaults = {
		// User editable settings
		practiceLength: 10, // Length of each practice session
		pauseBetweenSelector: 'no',
		pauseLength: 0, // Length of pause between sessions
		groupStartType: 'scheduled',
		groupStartTime: new Date(new Date().setHours(0, 0, 0)),

		// Create string from `groupStartTime: Date`
		groupStartTimeStr: '',
		init() {
			this.groupStartTimeStr = format(this.groupStartTime, 'HH:mm');
		},

		operationMode: 'anonymous', // anonymous | list
		teamList: [''],
		numberTeams: 3,

		// App passthrough settings
		dBugg: 0,
		warp: 0, // Speed factor for demos (1-8)
		tick: 0, // Component timeout interval in milliseconds (200)
		pendingWarn: 0, // Time before warning-time to flash badge "pending" in milliseconds (3000)
		pendingEndSession: 0, // Time before end-session to display "leave the ice" badge in milliseconds (15000)
	};

	// Initialize appDefaults
	defaults.init();
	return defaults;
})();

// TODO: Document self-initializing object
/*
	> Purpose (this time): Access property by sibling property before the object is initialized (ie: during definition). In this case it was necessary because I was exporting the object (const) for use in another file and couldn't add work outside of the definition.

	A self-initializing object contains an initialization method (verify) that initializes the object (assigns values to the properties) then can use the properties to define other properties. My first attempt just wrapped the definition with an initialization call.

	```ts
	export interface AppDefaults {
		...
		groupStartTime: Date;
		groupStartTimeStr: String;
		init: () => void;
	}

	export const appDefaults: AppDefaults = ({
		...
		groupStartTime: new Date(new Date().setHours(0, 0, 0)),
		groupStartTimeStr: '',
		init() {this.groupStartTimeStr = format(this.groupStartTime,'HH:mm')},
	}).init
	```

	TypeScript thew errors using this technique and others that would have passed in JavaScript. Using an "immediately invoked function" (IIF) resolved those issues.

	This version threw the error "Type '() => void' is not assignable to type 'AppDefaults'". Basically I was trying to assign a function to appDefaults rather than the object pieces parts. The init() call was too close and needed another degree of separation. It would (probably) run, but (probably) wouldn't build unless I'm in a real loose compile mode.

	One solution would be to build the object then call `appDefaults.init()` separately. However, I don't think I could export that without changing it to a class. It could be an object with a constructor I suppose. (I should figure that out. Also, is an object with a constructor really just a class?).

	The final solution builds an additional wrapper around the object:

	```
	export interface AppDefaults {
		...
		groupStartTime: Date;
		groupStartTimeStr: String;
		init: () => void;
	}

	export const appDefaults: AppDefaults = (() => {
		const defaults: AppDefaults = {
			...
			groupStartTime: new Date(new Date().setHours(0, 0, 0)),
			groupStartTimeStr: '',
			init() {this.groupStartTimeStr = format(this.groupStartTime,'HH:mm')},
		};
	// Initialize the appDefaults object
	defaults.init();
	return defaults
})();
```
So, using an IIF `appDefaults` is defined an anonymous function that returns the `defaults` object which is what was originally being defined as `appDefaults`. This encapsulates the function so `appDefaults` is actually being assigned an object rather than a function.


*/
