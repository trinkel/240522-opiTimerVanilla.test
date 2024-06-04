# opiTimer

_An app for timing synchronized skating official practice ice sessions._

This is a resource for announcers running an IJS official practice ice session for synchronized skating.

**Author** Tim Rinkel<br>
**Contact** [trinkel@dbugg.dev](mailto:trinkel@dbugg.dev)<br>
**Start Date:** May 22, 2024<br>
**Local:** `/Users/trinkel/Development/DevOps/USFS/Projects/opiTimer/240522-opiTimerVanilla.stack`<br>
**My Repository**:<br>
[**AI Conversation**](https://#) https://#

A fork of `240512-opiTimerAstro.stack` moving to vanilla JS on Vite.

## Packages

**Package manager:** PNPM

**Vite**

```bash
pnpm create astro@latest`
# Options
#   • Framework: Vanilla
#   • Variant: Typescript

cd <directory>
pnpm install
pnpm run dev
```

**PostCSS**

_PostCSS engine is included in Vite_

- Plugins
  - PresetEnv: a PostCSS engine
  - PostCSS Import: Combine multiple CSS files using `@import` statements
  - CSSNano: CSS minifier

```bash
pnpm add -D autoprefixer postcss-preset-env cssnano postcss-import
```

Add configuration file: `postcss.config.cjs`. See links below for example config files. The Astro doc shows a minimal one line export config. The Rodney Lab page show a more verbose expanded that allows for verbose configuration of the plugins.

### Additional packages to check out

[postcss-font-magician](https://github.com/csstools/postcss-font-magician): automatically builds `@font-face` rules.

[postcss-utopia](https://www.npmjs.com/package/postcss-utopia): Utopia fluid type generator (beta? but it's past v1)

[postcss-assets](https://github.com/borodean/postcss-assets): Lots of stuff you can do with images such as easy referencing. Get size and other information. For example, you can set the size of a `<div>` based on the width of an image:

```css
.card {
	width: width('images/foobar.png');
}
```

**date-fns**

Toolset for manipulating JavaScript dates.

```bash
pnpm add date-fns
```

```ts
import {
	addMinutes,
	setHours,
	setMinutes,
	setSeconds,
	intervalToDuration,
} from 'date-fns';
```

## Resources

**Original source for progress meter**

[Front-End solution: progress indicator](https://piccalil.li/blog/solution-009-progress-indicator)

**PostCSS**

- [Astro Docs | Styles & CSS | PostCSS ](https://docs.astro.build/en/guides/styling/#postcss) (Astro Docs)

  - PostCSS runner built into Astro via Vite. Need to install and configure any plugins.

- [An Introduction to PostCSS](https://www.sitepoint.com/an-introduction-to-postcss/) (Sitepoint, 2021)

- [Astro PostCSS Example: Future CSS Today](https://rodneylab.com/astro-postcss-example/) (Rodney Lab, 2022)

**Web Components**

[Build a Web App with Modern JavaScript and Web Components](https://www.sitepoint.com/build-frameworkless-web-app-modern-javascript-web-components/) (Sitepoint) A little dated, but comes with a [repo](https://github.com/sitepoint-editors/framework-less-web-components/tree/master) that might be interesting.

**Astro** _Sidbar only_

[Astro | Scripts and Event Handling](https://docs.astro.build/en/guides/client-side-scripts/) (Astro Docs) Includes info in integrating and/or creating web components with Astro.

[Web Components in Astro](https://stevenwoodson.com/blog/web-components-in-astro/) A guy's attempt to use web components in Astro. Includes a solution for importing the JS and styles without getting errors. (resolves `HTMLElement undefined` error).

## Scratchpad

### Function with callback

```js
// Define the function
function timer(callBack) {
...
callBack();

// Call the function with anonymous callback
timer(() => {
	// Callback function: called after timer runs have completed
	// decrement teams and restart timers until all teams run
	teams ? init() : (sessionStatus.innerText = 'Group completed');
});
```

### Timing Functions

**Theory of Operation**

> ToDo: Test rate of 'tick'. Start at 500ms. See if less takes too much proc or makes any difference.

`practiceGroup[]`: Array of team practice objects

`teamSession{}`: Object of team practice session that includes name, time specs and control functions

- On init (table)

  - Start time (read from input)
  - Duration (read from input)
  - Stop time (calc or read? From source.)
  - First music (time or duration from start? From source.)
  - First warn (calc from first music From source.)
  - Second music (time or duration from start? From source.)
  - Second warn (calc from second music From source.)
  - Overall time remaining (calc from end)
  - End warn (calc from end)

- On each tick

  - get current time
  - check time remaining to (all of above)

- Controller
  - End time
  - Time

### Buttons (footer)

**Theory of operation**

- **Start button:**
  - starts timers
  - sets session start and session end clocks
  - Swaps to pause button
- **Pause button**

  - stops timers
  - Session end clock advances showing projected end time if session restarted.

- **Forward and back buttons**
  - shift team names in footer buttons

### `teamSession` Timer Calculations — Theory of Operation

Class: `teamSession`

- getters retrieve the Date object for each segment of the session

  - first music
  - first music warning
  - second music
  - second music warning
  - time remaining in session
  - end session warning
  - end session

- getter retrieves time remaining in session

- Need getter to retrieve time remaining to each of the session segments. _?? Should that be returned as from the getter rather than the Date object or getted separately_
- !! Probably need to set Date to a variable with getter and then run time remain against the variable so we're not constantly accessing the clock (or are we?).

### Function for calculating time remaining

```js
// returns an object of unit values for date delta
export function counterMath(targetDate, todaysDate) {
	const countDown = {
		seconds: 0,
		secondsQuo: 1000,
		minutes: 0,
		minutesQuo: 1000 * 60,
		hours: 0,
		hoursQuo: 1000 * 60 * 60,
		days: 0,
		daysQuo: 1000 * 60 * 60 * 24,
	};

	const delta = targetDate - todaysDate;

	// Days
	countDown.days = Math.floor(delta / countDown.daysQuo);

	// Hours
	countDown.hours = Math.floor(
		(delta % countDown.daysQuo) / countDown.hoursQuo
	);

	// Minutes
	countDown.minutes = Math.floor(
		(delta % countDown.hoursQuo) / countDown.minutesQuo
	);

	// Seconds
	countDown.seconds = Math.round(
		(delta % countDown.minutesQuo) / countDown.secondsQuo
	);

	return countDown;
}
```

### [TypeScript] Typing an object (as `interface` with `export` for module)

```ts
export interface timeMath {
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
```

### [TypeScript] Typing an array of objects (`type` with `export` for module)

```ts
export type practiceTimes = {
	duration: number;
	firstMusic: number;
	firstWarning: number;
	secondMusic: number;
	secondWarning: number;
	endWarning: number;
}[];

export const practiceTimes: practiceTimes = [];

practiceTimes = [
	{
		duration: 6,
		firstMusic: 1.25,
		firstWarning: 0.25,
		secondMusic: 3.75,
		secondWarning: 0.25,
		endWarning: 1,
	},
	{
		duration: 7,
		firstMusic: 1.5,
		firstWarning: 0.25,
		secondMusic: 4.5,
		secondWarning: 0.25,
		endWarning: 1,
	},
];
```

---

> This is the text for the original project.

## For timer

This progress meter is based on a percent. Both the `stroke-dashoffset` length and it's rotation progress around the circle are based on a percentage. I think to change it to a timer I may need a 60 based variable as well as a 100 based variable which is created from the progress of the 60 based variable.

For example, distance within the circle and circle completion are based on 100%. At the interval, check the time remaining, determine it's percentage and apply it to the circle.
