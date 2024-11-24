import { format } from 'date-fns';

export class ClockBadges {
	// Clock badge elements
	clocksStartTime = document.getElementById(
		'start-time-contents'
	) as HTMLElement;
	clocksCurrentTime = document.getElementById(
		'current-time-contents'
	) as HTMLElement;
	clocksEndTime = document.getElementById('end-time-contents') as HTMLElement;

	// Current Time Interval Selector
	currentTimeIntervalId: number;

	constructor(public now: Date, public tick: number) {
		this.currentTimeIntervalId = setInterval(() => {
			this.setClocksCurrentTime(new Date());
		}, this.tick);

		// this.setClocksStartTime(new Date(new Date().setHours(0, 0, 0)));

		// this.setClocksEndTime(new Date(new Date().setHours(0, 0, 0)));
	}

	setClocksCurrentTime(time: Date): void {
		this.clocksCurrentTime.textContent = format(time, 'h:mm:ss');
	}

	setClocksStartTime(time: Date): void {
		console.log(`Start Time Badge: ${time}`);
		this.clocksStartTime.textContent = format(time, 'h:mm:ss');
	}

	setClocksEndTime(time: Date): void {
		this.clocksEndTime.textContent = format(time, 'h:mm:ss');
	}

	endTime(): void {
		clearInterval(this.currentTimeIntervalId);
	}
}
