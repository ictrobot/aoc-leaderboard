import {request} from "https";

export function fetchLeaderboard(session: string, year: string, leaderboardID: string): Promise<Leaderboard> {
    const url = `https://adventofcode.com/${year}/leaderboard/private/view/${leaderboardID}.json`;
    return new Promise<Leaderboard>(resolve => request(url, {
            headers: {
                cookie: `session=${session}`
            }
        }).on('response', (r) => {
            let data = '';

            r.on('data', (chunk) => {
                data += chunk;
            })
            r.on('end', () => {
                resolve(JSON.parse(data));
            });
        }).end()
    );
}

export function analyzePoints(l: Leaderboard): [Completion[], Available[]]{
    const events: Completion[] = [];

    for (const member of Object.values(l.members)) {
        for (const day of DAYS) {
            const dayResults = member.completion_day_level[day];
            if (!dayResults) continue;

            for (const part of PARTS) {
                const partResults = dayResults[part];
                if (!partResults) continue;

                events.push({member, day, part, ts: partResults.get_star_ts, points: 0})
            }
        }
    }
    events.sort((x, y) => x.ts - y.ts);

    const pointsAvailable = new Map<Day, Map<Part, number>>();
    const numMembers = Object.values(l.members).length;
    for (const event of events) {
        if (!pointsAvailable.has(event.day)) {
            pointsAvailable.set(event.day, new Map<Part, number>().set('1', numMembers).set('2', numMembers));
        }

        const earned = pointsAvailable.get(event.day)!.get(event.part)!;
        pointsAvailable.get(event.day)!.set(event.part, earned - 1);
        event.points = earned;
    }

    const available = [];
    for (const [day, partsMap] of pointsAvailable.entries()) {
        for (const [part, points] of partsMap.entries()) {
            available.push({day, part, points});
        }
    }

    return [events, available];
}

// Leaderboard types
export interface Leaderboard {
    event: string,
    owner_id: string,
    members: {[id: string]: Member};
}

export interface Member {
    id: string,
    name: string | null,
    stars: number,
    local_score: number,
    global_score: number,
    last_star_ts: number | '0',
    completion_day_level: CompletionDayLevel
}

export type CompletionDayLevel = {
    [day in Day]?: {
        '1': {get_star_ts: number},
        '2'?: {get_star_ts: number}
    }
}

export type Day = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21' | '22' | '23' | '24' | '25';
export const DAYS: ReadonlyArray<Day> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'] as const;

export type Part = '1' | '2';
export const PARTS: ReadonlyArray<Part> = ['1', '2'] as const;

// Custom types
export interface Completion {
    member: Member;
    day: Day;
    part: Part;
    ts: number;
    points: number;
}

export interface Available {
    day: Day;
    part: Part;
    points: number;
}
