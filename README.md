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
Usage: roll [notations]

Roll dice notation
```

Examples:

```bash
# Roll a 6 sided die 4 times
roll 4d6

# Roll a series of dice
roll 2d10 7d% 5dF

# Notation with spaces must be surrounded with quotes
roll "4d6 # roll description"
```

Read about the notation in the [documentation](https://dice-roller.github.io/documentation/)
