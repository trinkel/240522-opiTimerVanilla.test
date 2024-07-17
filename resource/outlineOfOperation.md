# Operation outline [started 240616]

[App page] `index.html`

[App base script] `main.ts`

- [Class] `Parameters()`

  - Defines practice group and sessions either hard coded or entered by form

- [Class] `componentController`

  - Creates event handlers for Progress Indicators
  - `numStarts` is not used for looping here. Rather it is used for tracking and posting the remaining number of starts to the interface.
  - Additional components should be added here.

- [Class] `timeController`
  - Determines times for each timer based on input parameters
  - Performs time manipulations for running the timers
  - Two parameters:
    - `duration` set in advance in parameters
    - `starttime` - known in advance (set by start time in parameters)
      or - on demand (press start button)
  - When application starts (and parameters are set) `timeController` is activated but may be in: - a ready or primed state either counting down to defined start time at which point timers are started and runs for `numStarts` times (or until stopped)
    or - idly waiting for start button to be pushed at which point timers are started and runs for `numStarts` times (or until stopped)

[240717] \\TODO & \\ HERE
(from ProgressIndicator project)

- Need to call init() and timer() somehow to start the clock
