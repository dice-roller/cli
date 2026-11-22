<p align="center">
    <img src="https://dice-roller.github.io/documentation/dice-roller-logo.png" alt="RPG Dice Roller" style="max-width: 100%;" width="200"/>
</p>

# RPG Dice Roller CLI

Command Line Interface which allows rolling dice.

It is built upon this [RPG dice roller](https://github.com/dice-roller/rpg-dice-roller).

## Get started

### Install

The CLI with RPG Dice Roller v6 requires Node.js 22.13 or later in the 22.x series, or Node.js 23.5 or later.

Install the script globally:

```bash
npm install -g @dice-roller/cli
```

### Usage

```
roller <notation..> [options]

Commands:
  roller roll <notation..>  roll the dice                              [default]
  roller play               play an interactive CLI dice game

Positionals:
  notation  space separated list of notation to roll                    [string]

Options:
  -V, --version      Show version number                               [boolean]
      --color        Enable colour in roll output (use --no-color to disable it)
      --help         Show help                                         [boolean]
  -s, --separator    String to separate dice rolls      [string] [default: "; "]
  -e, --engine       The RNG engine to use                              [string]
      --seed         The RNG engine seed                                [number]
  -f, --format       The output format              [string] [default: "string"]
      --result-only  Only return the roll result, without the notation or dice
                     rolled                           [boolean] [default: false]

Examples:
  roller '4d6'     roll a 6 sided die 4 times
  roller '2d10+7'  roll a 10 sided die 2 times and add 7
  roller play      start the interactive CLI dice game

For more information visit https://dice-roller.github.io/documentation
```

```
roller play

play an interactive CLI dice game

Options:
  -V, --version  Show version number                                   [boolean]
      --color    Enable colour in roll output (use --no-color to disable it)
      --help     Show help                                             [boolean]
      --players  The name of a player                                    [array]
      --count    The number of players                                  [number]

For more information visit https://dice-roller.github.io/documentation
```

Examples:

```bash
# Roll a 6 sided die 4 times
roller '4d6'

# Roll a series of dice
roller '2d10' '7d%' '5dF'

# Use single quotes around notation with spaces or shell characters like !
roller '4d6 # roll description'
roller '4d6d1!>=3'

# Use the Mersenne engine with a reproducible seed
roller '4d6' --engine=mersenne --seed=415

# Return just the result rolled
roller '2d20' --result-only

# Output the result in base64 encoding
roller '6d8*4' --format=base64

# Start the interactive dice game
roller play

# Start the game with 4 players
roller play --count=4

# Start the game with 2 players called Barbara and Ian
roller play --players=Barbara Ian

# Start the game with two players, but only name the first one
roller play --count=2 --players=Susan
```

Text roll output uses terminal colours when stdout supports them. Set `NO_COLOR`
or pass `--no-color` to disable styling, or pass `--color` to force it.
JSON and base64 exports use the v6 roll-history format and are emitted without
styling. The CLI still accepts the legacy format names `JSON`, `BASE_64` and
`OBJECT`.

The v6 engine names are `crypto`, `mersenne`, `nativeMath` and
`xoroshiro128plus`. Seeded rolls can differ from v5.

Read about the notation in the [documentation](https://dice-roller.github.io/documentation/)
