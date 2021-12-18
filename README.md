aoc-leaderboard
====================

Advent of Code private leaderboard API fetcher with TS types, and a CLI to display all the information from the API.

## CLI Usage

```
AOC_SESSION=YOUR_COOKIE_HERE npx @ictrobot/aoc-leaderboard <leaderboard_id> [year]
```

(year defaults to this year in december, and the previous year otherwise)

- `AOC_SESSION` is required to access the API, and should be set to the value of your `session` cookie on `adventofcode.com`
- `leaderboard_id` and `year` come from the URL of the private leaderboard, i.e. `https://adventofcode.com/YEAR/leaderboard/private/view/LEADERBOARD_ID`

## TS Usage

```
import {fetchLeaderboard} from "@ictrobot/aoc-leaderboard";

const sessionCookie = "A LONG HEX STRING";
const year = "2021";
const leaderboardID = "12345";

const leaderboard = await fetchLeaderboard(sessionCookie, year, leaderboardID)
```

## License
[MIT License](/LICENSE).
