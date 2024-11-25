export type practiceTimes = {
	duration: number;
	firstMusic: number;
	firstWarning: number;
	secondMusic: number;
	secondWarning: number;
	endWarning: number;
}[];

// Practice timetable per section 2940 of the US Figure Skating Rule Book (2023–24 Rulebook.pdf page 139)

export const practiceTimes: practiceTimes = [];

// ! Times for testing only
practiceTimes[1] = {
	duration: 1,
	firstMusic: 0.25,
	firstWarning: 0.1,
	secondMusic: 0.5,
	secondWarning: 0.1,
	endWarning: 0.75,
};

// ! Times for testing only
practiceTimes[2] = {
	duration: 2,
	firstMusic: 0.5,
	firstWarning: 0.25,
	secondMusic: 1,
	secondWarning: 0.25,
	endWarning: 0.75,
};

practiceTimes[6] = {
	duration: 6,
	firstMusic: 1.25,
	firstWarning: 0.25,
	secondMusic: 3.75,
	secondWarning: 0.25,
	endWarning: 1,
};

practiceTimes[7] = {
	duration: 7,
	firstMusic: 1.5,
	firstWarning: 0.25,
	secondMusic: 4.5,
	secondWarning: 0.25,
	endWarning: 1,
};

practiceTimes[8] = {
	duration: 8,
	firstMusic: 1.5,
	firstWarning: 0.5,
	secondMusic: 5,
	secondWarning: 0.5,
	endWarning: 1,
};

practiceTimes[10] = {
	duration: 10,
	firstMusic: 1.5,
	firstWarning: 0.5,
	secondMusic: 6,
	secondWarning: 0.5,
	endWarning: 1,
};

practiceTimes[11] = {
	duration: 11,
	firstMusic: 1.5,
	firstWarning: 0.5,
	secondMusic: 7,
	secondWarning: 0.5,
	endWarning: 1,
};

practiceTimes[12] = {
	duration: 12,
	firstMusic: 1.5,
	firstWarning: 0.5,
	secondMusic: 7,
	secondWarning: 0.5,
	endWarning: 1,
};

// export default practiceTimes;
