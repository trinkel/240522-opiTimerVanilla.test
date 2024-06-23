# opiTimer

_An app for timing synchronized skating official practice ice sessions._

This is a resource for announcers running an IJS official practice ice session for synchronized skating.

**Author** Tim Rinkel<br>
**Contact** [trinkel@dbugg.dev](mailto:trinkel@dbugg.dev)<br>
**Start Date:** May 22, 2024<br>
**Local:** `/Users/trinkel/Development/DevOps/USFS/Projects/opiTimer/240522-opiTimerVanilla.stack`<br>
**My Repository**:<br>
[**AI Conversation**](https://#) https://#
[**Notion Notes**](https://www.notion.so/opiTimer-1dd28742e2cf455d83518dd407ffb010?pvs=4)

A fork of `240512-opiTimerAstro.stack` moving to vanilla JS on Vite.

## Theory of Operation

A typical session looks something like this:

| Duration | Team            | Enter       | First Music Warning | Begin Music | Second Music Warning | Begin Music | Time Remaining | Leave       |
| -------- | --------------- | ----------- | ------------------- | ----------- | -------------------- | ----------- | -------------- | ----------- |
| 7        | Glenview Blades | 12:00:00 PM | 12:01:15 PM         | 12:01:30 PM | 12:04:15 PM          | 12:04:30 PM | 12:06:00 PM    | 12:07:00 PM |

The session is split into three timers: First Music, Second Music and End of Session. Each timer also signals the appropriate warning

## Progress Cycles

### Status

> (This may be different from the timer description. You need to decide. Basically, do you want a warning ahead of the time warning, or is the time warning indicated as the time worning and critical is the end of the cycle. The former is used in the description below.)

Indicated by color, controlled by custom property with 700 and 100 color states for now, probably 100 being background, 700 being foreground. For example border of timer is 700 and interior is 100.

- **Active:** Start of cycle. Probably green.

- **Warning:** Get ready to do something. Defined by variable for like five seconds before 30 second warning (one minute for final timer). Probably yellow.

- **Critical:** Do something. Like call 30 second warning for music. Critical music button comes up at start music time.

- **Stopped:** Timer no longer active (or not started). Probably gray. Fades from critical to stopped at end of timer.

For border, change svg stroke color.

For background, use radial gradient against --neutral100 background. Color is something like 0 to `(indicatorStatus[i].progressValue / indicatorStatus[i].maxValue) turns`.

So, timer starts neutral background and border:

- When timer starts, it has green background with solid green border which opens clockwise from 12:00.

- At warning time for warning, background and border turn yellow.

- At music warning, background and border turn red

- At music time (or end of session) Start music badge appears, next timer takes precedence. Current timer recedes and fade to neutral color.ß
