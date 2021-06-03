[js-curling-scoreboard](README.md) / Exports

# js-curling-scoreboard

js-curling-scoreboard is a standalone, dependency-free JavaScript
module that renders DOM to show a curling scoreboard.

## Table of contents

### Interfaces

- [Action](interfaces/action.md)
- [ActionTypeMap](interfaces/actiontypemap.md)
- [ClubStyleCards](interfaces/clubstylecards.md)
- [End](interfaces/end.md)
- [GameState](interfaces/gamestate.md)
- [ScoreboardOptions](interfaces/scoreboardoptions.md)
- [ScoreboardStyles](interfaces/scoreboardstyles.md)
- [Team](interfaces/team.md)

### Functions

- [gameStateReducer](modules.md#gamestatereducer)
- [getClubStyleCardIndexes](modules.md#getclubstylecardindexes)
- [getEndsFromClubStyle](modules.md#getendsfromclubstyle)
- [getHammerTeam](modules.md#gethammerteam)
- [getScore](modules.md#getscore)
- [render](modules.md#render)

## Functions

### gameStateReducer

▸ **gameStateReducer**<T\>(`state`, `action`): [GameState](interfaces/gamestate.md)

Given a GameState an an action, compute the resulting GameState. The input state is
unmodified - this function returns a new object.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T`: keyof [ActionTypeMap](interfaces/actiontypemap.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [GameState](interfaces/gamestate.md) |
| `action` | [Action](interfaces/action.md)<T\> |

#### Returns

[GameState](interfaces/gamestate.md)

GameState

#### Defined in

[scoreboard.ts:602](https://github.com/trianglecurling/js-curling-scoreboard/blob/5f36fa5/scoreboard.ts#L602)

___

### getClubStyleCardIndexes

▸ **getClubStyleCardIndexes**(`ends`): [ClubStyleCards](interfaces/clubstylecards.md) \| `any`

Given a list of ends played, return a data structure indicating the
positions to hang cards for a club-style scoreboard.

#### Parameters

| Name | Type |
| :------ | :------ |
| `ends` | [End](interfaces/end.md)[] |

#### Returns

[ClubStyleCards](interfaces/clubstylecards.md) \| `any`

ClubStyleCards

#### Defined in

[scoreboard.ts:283](https://github.com/trianglecurling/js-curling-scoreboard/blob/5f36fa5/scoreboard.ts#L283)

___

### getEndsFromClubStyle

▸ **getEndsFromClubStyle**(`lines`, `mode?`): [End](interfaces/end.md)[]

Generates end-by-end scores from data formatted as you would see on a club-style scoreboard.

Each line (team1Line, team2Line) should contain an array of string arrays. Each item in the
outer array should be an array of length 0 or 1. An array of length 0 represents no card
in the spot labeled with <outer array index> + 1 points. An array of length 1 represents
a card hanging in that spot, the value of which is the string in that length-1 array.

The last element of the outer array represents blank ends. The string array in the last
element may have multiple elements, representing multiple ends that were blanked.

**Mode**

When mode is strict, any of the following conditions result in an Error being thrown:
- A end card is represented multiple times.
- The end cards are out of order
- An end card is missing (incomplete games are fine, but skipped ends are not).
- An end of more than 8 points is represented.

When mode is lenient, the following actions are taken for the same conditions:
- A end card is represented multiple times.
     First, we will check if any ends are missing. If so, the second instance of a card takes the place of the missing end.
     Otherwise, treat the duplicated end card as the next in-order end.
- The end cards are out of order
     The out-of-order card is treated as though it has wrapped around. For instance, if
     the maximum point value represented by a scoreboard is 12, and an out-of-order end
     card is found above a 3, that card is treated as though it represents 15 points.
- An end card is missing (i.e. a skipped end).
     The end that is missing a card is considered blank. This can happen if there are no
     blank spaces on the scoreboard, or if they are full.
- An end of more than 8 points is represented.
     The end that is represented with a score of more than 8 is considered blank. This can
     happen if there are no blank spaces on the scoreboard, or if they are full.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `lines` | `Object` | `undefined` |
| `lines.team1Line` | `string`[][] | `undefined` |
| `lines.team2Line` | `string`[][] | `undefined` |
| `mode` | ``"strict"`` \| ``"lenient"`` | "lenient" |

#### Returns

[End](interfaces/end.md)[]

#### Defined in

[scoreboard.ts:351](https://github.com/trianglecurling/js-curling-scoreboard/blob/5f36fa5/scoreboard.ts#L351)

___

### getHammerTeam

▸ **getHammerTeam**(`ends`, `LSFE?`, `doubles?`): ``0`` \| ``1`` \| `undefined`

Returns the team (0 or 1) which has hammer after the given ends. If no ends
have been played, or only blanks have been scored, use LSFE to deduce the
hammer team.

If doubles is true, blank ends cause hammer to go to the other team.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `ends` | [End](interfaces/end.md)[] | `undefined` |
| `LSFE?` | ``0`` \| ``1`` | `undefined` |
| `doubles` | `boolean` | false |

#### Returns

``0`` \| ``1`` \| `undefined`

0 if the top team, 1 if the bottom team, or undefined if LSFE is needed but unknown.

#### Defined in

[scoreboard.ts:253](https://github.com/trianglecurling/js-curling-scoreboard/blob/5f36fa5/scoreboard.ts#L253)

___

### getScore

▸ **getScore**(`ends`): `Object`

Given a list of ends played, return the total score of each team.

#### Parameters

| Name | Type |
| :------ | :------ |
| `ends` | [End](interfaces/end.md)[] |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `team1` | `number` |
| `team2` | `number` |

#### Defined in

[scoreboard.ts:234](https://github.com/trianglecurling/js-curling-scoreboard/blob/5f36fa5/scoreboard.ts#L234)

___

### render

▸ **render**(`elem`, `state`, `options?`): `void`

Render DOM into the given `elem` to produce a visualization of a curling scoreboard.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `elem` | `HTMLElement` | Host element. Must be empty or contain a previously-rendered scoreboard. |
| `state` | [GameState](interfaces/gamestate.md) |  |
| `options` | [ScoreboardOptions](interfaces/scoreboardoptions.md) |  |

#### Returns

`void`

#### Defined in

[scoreboard.ts:621](https://github.com/trianglecurling/js-curling-scoreboard/blob/5f36fa5/scoreboard.ts#L621)
