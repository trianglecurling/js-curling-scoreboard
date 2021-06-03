(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.scoreboard = {}));
}(this, (function (exports) { 'use strict';

    // scoreboard.ts
    /**
     * js-curling-scoreboard is a standalone, dependency-free JavaScript
     * module that renders DOM to show a curling scoreboard.
     * @module
     */
    function enumerate(array) {
        return array.map((e, i) => [i, e]);
    }
    function uuidv4() {
        return (String(1e7) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (parseInt(c, 10) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (parseInt(c, 10) / 4)))).toString(16));
    }
    const defaultStyle = {
        team1Color: "rgb(255, 134, 134)",
        team2Color: "rgb(255, 255, 74)",
        team3Color: "rgb(114, 186, 255)",
        backgroundColor: "#fff",
        foregroundColor: "#000",
        scoreIndicatorNumberColor: "#f00",
        flashBackgroundColor: "rgb(255, 233, 37)",
        scoresFontSize: "max(3vw, 24px)",
        textFontSize: "max(1.6vw, 16px)",
        borderSize: "3px",
        borderColor: "var(--foregroundColor)",
        gridLineSize: "1px",
        borderRadius: "11px",
        fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`,
        fontWeight: "bold",
    };
    /**
     * Given a list of ends played, return the total score of each team.
     * @param ends
     * @returns
     */
    function getScore(ends) {
        return {
            team1: ends.map((e) => e.team1Points).reduce((p, c) => p + c, 0),
            team2: ends.map((e) => e.team2Points).reduce((p, c) => p + c, 0),
        };
    }
    /**
     * Returns the team (0 or 1) which has hammer after the given ends. If no ends
     * have been played, or only blanks have been scored, use LSFE to deduce the
     * hammer team.
     *
     * If doubles is true, blank ends cause hammer to go to the other team.
     *
     * @param ends
     * @param LSFE
     * @param doubles
     * @returns 0 if the top team, 1 if the bottom team, or undefined if LSFE is needed but unknown.
     */
    function getHammerTeam(ends, LSFE, doubles = false) {
        if (doubles) {
            let lastScoringEnd = -1;
            let lastScoringTeam = LSFE;
            for (const [i, end] of enumerate(ends)) {
                if (!(end.team1Points === 0 && end.team2Points === 0)) {
                    lastScoringEnd = i;
                    lastScoringTeam = end.team1Points > end.team2Points ? 0 : 1;
                }
            }
            const switchBecauseOfBlanks = (ends.length - lastScoringEnd + 1) % 2 === 1;
            if (lastScoringTeam === undefined) {
                return undefined;
            }
            return switchBecauseOfBlanks ? lastScoringTeam : ((lastScoringTeam + 1) % 2);
        }
        else {
            const nonBlankEnds = ends.filter((e) => e.team1Points !== 0 || e.team2Points !== 0);
            if (nonBlankEnds.length === 0) {
                return LSFE;
            }
            return nonBlankEnds.reverse()[0].team1Points === 0 ? 0 : 1;
        }
    }
    /**
     * Given a list of ends played, return a data structure indicating the
     * positions to hang cards for a club-style scoreboard.
     * @param ends
     * @returns ClubStyleCards
     */
    function getClubStyleCardIndexes(ends) {
        let topScore = 0;
        let bottomScore = 0;
        const score = getScore(ends);
        const arrSize = Math.max(12, score.team1, score.team2);
        const team1Line = new Array(arrSize).fill(undefined);
        const team2Line = new Array(arrSize).fill(undefined);
        const blanks = new Set();
        for (const [i, end] of enumerate(ends)) {
            const cardNum = i + 1;
            if (end.team1Points > 0) {
                topScore += end.team1Points;
                team1Line[topScore - 1] = cardNum;
            }
            else if (end.team2Points > 0) {
                bottomScore += end.team2Points;
                team2Line[bottomScore - 1] = cardNum;
            }
            else if (end.team1Points === 0 && end.team2Points === 0) {
                blanks.add(cardNum);
            }
            else {
                throw new Error("Only one team can score in a given end.");
            }
        }
        return { team1Line, team2Line, blanks };
    }
    /**
     * Generates end-by-end scores from data formatted as you would see on a club-style scoreboard.
     *
     * Each line (team1Line, team2Line) should contain an array of string arrays. Each item in the
     * outer array should be an array of length 0 or 1. An array of length 0 represents no card
     * in the spot labeled with <outer array index> + 1 points. An array of length 1 represents
     * a card hanging in that spot, the value of which is the string in that length-1 array.
     *
     * The last element of the outer array represents blank ends. The string array in the last
     * element may have multiple elements, representing multiple ends that were blanked.
     *
     * **Mode**
     *
     * When mode is strict, any of the following conditions result in an Error being thrown:
     * - A end card is represented multiple times.
     * - The end cards are out of order
     * - An end card is missing (incomplete games are fine, but skipped ends are not).
     * - An end of more than 8 points is represented.
     *
     * When mode is lenient, the following actions are taken for the same conditions:
     * - A end card is represented multiple times.
     *      First, we will check if any ends are missing. If so, the second instance of a card takes the place of the missing end.
     *      Otherwise, treat the duplicated end card as the next in-order end.
     * - The end cards are out of order
     *      The out-of-order card is treated as though it has wrapped around. For instance, if
     *      the maximum point value represented by a scoreboard is 12, and an out-of-order end
     *      card is found above a 3, that card is treated as though it represents 15 points.
     * - An end card is missing (i.e. a skipped end).
     *      The end that is missing a card is considered blank. This can happen if there are no
     *      blank spaces on the scoreboard, or if they are full.
     * - An end of more than 8 points is represented.
     *      The end that is represented with a score of more than 8 is considered blank. This can
     *      happen if there are no blank spaces on the scoreboard, or if they are full.
     *
     * @param lines
     * @param mode
     * @returns
     */
    function getEndsFromClubStyle(lines, mode = "lenient") {
        // Make sure both lines are the same length
        if (lines.team1Line.length !== lines.team2Line.length) {
            throw new Error("Lines must be of the same length.");
        }
        const { team1Line, team2Line } = lines;
        const blanks = new Set(lines.blanks);
        // Maps end numbers to point values
        const endToPoints = {};
        const duplicatedEndCards = [];
        for (let i = 0; i < team1Line.length; ++i) {
            const topCard = team1Line[i];
            const botCard = team2Line[i];
            if (topCard) {
                if (!endToPoints[topCard]) {
                    endToPoints[topCard] = { points: i + 1, team: 0 };
                }
                else {
                    duplicatedEndCards.push({ endNumber: topCard, points: i + 1, team: 0 });
                }
            }
            if (botCard) {
                if (!endToPoints[botCard]) {
                    endToPoints[botCard] = { points: i + 1, team: 1 };
                }
                else {
                    duplicatedEndCards.push({ endNumber: botCard, points: i + 1, team: 1 });
                }
            }
        }
        for (const endNo of blanks) {
            if (!endToPoints[endNo]) {
                endToPoints[endNo] = { points: 0, team: 0 };
            }
            else {
                duplicatedEndCards.push({ endNumber: endNo, points: 0, team: 0 });
            }
        }
        // Normalize data or generate errors, based on mode.
        if (duplicatedEndCards.length > 0 && mode === "strict") {
            throw new Error("Encountered duplicate end cards.");
        }
        let maxEndRepresented = Math.max(...Object.keys(endToPoints).map(Number), 0);
        for (let i = 1; i <= maxEndRepresented; ++i) {
            if (endToPoints[i] === undefined) {
                if (mode === "strict") {
                    throw new Error(`Missing card for end ${i}.`);
                }
                else if (mode === "lenient") {
                    const duplicatedCard = duplicatedEndCards.shift();
                    if (duplicatedCard) {
                        endToPoints[i] = { points: duplicatedCard.points, team: duplicatedCard.team };
                    }
                    else {
                        blanks.add(i);
                        endToPoints[i] = { points: 0, team: 0 };
                    }
                }
            }
        }
        for (const duplicatedCard of duplicatedEndCards) {
            maxEndRepresented++;
            endToPoints[maxEndRepresented] = { points: duplicatedCard.points, team: duplicatedCard.team };
        }
        // Build out the ends
        const ends = [];
        let team1Score = 0;
        let team2Score = 0;
        for (let i = 1; i <= maxEndRepresented; ++i) {
            let team1Points = 0;
            let team2Points = 0;
            if (endToPoints[i].points !== 0) {
                if (endToPoints[i].team === 0) {
                    team1Points = endToPoints[i].points - team1Score;
                    if (team1Points > 8) {
                        if (mode === "strict") {
                            throw new Error("Invalid score reported for Team 1 (more than 8 points).");
                        }
                        else if (mode === "lenient") {
                            team1Points = 0;
                        }
                    }
                    if (team1Points < 0) {
                        if (mode === "strict") {
                            throw new Error("Encountered out of order end cards.");
                        }
                        else if (mode === "lenient") {
                            endToPoints[i].points += team1Line.length;
                            team1Points = endToPoints[i].points - team1Score;
                        }
                    }
                    team1Score = endToPoints[i].points;
                }
                if (endToPoints[i].team === 1) {
                    team2Points = endToPoints[i].points - team2Score;
                    if (team2Points > 8) {
                        if (mode === "strict") {
                            throw new Error("Invalid score reported for Team 2 (more than 8 points).");
                        }
                        else if (mode === "lenient") {
                            team2Points = 0;
                        }
                    }
                    if (team2Points < 0) {
                        if (mode === "strict") {
                            throw new Error("Encountered out of order end cards.");
                        }
                        else if (mode === "lenient") {
                            endToPoints[i].points += team2Line.length;
                            team2Points = endToPoints[i].points - team2Score;
                        }
                    }
                    team2Score = endToPoints[i].points;
                }
            }
            ends.push({ team1Points, team2Points });
        }
        return ends;
    }
    let once = false;
    function ensureStyles(additionalCssRules = []) {
        if (once) {
            return;
        }
        once = true;
        const styleEl = document.createElement("style");
        document.head.append(styleEl);
        const styleSheet = styleEl.sheet;
        const rules = [
            `.scoreboard-container {
            box-sizing: border-box;
            font-family: var(--fontFamily);
            display: grid;
            grid-template-rows: 1fr 1fr 1fr;
            border: var(--borderSize) solid var(--borderColor);
            font-size: var(--scoresFontSize);
            font-weight: var(--fontWeight);
            background-color: var(--foregroundColor);
            gap: var(--gridLineSize);
            border-radius: var(--borderRadius);
        }`,
            `.scoreboard-container * {
            box-sizing: inherit;
        }`,
            `.scoreboard-container .scoreboard-score-cell {
            color: var(--scoreIndicatorNumberColor);
        }`,
            `.scoreboard-container :is(.blank-end-cell,.end-label-cell,.total-label-cell,.team-label-cell) {
            text-transform: uppercase;
            color: var(--foregroundColor);
            font-size: var(--textFontSize);
        }`,
            `.scoreboard-container .scoreboard-cell {
            background-color: var(--backgroundColor);
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            min-width: 0;
            transition: background-color 3s ease-out 3s;
        }`,
            `.scoreboard-container .flash {
            background-color: var(--flashBackgroundColor) !important;
        }`,
            `.scoreboard-container .scoreboard-cell.blank-cell {
            word-spacing: 0.5em;
        }`,
            `.scoreboard-container .scoreboard-cell.tl {
            border-top-left-radius: calc(var(--borderRadius) - var(--borderSize));
        }`,
            `.scoreboard-container .scoreboard-cell.tr {
            border-top-right-radius: calc(var(--borderRadius) - var(--borderSize));
        }`,
            `.scoreboard-container .scoreboard-cell.bl {
            border-bottom-left-radius: calc(var(--borderRadius) - var(--borderSize));
        }`,
            `.scoreboard-container .scoreboard-cell.br {
            border-bottom-right-radius: calc(var(--borderRadius) - var(--borderSize));
        }`,
            `.scoreboard-container .scoreboard-end-label-cell {
            font-size: var(--textFontSize);
        }`,
            `.scoreboard-container .team-name {
            padding: 8px;
        }`,
            `.scoreboard-container :is(.team-name,.blank-end-cell) span {
            font-size: var(--textFontSize);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }`,
            `.scoreboard-container .team-name.team-1 {
            background-color: var(--team1Color);
        }`,
            `.scoreboard-container .team-name.team-2 {
            background-color: var(--team2Color);
        }`,
            `.scoreboard-container .logical-container {
            display: contents;
        }`,
        ].concat(additionalCssRules);
        for (const rule of rules) {
            styleSheet === null || styleSheet === void 0 ? void 0 : styleSheet.insertRule(rule);
        }
    }
    function typeMatches(action, type) {
        return action.type === type;
    }
    /**
     * Given a GameState an an action, compute the resulting GameState. The input state is
     * unmodified - this function returns a new object.
     * @param state
     * @param action
     * @returns GameState
     */
    function gameStateReducer(state, action) {
        const result = JSON.parse(JSON.stringify(state));
        if (typeMatches(action, "score")) {
            result.ends.push({
                team1Points: action.payload.team === 0 ? action.payload.points : 0,
                team2Points: action.payload.team === 1 ? action.payload.points : 0,
            });
        }
        else if (typeMatches(action, "noop")) ;
        return result;
    }
    /**
     * Render DOM into the given `elem` to produce a visualization of a curling scoreboard.
     * @param elem Host element. Must be empty or contain a previously-rendered scoreboard.
     * @param state
     * @param options
     */
    function render(elem, state, options = {}) {
        var _a, _b, _c, _d, _e, _f;
        const { variant = "baseball", sheetName = "", style = defaultStyle, showTenEnds = false, team1 = {}, team2 = {}, } = options;
        ensureStyles(options.additionalCssRules);
        const container = document.createElement("div");
        container.classList.add("scoreboard-container");
        const scoreboardId = uuidv4();
        container.setAttribute("data-scoreboard-id", scoreboardId);
        container.setAttribute("data-scoreboard-variant", variant);
        const score = getScore(state.ends);
        getHammerTeam(state.ends, state.LSFE, options.doubles);
        // Set styles
        const styles = Object.assign(Object.assign({}, defaultStyle), style);
        for (const [property, value] of Object.entries(styles)) {
            container.style.setProperty(`--${property}`, value);
        }
        if (variant === "club") {
            const repeatedColCount = Math.max(12, score.team1, score.team2) + (state.LSFE !== undefined ? 1 : 0);
            container.style.gridTemplateColumns = `3fr repeat(${repeatedColCount}, 1fr) 2fr`;
            const clubLines = getClubStyleCardIndexes(state.ends);
            const sortedBlanks = Array.from(clubLines.blanks).sort();
            const topBlanks = sortedBlanks.filter((_, i) => i % 2 === 0);
            const botBlanks = sortedBlanks.filter((_, i) => i % 2 === 1);
            // Team 1 name cell
            const team1NameCell = document.createElement("div");
            team1NameCell.classList.add("team-name", "team-1", "scoreboard-cell", "tl");
            const team1NameSpan = document.createElement("span");
            const team1Name = (_a = team1.name) !== null && _a !== void 0 ? _a : "Team 1";
            team1NameSpan.setAttribute("title", team1Name);
            team1NameSpan.textContent = team1Name;
            team1NameCell.append(team1NameSpan);
            if (team1.color) {
                team1NameCell.style.backgroundColor = team1.color;
            }
            container.append(team1NameCell);
            // Team 1 LSFE indicator cell
            if (state.LSFE !== undefined) {
                const lsfeCell = document.createElement("div");
                lsfeCell.classList.add("scoreboard-cell", "lsfe-indicator-cell");
                if (state.LSFE === 0) {
                    lsfeCell.textContent = "*";
                }
                container.append(lsfeCell);
            }
            // Team 1 end cards
            for (const card of clubLines.team1Line) {
                const cell = document.createElement("div");
                cell.classList.add("scoreboard-cell", "scoreboard-end-cell");
                if (card !== undefined) {
                    cell.textContent = String(card);
                }
                container.append(cell);
            }
            // Team 1 blanks
            const team1BlankCell = document.createElement("div");
            team1BlankCell.classList.add("scoreboard-cell", "scoreboard-end-cell", "tr");
            for (const topBlank of topBlanks) {
                const elem = document.createElement("div");
                elem.textContent = String(topBlank);
                team1BlankCell.append(elem);
            }
            container.append(team1BlankCell);
            // Sheet name cell
            const sheetNameCell = document.createElement("div");
            sheetNameCell.classList.add("scoreboard-cell", "sheet-name");
            sheetNameCell.textContent = sheetName;
            container.append(sheetNameCell);
            // Point value cells
            for (let i = 0; i < repeatedColCount; ++i) {
                const cell = document.createElement("div");
                cell.classList.add("scoreboard-cell", "scoreboard-score-cell");
                const scoreVal = i + 1 + (state.LSFE !== undefined ? -1 : 0);
                if (scoreVal > 0) {
                    cell.textContent = String(scoreVal);
                }
                container.append(cell);
            }
            // Blank label cell
            const blankEndsCell = document.createElement("div");
            blankEndsCell.classList.add("scoreboard-cell", "blank-end-cell");
            const blankLabelSpan = document.createElement("span");
            blankLabelSpan.textContent = "Blank";
            blankEndsCell.append(blankLabelSpan);
            container.append(blankEndsCell);
            // Team 2 name cell
            const team2NameCell = document.createElement("div");
            team2NameCell.classList.add("team-name", "team-2", "scoreboard-cell", "bl");
            const team2NameSpan = document.createElement("span");
            const team2Name = (_b = team2.name) !== null && _b !== void 0 ? _b : "Team 2";
            team2NameSpan.setAttribute("title", team2Name);
            team2NameSpan.textContent = team2Name;
            team2NameCell.append(team2NameSpan);
            if (team2.color) {
                team2NameCell.style.backgroundColor = team2.color;
            }
            container.append(team2NameCell);
            // Team 2 LSFE indicator cell
            if (state.LSFE !== undefined) {
                const lsfeCell = document.createElement("div");
                lsfeCell.classList.add("scoreboard-cell", "lsfe-indicator-cell");
                if (state.LSFE === 1) {
                    lsfeCell.textContent = "*";
                }
                container.append(lsfeCell);
            }
            // Team 2 end cards
            for (const card of clubLines.team2Line) {
                const cell = document.createElement("div");
                cell.classList.add("scoreboard-cell", "scoreboard-end-cell");
                if (card !== undefined) {
                    cell.textContent = String(card);
                }
                container.append(cell);
            }
            // Team 2 blanks
            const team2BlankCell = document.createElement("div");
            team2BlankCell.classList.add("scoreboard-cell", "scoreboard-end-cell", "br");
            for (const botBlank of botBlanks) {
                const elem = document.createElement("div");
                elem.textContent = String(botBlank);
                team2BlankCell.append(elem);
            }
            container.append(team2BlankCell);
        }
        else if (variant === "baseball") {
            const numEndsToShow = Math.max(showTenEnds ? 10 : 8, state.ends.length);
            const repeatedColCount = numEndsToShow + (state.LSFE ? 1 : 0);
            container.style.gridTemplateColumns = `3fr repeat(${repeatedColCount}, 1fr) 2fr`;
            // Team label cell
            const teamLabelCell = document.createElement("div");
            teamLabelCell.classList.add("scoreboard-cell", "team-label-cell", "tl");
            teamLabelCell.textContent = "Team";
            container.append(teamLabelCell);
            if (state.LSFE) {
                const deadSpaceCell = document.createElement("div");
                deadSpaceCell.classList.add("scoreboard-cell");
                container.append(deadSpaceCell);
            }
            // End number cells
            for (let i = 0; i < numEndsToShow; ++i) {
                const cell = document.createElement("div");
                cell.classList.add("scoreboard-cell", "scoreboard-end-label-cell");
                const scoreVal = i + 1;
                cell.textContent = String(scoreVal);
                container.append(cell);
            }
            const totalLabelCell = document.createElement("div");
            totalLabelCell.classList.add("scoreboard-cell", "total-label-cell", "tr");
            totalLabelCell.textContent = "Total";
            container.append(totalLabelCell);
            // Team 1 name cell
            const team1NameCell = document.createElement("div");
            team1NameCell.classList.add("team-name", "team-1", "scoreboard-cell");
            const team1NameSpan = document.createElement("span");
            const team1Name = (_c = team1.name) !== null && _c !== void 0 ? _c : "Team 1";
            team1NameSpan.setAttribute("title", team1Name);
            team1NameSpan.textContent = team1Name;
            team1NameCell.append(team1NameSpan);
            if (team1.color) {
                team1NameCell.style.backgroundColor = team1.color;
            }
            container.append(team1NameCell);
            // Team 1 LSFE indicator cell
            if (state.LSFE !== undefined) {
                const lsfeCell = document.createElement("div");
                lsfeCell.classList.add("scoreboard-cell", "lsfe-indicator-cell");
                if (state.LSFE === 0) {
                    lsfeCell.textContent = "*";
                }
                container.append(lsfeCell);
            }
            // Team 1 points
            for (let i = 0; i < numEndsToShow; ++i) {
                const end = state.ends[i];
                const cell = document.createElement("div");
                cell.classList.add("scoreboard-cell", "scoreboard-point-cell");
                if (end) {
                    cell.textContent = String(end.team1Points);
                }
                container.append(cell);
            }
            const team1TotalCell = document.createElement("div");
            team1TotalCell.classList.add("scoreboard-cell", "scoreboard-team-total");
            team1TotalCell.textContent = String(score.team1);
            container.append(team1TotalCell);
            // Team 2 name cell
            const team2NameCell = document.createElement("div");
            team2NameCell.classList.add("team-name", "team-2", "scoreboard-cell", "bl");
            const team2NameSpan = document.createElement("span");
            const team2Name = (_d = team2.name) !== null && _d !== void 0 ? _d : "Team 2";
            team2NameSpan.setAttribute("title", team2Name);
            team2NameSpan.textContent = team2Name;
            team2NameCell.append(team2NameSpan);
            if (team2.color) {
                team2NameCell.style.backgroundColor = team2.color;
            }
            container.append(team2NameCell);
            // Team 2 LSFE indicator cell
            if (state.LSFE !== undefined) {
                const lsfeCell = document.createElement("div");
                lsfeCell.classList.add("scoreboard-cell", "lsfe-indicator-cell");
                if (state.LSFE === 1) {
                    lsfeCell.textContent = "*";
                }
                container.append(lsfeCell);
            }
            // Team 2 points
            for (let i = 0; i < numEndsToShow; ++i) {
                const end = state.ends[i];
                const cell = document.createElement("div");
                cell.classList.add("scoreboard-cell", "scoreboard-point-cell");
                if (end) {
                    cell.textContent = String(end.team2Points);
                }
                container.append(cell);
            }
            const team2TotalCell = document.createElement("div");
            team2TotalCell.classList.add("scoreboard-cell", "scoreboard-team-total", "br");
            team2TotalCell.textContent = String(score.team2);
            container.append(team2TotalCell);
        }
        else if (variant === "simple") {
            container.style.gridTemplateColumns = `4fr 1fr`;
            // End label cell
            const endLabelCell = document.createElement("div");
            endLabelCell.classList.add("scoreboard-cell", "end-label-cell", "tl");
            endLabelCell.textContent = "Team";
            container.append(endLabelCell);
            const totalLabelCell = document.createElement("div");
            totalLabelCell.classList.add("scoreboard-cell", "total-label-cell", "tr");
            totalLabelCell.textContent = "Total";
            container.append(totalLabelCell);
            // Team 1 name cell
            const team1NameCell = document.createElement("div");
            team1NameCell.classList.add("team-name", "team-1", "scoreboard-cell");
            const team1NameSpan = document.createElement("span");
            const team1Name = (_e = team1.name) !== null && _e !== void 0 ? _e : "Team 1";
            team1NameSpan.setAttribute("title", team1Name);
            team1NameSpan.textContent = team1Name;
            team1NameCell.append(team1NameSpan);
            if (team1.color) {
                team1NameCell.style.backgroundColor = team1.color;
            }
            container.append(team1NameCell);
            const team1TotalCell = document.createElement("div");
            team1TotalCell.classList.add("scoreboard-cell", "scoreboard-team-total");
            team1TotalCell.textContent = String(score.team1);
            container.append(team1TotalCell);
            // Team 2 name cell
            const team2NameCell = document.createElement("div");
            team2NameCell.classList.add("team-name", "team-2", "scoreboard-cell", "bl");
            const team2NameSpan = document.createElement("span");
            const team2Name = (_f = team2.name) !== null && _f !== void 0 ? _f : "Team 2";
            team2NameSpan.setAttribute("title", team2Name);
            team2NameSpan.textContent = team2Name;
            team2NameCell.append(team2NameSpan);
            if (team2.color) {
                team2NameCell.style.backgroundColor = team2.color;
            }
            container.append(team2NameCell);
            const team2TotalCell = document.createElement("div");
            team2TotalCell.classList.add("scoreboard-cell", "scoreboard-team-total", "br");
            team2TotalCell.textContent = String(score.team2);
            container.append(team2TotalCell);
        }
        if (elem.children.length > 0) {
            if (elem.children.length > 1 || elem.children[0].getAttribute("data-scoreboard-id") == undefined) {
                throw new Error("Container element must be empty or contain one scoreboard.");
            }
            const prevScoreboard = elem.children[0];
            if (prevScoreboard.getAttribute("data-scoreboard-variant") === variant &&
                prevScoreboard.children.length === container.children.length) {
                for (let i = 0; i < prevScoreboard.children.length; ++i) {
                    const prevCell = prevScoreboard.children[i];
                    const nextCell = container.children[i];
                    if (prevCell.textContent !== nextCell.textContent) {
                        nextCell.classList.add("flash");
                    }
                }
            }
            elem.removeChild(prevScoreboard);
        }
        elem.append(container);
        setTimeout(() => {
            for (const flashElem of elem.querySelectorAll(".flash")) {
                flashElem.classList.remove("flash");
            }
        }, 100);
    }

    exports.gameStateReducer = gameStateReducer;
    exports.getClubStyleCardIndexes = getClubStyleCardIndexes;
    exports.getEndsFromClubStyle = getEndsFromClubStyle;
    exports.getHammerTeam = getHammerTeam;
    exports.getScore = getScore;
    exports.render = render;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
