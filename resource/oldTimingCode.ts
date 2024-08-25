// todo: deprecated by date-fns?
interface timeMath {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}

// todo: deprecated by date-fns?
const timeMath = {
	days: 1000 * 60 * 60 * 24,
	hours: 1000 * 60 * 60,
	minutes: 1000 * 60,
	seconds: 1000,
};

type setup = {
	name: string;
	startTime: string;
	sessionSpec: number;
	endTime: string;
}[];

// Placeholder team setup
const setup = [
	{
		name: 'Rhythm & Blades',
		startTime: '23:59',
		sessionSpec: 8,
		endTime: '12:08',
	},
];

//todo: get time remaining to all times (intervalToDuration as separate function)?

// interface teamSession {
// 	name: string;
// 	startTime: '';
// }
//// const { name, startTime, sessionSpec, endTime } = setup[0];
