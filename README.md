# Battleship game

## Description
Battleship single player game for the browser. The game is played on a 10x10 grid. The player has to sink all the ships placed by the computer. The game ends when all ships are sunk.

## Demo
[Play the game now](https://battleship-single-player-browser.vercel.app/)

## Rules
- The player can only fire using the coordinates A1 to J10.
- The player enters coordinates of the form "A5", where "A" is the column and "5" is the row.
- Shots result in hits, misses or sinks.
- The game ends when all ships are sunk.

## Ships

| Amount | Ship | Size |
| --- | --- | --- |
| 1 | Battleship | 5 |
| 2 | Destroyer | 4 |

## Cheat codes

You can activate cheat codes by adding ```VITE_CHEATS_ENABLED=true``` in the `.env` or `.env.local` files.

You can use cheat codes by typing the code in the input field and firing.

| Code | Effect |
| --- | --- |
| `MARCOPOLO` | Reveals the location of all ships |
| `HITHERE` | Instantly hits a ship |
| `TORPEDO` | Instantly sinks a ship |
| `GOTTAGOFAST` | Shink all ships & win the game |

*Note: Cheat codes are active in Demo deployment.*

## Installation

### Requirements
- Node.js v16+
- Yarn

### Steps
1. Clone the repository ```git clone https://github.com/paupenin/battleship-single-player-browser```
2. Install dependencies ```yarn```

### Development
 Run the development server and open the URL displayed in the console:

 ```yarn dev```

### Build
Run the build command to build the project in the ```dist``` folder:

```yarn build```

## Technologies

Decided to build the game using [Vite](https://vitejs.dev/) as it is a very fast build tool. It is also minimalistic, very easy to setup and use. I decided to use [TypeScript](https://www.typescriptlang.org/) as it is a very powerful tool to catch errors and improve the code quality.

- [Node.js](https://nodejs.org/en/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

I decided against using a framework as I wanted to keep the project as simple as possible and there are already many projects in my portfolio using React.

## Possible improvements

- Dispaly hits, misses and sunk ships
- Add a timer
- Add more ships
- Make cells clickable
- Implement unit tests

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Author
[Pau Penin](https://www.linkedin.com/in/paupenin/)
