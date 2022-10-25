<p align="center">
    <img src="https://dice-roller.github.io/documentation/dice-roller-logo.png" alt="RPG Dice Roller" style="max-width: 100%;" width="200"/>
</p>

# RPG Dice Roller CLI

Command Line Interface which allows rolling dice.

It is built upon this [RPG dice roller](https://github.com/dice-roller/rpg-dice-roller).

## Get started

### Install

Install the script globally:

```bash
npm install -g @dice-roller/cli
```

### Usage

```
roller <notation..> [options]
roller roll <notation..> [options]

Positionals:
  notation  space separated list of notation to roll                    [string]

Options:
      --version      Show version number                               [boolean]
  -s, --separator    String to separate dice rolls      [string] [default: "; "]
  -e, --engine       The RNG engine to use                              [string]
      --seed         The RNG engine seed                                [number]
  -f, --format       The output format              [string] [default: "string"]
      --result-only  Only return the roll result, without the notation or dice
                     rolled                           [boolean] [default: false]
      --help         Show help                                         [boolean]
```

Examples:

```bash
# Roll a 6 sided die 4 times
roller 4d6

# Roll a series of dice
roller 2d10 7d% 5dF

# Notation with spaces must be surrounded with quotes
roller "4d6 # roll description"

# Use the MersenneTwister19937 engine (See is not required)
roller 4d6 -e=MersenneTwister19937 --seed=415

# Return just the result rolled
roller 2d20 --result-only

# Output the result in base64 encoding
roller 6d8*4 -f=BASE_64
```

Read about the notation in the [documentation](https://dice-roller.github.io/documentation/)
