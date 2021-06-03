[js-curling-scoreboard](../README.md) / [Exports](../modules.md) / ScoreboardOptions

# Interface: ScoreboardOptions

Scoreboard options not related to game state

## Table of contents

### Properties

- [additionalCssRules](scoreboardoptions.md#additionalcssrules)
- [doubles](scoreboardoptions.md#doubles)
- [sheetName](scoreboardoptions.md#sheetname)
- [showTenEnds](scoreboardoptions.md#showtenends)
- [style](scoreboardoptions.md#style)
- [team1](scoreboardoptions.md#team1)
- [team2](scoreboardoptions.md#team2)
- [variant](scoreboardoptions.md#variant)

## Properties

### additionalCssRules

• `Optional` **additionalCssRules**: `string`[]

Additional CSS rules, each in the format:

`selector { property1: value1; property2: value2; etc. }`

#### Defined in

[scoreboard.ts:113](https://github.com/trianglecurling/js-curling-scoreboard/blob/52ea993/scoreboard.ts#L113)

___

### doubles

• `Optional` **doubles**: `boolean`

If true, use doubles rules to make hammer determinations (blank ends
cause hammer to switch teams))

#### Defined in

[scoreboard.ts:124](https://github.com/trianglecurling/js-curling-scoreboard/blob/52ea993/scoreboard.ts#L124)

___

### sheetName

• `Optional` **sheetName**: `string`

The name of the sheet, shown in some variants

#### Defined in

[scoreboard.ts:101](https://github.com/trianglecurling/js-curling-scoreboard/blob/52ea993/scoreboard.ts#L101)

___

### showTenEnds

• `Optional` **showTenEnds**: `boolean`

If variant is "baseball", default to showing 10 ends (otherwise show 8)

#### Defined in

[scoreboard.ts:118](https://github.com/trianglecurling/js-curling-scoreboard/blob/52ea993/scoreboard.ts#L118)

___

### style

• `Optional` **style**: `Partial`<[ScoreboardStyles](scoreboardstyles.md)\>

Style overrides

#### Defined in

[scoreboard.ts:106](https://github.com/trianglecurling/js-curling-scoreboard/blob/52ea993/scoreboard.ts#L106)

___

### team1

• `Optional` **team1**: [Team](team.md)

The top team

#### Defined in

[scoreboard.ts:129](https://github.com/trianglecurling/js-curling-scoreboard/blob/52ea993/scoreboard.ts#L129)

___

### team2

• `Optional` **team2**: [Team](team.md)

The bottom team

#### Defined in

[scoreboard.ts:134](https://github.com/trianglecurling/js-curling-scoreboard/blob/52ea993/scoreboard.ts#L134)

___

### variant

• `Optional` **variant**: ``"baseball"`` \| ``"club"`` \| ``"simple"``

Specify which scoreboard variant to use.

- baseball: Each column represents an end. Includes a total column.
- club: Each column represents a different score (ascending points).
- simple: Only show team score

#### Defined in

[scoreboard.ts:96](https://github.com/trianglecurling/js-curling-scoreboard/blob/52ea993/scoreboard.ts#L96)
