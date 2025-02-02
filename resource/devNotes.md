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
pnpm create vite@latest`
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

````

**date-fns**

Toolset for manipulating JavaScript dates.

```bash
pnpm add date-fns
````

```ts
import {
	addMinutes,
	setHours,
	setMinutes,
	setSeconds,
	intervalToDuration,
} from 'date-fns';
```

**Shoelace**

Web component library.

- [Home and documentation](https://shoelace.style)
- [Using Shoelace with Vite bundler](https://willschenk.com/labnotes/2024/shoelace_and_vite/)

Installation for Vite (from Will Schenk article overriding Shoelace info):

```bash
pnpm add @shoelace-style/shoelace vite-plugin-static-copy vite
```

```ts
//vite.config.ts
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const iconsPath = 'node_modules/@shoelace-style/shoelace/dist/assets/icons';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: [
			{
				find: /\/assets\/icons\/(.+)/,
				replacement: `${iconsPath}/$1`,
			},
		],
	},
	build: {
		rollupOptions: {
			// external: /^lit/,
			plugins: [],
		},
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{
					src: iconsPath,
					dest: 'assets',
				},
			],
		}),
	],
});
```

VSCode code completion

```json
//.vscode/settings
{
	"html.customData": [
		"./node_modules/@shoelace-style/shoelace/dist/vscode.html-custom-data.json"
	]
}
```

Usage

```ts
// import everything (Schenk article)
import '@shoelace-style/shoelace';
```

```ts
// Cherry picking (Shoelace article)
// Import styles (Is this actually in CSS?)
import '@shoelace-style/shoelace/dist/themes/light.css';

// Import components
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/rating/rating.js';
```

**Accessing icons (original version):** Shoelace instructions use a Shoelace utility to specify the path to the icon files. This was replace by the configuration in `vite.config.ts` above.

```ts
// main.ts
// Original icon path configuration
// Import utility to set the base path to Shoelace stuff
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

// Set the base path to the folder you copied Shoelace's assets to
setBasePath('/path/to/shoelace/dist');
```

> **Sidebar: Shoelace component imports**:<br>
> Actually, any of these seem to work:
>
> ```ts
> // Straight import (for want of a better name)
> import SlButton from '@shoelace-style/shoelace/dist/components/button/button.js';
> import SlDrawer from '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
>
> // Object destructuring
> import { SlButton } from '@shoelace-style/shoelace/';
> import { SlDrawer } from '@shoelace-style/shoelace/';
>
> // Multiple objects (components automatically added to the object)
> import { SlDrawer, SLButton } from '@shoelace-style/shoelace/';
> ```

### Wrangling Form Data

\*`serialize` is **Shoelace** specific. `FormData` is not.

**Initial Source** [Shoelace: Form Controls](https://shoelace.style/getting-started/form-controls)

There are two methods available gather data from _Shoelace_ forms: the `formdata` event which populates the `FormData` interface.

**Example Form**

```html
<form>
	<sl-input id="user_name" name="user" label="Enter user name"></sl-input>
	<sl-input id="user_age" name="user-age" label="Enter user age"></sl-input>
</form>
```

**Using `FormData`**

```ts
const form = document.querySelector('form');
const data = new FormData(form);

// format: `data.get(element-name)`
console.log(`${data.get('user')}`); // value for "user"
console.log(`${data.get('user-age')}`); // value for "user-age
```

Other methods are available such as `getAll()`, `set()`, etc.

\*\*Using `serialize`

```ts
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js
const form = document.querySelector('form');
const data = serialize(form);

// format: `data.element-name`
console.log(`${data.user}`) // value for "user"
// Hyphens are not allowed as property names so you have to use key notation (verify terminology)
console.log(`${data.['user-age']}`) // value for "user-age
```

### Additional packages to check out

[postcss-font-magician](https://github.com/csstools/postcss-font-magician): automatically builds `@font-face` rules.

[postcss-utopia](https://www.npmjs.com/package/postcss-utopia): Utopia fluid type generator (beta? but it's past v1)

[postcss-assets](https://github.com/borodean/postcss-assets): Lots of stuff you can do with images such as easy referencing. Get size and other information. For example, you can set the size of a `<div>` based on the width of an image:

```css
.card {
	width: width('images/foobar.png');
}
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

**Astro** _Sidebar only_

[Astro | Scripts and Event Handling](https://docs.astro.build/en/guides/client-side-scripts/) (Astro Docs) Includes info in integrating and/or creating web components with Astro.

[Web Components in Astro](https://stevenwoodson.com/blog/web-components-in-astro/) A guy's attempt to use web components in Astro. Includes a solution for importing the JS and styles without getting errors. (resolves `HTMLElement undefined` error).

## Coding notes: How the App Works

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

- !! When looping through teams, use index to reference previous and next objects for previous and next team names. (As an alternative: Before looping through teams for actual use, loop through them to add previous and next team properties to each team object)

- See **`teams.ts` class skeleton** below for more detail

### ProgressIndicator Component

#### Dynamic/Functional Attributes

Initial values are set on application load as a starting point for animation to session start values which are set by user parameters when using the application.

**`aria-valuemax` `max-value`**

Maximum value of the timer. `aria-valuemax` is set when `max-value` is changed by the `maxValue` getter method in `ComponentController` class which is in turn set by `sessionSpec.duration` by way of the initial value of `timeController.remainingTime[].progress` Initial `progress` value is set by this if mode is `1`

Initial value: 100 (set by XX in `progressIndicator` component) then set to `maxValue` or `0` depending on `mode` attribute when session is defined.

**`progress`**

Controls timer graphic (circle). `maxValue` indicates 100% and is used to determine percentage position of the progress meter graphic given the `progress` value. `progress` is set by the `progressValue` variable. It is not allowed to exceed `maxValue` or go below 0

Initial value: 0 (set by XX in `progressIndicator`)

**`aria-valuenow`**

The current value of the progress meter for screen readers. Set to value of `progress` attribute/variable in `progressIndicator`
Initial value: 0 set in `progressIndicator` then set to initial `progress` value when session is defined.

**`data-progress-state`**

Current state of the progress meters: 'pending' (running) or 'complete'. Used to flag the completion of a timer.

Initial value: 'pending'. Set by `setProgress()` in `progressIndicator`.

**`data-progress-count`**

Controls the human readable text label. It is set by the `timeController.remainingTime[].display` variable.

Initial value: 0 (set by )

#### Static Attributes

**`id`**

Identifies the element for script handling. Set in HTML element.

Set in HTML. For our purpose:

- 'first-music'
- 'second-music'
- 'end-session'

**`label` `aria-label`**

Identifies element primarily for accessibility. For our purpose:

- 'Time until first time music plays'
- 'Time until second time music plays'
- 'Time until session ends'

`label` is set in HTML element. `aria-label` is set to the value of `label` in the `ProgressIndicator` component/class.

**`mode`**

Sets timer mode: countdown (1) or count-up (0).

Set in HTML element. For our purpose, generally `1`

**`stroke`**

Thickness of progress bar in px.

Set in HTML element. Example: '14'

**`viewbox`**

Sets the 'viewbox' of the SVG that is the timer graphic (single value/square) thereby setting the width and height of timer. Actual width is determined by CSS. This is effectively a max width.

Set in HTML element. Example: '1000'.

**`role`**

Sets the semantic role of the custom component.

Set in HTML element to 'progressbar'.

### Settings Form

#### Form items

| Label               | Element     | Type               |
| ------------------- | ----------- | ------------------ |
| Team Mode           | Radio       | boolean            |
| Number of teams     | Text Input  | number             |
| Team List           | Text Area   | [string]           |
| Group Start Time    | Text Input  | formatted string   |
| Session Length      | Select List | number (from data) |
| Pause Between Teams | Radio       | boolean            |
| Pause Seconds       | Text Input  | number             |

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

## Coding notes: Research and Explanations

### Loops, Timeouts, Promises and Synchronicity

See `On Loops, Timeouts, Promises and Synchronicity.md` here and in Notion. Mostly a conversation with the Pieces guy.

### Typing elements (`x = document.querySelector()`)

When assigning a variable to an element on a page, it extends the `Element` type. To avoid TypeScript bitching, declare the correct type along with the assignment. `Element` is the base type class from which more specific classes, for example `HTMLElement` and `SVGElement`, inherit. It only has methods and properties common to all elements.

We are mostly concerned with `HTMLElement`, which in turn is a base interface for other elements. When typing an element, use the most specific type available. Common interfaces that we would use include:

- HTMLAnchorElement
- HTMLBodyElement
- HTMLButtonElement
- HTMLCanvasElement
- HTMLDataElement
- HTMLDataListElement
- HTMLDetailsElement
- HTMLDialogElement
- HTMLDivElement
- HTMLFieldSetElement
- HTMLFormElement
- HTMLHeadElement
- HTMLHeadingElement
- HTMLImageElement
- HTMLInputElement
- HTMLLabelElement
- HTMLPictureElement
- HTMLPreElement
- HTMLProgressElement
- HTMLSlotElement
- HTMLTableElement
- FormDataEvent (Form Support)

The entire list can be found here: [Saylor Academy (local web archive)](file://HTML%20Interface.webarchive) or [Saylor Academy (original)](https://learn.saylor.org/mod/book/tool/print/index.php?id=68225)

In a lot of cases, `HTMLElement` may be sufficient, but may not include some of the methods or properties of the more specific interfaces.

Example of the button interface:

```ts
const openButton = document.querySelector<HTMLButtonElement>('#settings-btn');
```

_You also need to account for the fact that the element may not exist to avoid TypeScript errors_. When acting on an element, for example attaching an event listener, test for the existence of the element and offer an alternative if it's not there. For example.

```ts
openButton
	? openButton.addEventListener('click', () => handleClick());
	: console.error(`openButton does not exist`);
```

Alternatively you could do a trust me by adding a _non-null assertion_ (`!`). You are basically taking responsibility for making sure that the element exists. But that's not a real good idea because it will cause a runtime error if the element doesn't exist.

#### Typing custom elements (eg Shoelace)

Custom elements may (or may not) have their own interface. In the case of Shoelace, an interface matches the element, which extends `ShoelaceElement`, which I'm guessing extends `LitElement` (or something like that) which at some point extends `HTMLElement`. I found one definition in their code for `sl-drawer`:

```ts
// drawer.component.ts
export default class SlDrawer extends ShoelaceElement
```

So, when grabbing a Shoelace element:

```ts
import SlDrawer from '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.js';
const drawer = document.querySelector<SlDrawer>('#settings');
const openButton = document.querySelector<SlButton>('#settings');
```

And, of course, we need to need to satisfy TypeScript when we add our event listener. When I used `HTMLElement` as the type for `<sl-drawer>`, I got an error that `drawer.show()` didn't exist. The `<SL...>` interface fixed that. Also, when combining the button and drawer in one assignment, we need to handle the nulls for both elements. We could revert to `if` statements, but that gets a bit long winded. Doing it with a ternary looked like this:

```ts
openButton && drawer
	? openButton.addEventListener('click', () => drawer.show())
	: console.error(`Elements do not exist: openButton or drawer`);
```

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

### Accessing properties defined in the `constructor()` of a class

Properties (functions, variables, whatever) defined in the constructor of a class a scoped to the class and not available to the rest of the class. Yes, that's the definition of "scope". To allow access to these properties, declare them as a class property outside of the constructor without an initializer and then initialize them in the `constructor()`. One issue that I ran into was the TypeScript complained that the declaration was not initialized and was not seeing the initialization in the `constructor()`. I was mainly running into this in the case of objects, but it was probably other cases as well. The problem was that I was trying to define the entire object rather than just the header. The following shows examples for an object and a variable with a custom type:

```ts
// Parameters.ts

// Object interface definition
export interface FormControls {
	form: HTMLFormElement | null;
	startType: SlRadioGroup | null;
	pauseSelector: SlRadioGroup | null;
	pauseInput: SlInput | null;
	operationModeSelector: SlRadioGroup | null;
	numberInput: SlInput | null;
	teamsInput: SlTextarea | null;
}

// Variable custom type union definition
export type operationModes = 'anonymous' | 'list';

export class Parameters {
	// formControls object declared
	// Without the object members, there is no error
	formControls: FormControls;

	// mode variable declared
	// Note that const/let are not used for class members
	// However, they are used for variables inside of a class member that is a method or function
	mode: operationModes;

	constructor() {
		// Call function to create the form
		settingsForm(
			this.groupStartType,
			this.groupStartTimeStr,
			this.practiceLength,
			this.pauseBetweenSelector,
			this.pauseLength,
			this.operationMode,
			this.numberTeams,
			this.teamList,
			this.demo
		);

		// Initialize formControls now that the form exists
		// This object is also available to class members outside of the constructor
		// Notice that it references `this` and does not reference the `interface`
		this.formControls = {
			form: document.querySelector<HTMLFormElement>('form'),
			startType: document.querySelector<SlRadioGroup>('#start-type'),
			pauseSelector: document.querySelector<SlRadioGroup>(
				'#pause-between-selector'
			),
			pauseInput: document.querySelector<SlInput>('#pause-length'),
			operationModeSelector: document.querySelector<SlRadioGroup>(
				'#operation-mode-selector'
			),
			numberInput: document.querySelector<SlInput>('#number-teams'),
			teamsInput: document.querySelector<SlTextarea>('#team-list'),
		};

		// Initialize mode
		mode = 'anonymous';
	}
}
```

### Destructuring Objects on Assignment

I'm using this as input to the teamSession (or timer session) class (or at least that's what it is as of June 4). [How to Use Object Destructuring in JavaScript](https://dmitripavlutin.com/javascript-object-destructuring/), by Dmitri Pavlutin has a good walkthrough and straight forward examples of the different options. Basically its:

_As JavaScript or TypeScript with inferred type_

```js
const hero = {
	name: 'Batman',
	realName: 'Bruce Wayne',
};

const { name, realName } = hero;

console.log(name); // => 'Batman',
console.log(realName); // => 'Bruce Wayne'
```

_Or in TypeScript with inline types (as opposed to an `interface` or `type`)_

```ts
// Source: [Mastering TypeScript Array of Object: A Comprehensive Guide: Inline Type Declaration in TypeScript](https://www.dhiwise.com/post/mastering-typescript-array-of-object-a-comprehensive-guide#inline-type-declaration-in-typescript)

const hero: { name: string; realName: string } = {
	name: 'Batman',
	realName: 'Bruce Wayne',
};
```

_Or as array of objects_

```ts
const hero: { name: string; realName: string } = {
	name: 'Batman',
	realName: 'Bruce Wayne',
}[];
```

## `teams.ts` class skeleton -------------- //! This needs to be revisited after Setup revamp/think-through below (TR 240620)

\*\*COMPLEX SESSION !//

**DATA APPLIED**
**SESSION NOT STARTED**

**SETUP**

- Retrieve or build team object
- Need to somehow acquire previous and next team names

**List based run types**

- Parameters acquired directly from list

- build new array of objects for run. Add previous and next team to each object.

- Anonymous run type (contents to list object)

- Parameters plugged into list from form input so runtime uses same object.

- teamName = ""

  - in UI, if ""->button title replaces team name

- level = "" (maybe have input for level in setup if we add that label to UI)

- startTime =

  - if entered in setup, get from start time
  - if start button clicked, get from `new Date`

- duration = duration entry

- number of teams: repeat. Needs to somehow replace the number of objects in the parent array. Like, swap the forEach() loop with a while() loop or something like that.

**Both run types**

- select session specification from practiceTimes by duration (from team or setup setting)
  const sessionSpec = practiceTimes[team.duration];

- set variables for startTime and endTime for first team
- Fill Session Start and Session End badges
- Previous Team badge: empty
- Current Team badge: change label to "On Deck" and fill with first team or fill with label. Activate start button
- Next Team badge: fill with next team or fill with label if empty. Next icon inactive

- get timeRemaining to startTime

  - Run on timeRemaining timer (emphasize)
  - Change label to "Time remaining to start of session"
  - Other timers deemphasized

- Reach startTime or start button pressed or next team
- Initialize session

- Init times

  - [if first team]

    - Activate Pause icon on current team badge
    - Activate Next Team icon as appropriate

  - [if not first team]
    - set reset startTime and endTime for current team
    - Fill Session Start and Session End badges
    - Activate/Deactivate Previous and Next icons as appropriate
    - Update Current and as applicable, Previous and Next Team badges. If no team names fill badges with badge labels.

- set variables for

  - startTime
  - firstMusic
  - firstWarn
  - secondMusic
  - secondWarn
  - endTime

- set firstMusic timer - emphasize (CSS)
- set secondMusic timer - deemphasize (CSS)
- set timeRemaining timer - deemphasize (CSS)

**Reach end of session**

- deemphasize all clocks (they should already be stopped)
- clear start and stop time badges
- clear team name badges
- deactivate previous team icon (next team icon should already be deactivated)
- switch pause icon to play in current team badge and activated

**MANUAL SESSION**

- Set a time in setup
- Optional: set number of teams
- Run until pause is clicked or number of teams is exhausted

---

## Outline initial setup

### Inputs

| Name             | Input Type                             | TS Type     | Function                                                                                                               | Options                                             | Default |
| ---------------- | -------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------- |
| Session Length   | Number input                           | `number`    | Length of each practice session (minutes). Currently all sessions are equal. Future enhancement to allow for variances |                                                     | 6       |
| Pause            | Number input                           | `number`    | Length of pause between session (minutes). Currently all pauses are equal                                              |                                                     | 0       |
| Start            | Switch                                 | `number`    | How group is started                                                                                                   | Automatic (0), Scheduled (1)                        | 0       |
| Start Time       | Text input, hidden for Start:Automatic | `text`      | Time group starts if StartTime:Scheduled is selected                                                                   | Text converted to `Date` for object                 | `null`  |
| pm               | Switch                                 | `boolean`   | am (false) or pm (true)                                                                                                | Add 12 to hour if true and hour not greater than 12 |
| Teams Mode       | Toggle                                 | `number`    | How teams are shown                                                                                                    | Anonymous (0), List (1)                             | 0       |
| Team List        | Text input, hidden for Teams:Anonymous | `text area` | CR delimited list of teams. Empty for Teams:Anonymous.                                                                 |                                                     | ""      |
| Number of starts | Number input, hidden for Teams:List    | `number`    | If Teams:Anonymous, enter number of starts, 0 for infinite. If Teams:List, it's `teamList.length`                      |                                                     |         |
| Warp             | Hidden selector                        | `selector`  | Speed factor for demo                                                                                                  | 1-8                                                 | 1       |

### Object

```ts
export interface parameters {
	sessionLength: number; // Length of each practice session.
	sessionPause: number; // Length of pause between each session
	groupStartType: number; // Automatic (0) or Scheduled (1)
	groupStartTimeIn: Date;
	pm: boolean; // am (false) or pm (true)
	teamMode: number; // Anonymous (0), List (1)
	teamList: [string]; // CR delimited text to array elements
	numStarts: number; // if teamMode=0: get input; if teamMode=1: `teamList.length`
	warp: number; // Speed factor for demos
}

export const parameters = {
	// Set defaults
	sessionLength: 6, // Length of each practice session.
	sessionPause: 0, // Length of pause between each session.
	groupStartType: 0, // Automatic (0) or Scheduled (1)
	groupStartTime: null,
	teamMode: 0, // Anonymous (0), List (1)
	teamList: [], // CR delimited text to array elements
	numStarts: 8, // if teamMode=0: get input; if teamMode=1: `teamList.length`
	warp: 1, // Speed factor for demos
};
```

---

> This is the text for the original project.

## For timer

This progress meter is based on a percent. Both the `stroke-dashoffset` length and it's rotation progress around the circle are based on a percentage. I think to change it to a timer I may need a 60 based variable as well as a 100 based variable which is created from the progress of the 60 based variable.

For example, distance within the circle and circle completion are based on 100%. At the interval, check the time remaining, determine it's percentage and apply it to the circle.

```

```
