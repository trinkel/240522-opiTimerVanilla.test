// Time utilities
import { addMinutes, setHours, setMinutes, setSeconds } from 'date-fns';

function setTime(time: string): Date {
	let date = new Date();
	if (time.split(':').length === 3) {
		date = setHours(date, Number(time.split(':')[0]));
		date = setMinutes(date, Number(time.split(':')[1]));
		date = setSeconds(date, Number(time.split(':')[2]));
	} else {
		date = setHours(date, Number(time.split(':')[0]));
		date = setMinutes(date, Number(time.split(':')[1]));
		date = setSeconds(date, 0);
	}
	return date;
}

interface timeMath {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}

const timeMath = {
	days: 1000 * 60 * 60 * 24,
	hours: 1000 * 60 * 60,
	minutes: 1000 * 60,
	seconds: 1000,
};

// Placeholder team setup
const setup = [
	{
		name: 'Rhythm & Blades',
		startTime: '12:00',
		sessionSpec: 'eight',
		endTime: '12:08',
	},
	{
		name: '',
		startTime: '',
		sessionSpec: '',
		endTime: '',
	},
];

// Placeholder practice timetable
const practiceTimes = {
	eight: {
		duration: 8,
		firstMusic: 1.5,
		firstWarning: 0.5,
		secondMusic: 4.5,
		secondWarning: 0.5,
		endWarning: 1,
	},
};

interface teamSession {
	name: string;
	startTime: '';
}

const teamSession = {
	// Set team basics from ${setup}
	name: setup[0].name || 'Rhythm & Blades',

	startTime: setTime(setup[0].startTime),

	// reference to practice session spec
	sessionSpec: practiceTimes[setup[0].sessionSpec],

	// getters based on ${practiceTimes}
	get current(): Date {
		return new Date();
	},

	get firstMusic(): Date {
		return addMinutes(this.startTime, this.sessionSpec.firstMusic);
	},

	get firstWarn(): Date {
		return addMinutes(this.firstMusic, this.sessionSpec.firstWarning * -1);
	},

	get secondMusic(): Date {
		return addMinutes(this.startTime, this.sessionSpec.secondMusic);
	},

	get secondWarn(): Date {
		return addMinutes(this.secondMusic, this.sessionSpec.secondWarning * -1);
	},

	get stopTime(): Date {
		// return addMinutes(this.startTime, 1.5);
		return addMinutes(this.startTime, this.sessionSpec.duration);
	},
};

//ToDo (HERE): See DevNotes | **Function for calculating time remaining** for time remaining function.
// should it be a getter or separate function?
// replaces `timeMath` above?
// also not how it is exported as it is defined. Do that for these functions as well

export default teamSession;
