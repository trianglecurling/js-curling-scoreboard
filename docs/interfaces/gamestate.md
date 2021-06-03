[js-curling-scoreboard](../README.md) / [Exports](../modules.md) / GameState

# Interface: GameState

Represents the state of a curling game

## Table of contents

### Properties

- [LSFE](gamestate.md#lsfe)
- [complete](gamestate.md#complete)
- [ends](gamestate.md#ends)

## Properties

### LSFE

• `Optional` **LSFE**: ``0`` \| ``1``

Last Stone in First End.
Which team started with hammer? 0 for top, 1 for bottom.

#### Defined in

[scoreboard.ts:168](https://github.com/trianglecurling/js-curling-scoreboard/blob/94612dd/scoreboard.ts#L168)

___

### complete

• **complete**: `boolean`

Signals that the game is over (may generate "X" markers on some variants)

#### Defined in

[scoreboard.ts:178](https://github.com/trianglecurling/js-curling-scoreboard/blob/94612dd/scoreboard.ts#L178)

___

### ends

• **ends**: [End](end.md)[]

Ends that have been completed

#### Defined in

[scoreboard.ts:173](https://github.com/trianglecurling/js-curling-scoreboard/blob/94612dd/scoreboard.ts#L173)
