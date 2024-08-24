# On Loops, Timeouts, Promises and Synchronicity

Trying to get a loop to run with pauses using `setTimeout()`, `setInterval()` or whatever. Issue is, while the pauses work, the code continues asynchronously. _Pieces_ presented three solutions:

- Plain loops combining `setTimeout()` and `setInterval()`
- The same using a `promise`
- Using `async`/`await` with the `promise`

---

## Logging Message Repeatedly at Intervals in JavaScript using `setTimeout()` and `setInterval()`

📝 Description ==============================

A JavaScript function that logs a message repeatedly at specified intervals using setInterval and clearInterval.

🌐 Language Classifications with Confidence ===============

JAVASCRIPT 80.50%
HTML 73.54%
TYPESCRIPT 41.20%
COFFEESCRIPT 18.83%
MARKDOWN 14.53%

🏷️ Tags =====================================

#OUTPUT, #CONSOLE, #REPEATING, #SETINTERVAL_OBJECT, #CLEARINTERVAL_VARIABLE, #MESSAGE_PARAMETER, #REPETITIONS_PARAMETER, #COUNT_VARIABLE, #INTERVALID_VARIABLE

🔗 Related Links ============================

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String

➡️ Origin ===================================

VS Code Extension

❤️ Made with love by the Pieces Team ========

```js
function writeToLog(message) {
	console.log(message);
}

function writeToLogRepeatedly(message, repetitions) {
	let count = 0;
	const intervalId = setInterval(() => {
		writeToLog(message);
		count++;
		if (count === repetitions) {
			clearInterval(intervalId);
		}
	}, 2000);

	setTimeout(() => {
		clearInterval(intervalId);
	}, repetitions * 2000);
}

// Call the function to write to log every two seconds for one minute, repeating five times
writeToLogRepeatedly('Logging every 2 seconds for 1 minute', 5);
```

## Logging Messages at Regular Intervals with Promises in JavaScript

📝 Description ==============================

A JavaScript code snippet that demonstrates logging messages at regular intervals using promises and async functions.

🌐 Language Classifications with Confidence ===============

JAVASCRIPT 80.83%
HTML 73.81%
TYPESCRIPT 38.82%
COFFEESCRIPT 20.03%
MARKDOWN 15.55%

🏷️ Tags =====================================

#PROMISE, #INTERVAL, #ASYNC, #LOGGING, #WRITETOLOG, #WRITETOLOGREPEATEDLY, #PROMISE, #SETINTERVAL, #CLEARINTERVAL, #SETTIMEOUT, #LOGEVERYTWOSECONDSFORONEMINUTE, #ASYNCHRONOUS_FUNCTION, #CONSOLE_LOG, #ERROR_HANDLING

👥 People ===================================

trinkel@dbugg.dev - trinkel@dbugg.dev

🔗 Related Links ============================

https://www.freecodecamp.org/news/javascript-async-await-tutorial-learn-callbacks-promises-async-await-by-making-icecream/
https://javascript.info/promise-error-handling
https://javascript.info/settimeout-setinterval
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then

➡️ Origin ===================================

VS Code Extension

❤️ Made with love by the Pieces Team ========

```js
function writeToLog(message) {
	console.log(message);
}

function writeToLogRepeatedly(message, repetitions) {
	return new Promise((resolve, reject) => {
		let count = 0;
		const intervalId = setInterval(() => {
			writeToLog(message);
			count++;
			if (count === repetitions) {
				clearInterval(intervalId);
				resolve();
			}
		}, 2000);

		setTimeout(() => {
			clearInterval(intervalId);
			if (count < repetitions) {
				reject(new Error('Logging stopped prematurely'));
			}
		}, repetitions * 2000);
	});
}

async function logEveryTwoSecondsForOneMinute() {
	try {
		for (let i = 0; i < 5; i++) {
			await writeToLogRepeatedly('Logging every 2 seconds for 1 minute', 30);
		}
		console.log('Logging completed successfully');
	} catch (error) {
		console.error(error.message);
	}
}

// Call the async function
logEveryTwoSecondsForOneMinute();
```

## Logging Messages at Regular Intervals with `Promises` in JavaScript using `async`/`await`

📝 Description ==============================

A JavaScript code snippet that demonstrates logging messages at regular intervals using promises and async functions.

🌐 Language Classifications with Confidence ===============

JAVASCRIPT 80.83%
HTML 73.81%
TYPESCRIPT 38.82%
COFFEESCRIPT 20.03%
MARKDOWN 15.55%

🏷️ Tags =====================================

#PROMISE, #INTERVAL, #ASYNC, #LOGGING, #WRITETOLOG, #WRITETOLOGREPEATEDLY, #PROMISE, #SETINTERVAL, #CLEARINTERVAL, #SETTIMEOUT, #LOGEVERYTWOSECONDSFORONEMINUTE, #ASYNCHRONOUS_FUNCTION, #CONSOLE_LOG, #ERROR_HANDLING

👥 People ===================================

trinkel@dbugg.dev - trinkel@dbugg.dev

🔗 Related Links ============================

https://www.freecodecamp.org/news/javascript-async-await-tutorial-learn-callbacks-promises-async-await-by-making-icecream/
https://javascript.info/promise-error-handling
https://javascript.info/settimeout-setinterval
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then

➡️ Origin ===================================

VS Code Extension

❤️ Made with love by the Pieces Team ========

```js
function writeToLog(message) {
	console.log(message);
}

function writeToLogRepeatedly(message, repetitions) {
	return new Promise((resolve, reject) => {
		let count = 0;
		const intervalId = setInterval(() => {
			writeToLog(message);
			count++;
			if (count === repetitions) {
				clearInterval(intervalId);
				resolve();
			}
		}, 2000);

		setTimeout(() => {
			clearInterval(intervalId);
			if (count < repetitions) {
				reject(new Error('Logging stopped prematurely'));
			}
		}, repetitions * 2000);
	});
}

async function logEveryTwoSecondsForOneMinute() {
	try {
		for (let i = 0; i < 5; i++) {
			await writeToLogRepeatedly('Logging every 2 seconds for 1 minute', 30);
		}
		console.log('Logging completed successfully');
	} catch (error) {
		console.error(error.message);
	}
}
```

## Using `async`/`await` vs just `Promise`

Using `async/await` in JavaScript provides several advantages over traditional promise chaining or callback-based approaches. Here are some reasons why you might prefer using `async/await`:

1. **Readability and Maintainability**:

   - **Synchronous-like Code**: `async/await` allows you to write asynchronous code that looks and behaves like synchronous code. This makes it easier to read and understand, especially for developers who are more familiar with synchronous programming.
   - **Less Nesting**: It helps to avoid the "callback hell" or deeply nested promise chains, making the code cleaner and more maintainable.

2. **Error Handling**:

   - **Try/Catch Blocks**: With `async/await`, you can use `try/catch` blocks to handle errors, which is more intuitive and consistent with error handling in synchronous code. This can make debugging and error handling more straightforward.

3. **Sequential Execution**:

   - **Control Flow**: `async/await` makes it easier to write code that executes sequentially, which can be more intuitive when you need to perform a series of asynchronous operations in a specific order.

4. **Debugging**:

   - **Stack Traces**: Debugging `async/await` code can be simpler because stack traces are often easier to follow compared to those generated by promise chains or callbacks.

5. **Code Refactoring**:
   - **Modularity**: Refactoring code to extract functions or change the order of operations can be easier with `async/await` because the code structure is more linear and less nested.

Here's a comparison to illustrate these points:

### Using Promises

```javascript
function fetchData() {
	return fetch('https://api.example.com/data')
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			return data;
		})
		.catch((error) => {
			console.error('Error:', error);
		});
}

fetchData();
```

### Using Async/Await

```javascript
async function fetchData() {
	try {
		const response = await fetch('https://api.example.com/data');
		const data = await response.json();
		console.log(data);
		return data;
	} catch (error) {
		console.error('Error:', error);
	}
}

fetchData();
```

In the `async/await` version, the code is more linear and easier to follow. The error handling is also more straightforward with the `try/catch` block.

In summary, while both approaches are valid and can be used effectively, `async/await` often provides a more readable, maintainable, and debuggable way to handle asynchronous operations in JavaScript.
