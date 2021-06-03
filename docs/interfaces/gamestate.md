[js-curling-scoreboard](../README.md) / [Exports](../modules.md) / GameState

# Interface: GameState

Represents the state of a curling game

## Table of contents

### Properties

- [LSFE](gamestate.md#lsfe)
- [complete](gamestate.md#complete)
- [ends](gamestate.md#ends)
- [team1](gamestate.md#team1)
- [team2](gamestate.md#team2)

## Properties

### LSFE

• `Optional` **LSFE**: ``0`` \| ``1``

Last Stone in First End.
Which team started with hammer? 0 for top, 1 for bottom.

#### Defined in

[scoreboard.ts:168](https://github.com/trianglecurling/js-curling-scoreboard/blob/ed5ad77/scoreboard.ts#L168)

___

### complete

• **complete**: `boolean`

Signals that the game is over (may generate "X" markers on some variants)

#### Defined in

[scoreboard.ts:178](https://github.com/trianglecurling/js-curling-scoreboard/blob/ed5ad77/scoreboard.ts#L178)

___

### ends

• **ends**: [End](end.md)[]

Ends that have been completed

#### Defined in

[scoreboard.ts:173](https://github.com/trianglecurling/js-curling-scoreboard/blob/ed5ad77/scoreboard.ts#L173)

___

### team1

• **team1**: [Team](team.md)

The top team

#### Defined in

[scoreboard.ts:157](https://github.com/trianglecurling/js-curling-scoreboard/blob/ed5ad77/scoreboard.ts#L157)

___

### team2

• **team2**: [Team](team.md)

The bottom team

#### Defined in

[scoreboard.ts:162](https://github.com/trianglecurling/js-curling-scoreboard/blob/ed5ad77/scoreboard.ts#L162)
