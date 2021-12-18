import {fetchLeaderboard, analyzePoints, Completion, Leaderboard} from './leaderboard';

function tsString(ts: number = new Date().getTime() / 1000) {
    const date = new Date(ts * 1000);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

function pointString(points: number, before?: string) {
    return `${points} ${before ?? ''}point${points !== 1 ? 's' : ''}`
}

function completionString(completion: Completion, includeName = true) {
    return tsString(completion.ts) + (includeName ? ' ' + (completion.member.name ?? '#' + completion.member.id) : '')
        + ` completed day ${completion.day} part ${completion.part}, earning ${pointString(completion.points)}`;
}

export function displayLeaderboard(leaderboard: Leaderboard) {
    const [completions, available] = analyzePoints(leaderboard);

    for (const completion of completions) {
        console.log(completionString(completion));
    }
    console.log(`Updated ${tsString()}\n`)

    for (const member of Object.values(leaderboard.members).sort((x, y) => y.local_score - x.local_score)) {
        if (Object.values(member.completion_day_level).length === 0) continue;
        console.log(`\n${member.name ?? '#' + member.id}\n========================================`);

        let memberAvailable = available.slice();
        for (const completion of completions.filter(x => x.member === member)) {
            console.log(completionString(completion, false));
            memberAvailable = memberAvailable.filter(x => x.day !== completion.day || x.part !== completion.part);
        }

        if (memberAvailable.length) {
            const sum = memberAvailable.reduce((total, x) => total + x.points, 0);
            console.log(`TOTAL ${pointString(member.local_score)} (${sum} available, ${member.local_score + sum} max possible)`);
        } else {
            console.log(`TOTAL ${pointString(member.local_score)}`)
        }

        if (member.global_score > 0) {
            console.log(`GLOBAL ${pointString(member.global_score)}`);
        }
    }
    console.log('\n')

    for (const {day, part, points} of available) {
        console.log(`Day ${day} part ${part} - ${pointString(points)} available`);
    }
    const totalAvailable = available.reduce((total, a) => total + a.points, 0);
    console.log(`${pointString(totalAvailable, 'total ')} available`);
}

if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        throw new Error('Usage: <leaderboardID> [year]');
    }

    const leaderboardID = args[0];
    let year = args[1];
    if (!year) {
        const d = new Date();
        if (d.getMonth() === 11) {
            year = d.getUTCFullYear().toString();
        } else {
            year = (d.getUTCFullYear() - 1).toString();
        }
    }

    const session = process.env['AOC_SESSION'];
    if (!session) throw new Error('Expected $AOC_SESSION environment variable to be set')

    fetchLeaderboard(session, year, leaderboardID).then(displayLeaderboard);
}
