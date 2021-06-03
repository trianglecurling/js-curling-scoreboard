[js-curling-scoreboard](../README.md) / [Exports](../modules.md) / Action

# Interface: Action<T\>

Describes a single modification to a GameState

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T`: keyof [ActionTypeMap](actiontypemap.md) |

## Table of contents

### Properties

- [payload](action.md#payload)
- [type](action.md#type)

## Properties

### payload

• **payload**: [ActionTypeMap](actiontypemap.md)[`T`]

Payload for the action (see ActionTypeMap)

#### Defined in

[scoreboard.ts:580](https://github.com/trianglecurling/js-curling-scoreboard/blob/5f36fa5/scoreboard.ts#L580)

___

### type

• **type**: `T`

String action type (see ActionTypeMap)

#### Defined in

[scoreboard.ts:575](https://github.com/trianglecurling/js-curling-scoreboard/blob/5f36fa5/scoreboard.ts#L575)
