/**
 * Battleship Game
 * 
 * Battleship single player game for the browser
 * 
 * @autor: Pau Penin
 * @version: 1.0.0
 * @date: 2021/05/14
 */
import Battlefield from "./battlefield";
import { Coordinate } from './types';
import { numberToLetter, stringToCoordinates, validateCoordinates } from './utils';
import targetLogo from '/target.svg'

// Battlefield size (10x10)
const BATTLEFIELD_SIZE = 10;

// Cheat codes
const CHEAT_CODES = [
  "MARCOPOLO", // Reveal all ships
  "HITHERE", // Instant hit
  "TORPEDO", // Instant shink
  "GOTTAGOFAST", // Instant win
];

/**
 * Game class
 * 
 * This class is the link between the game logic and the UI.
 * In this class we will start the game, render the game in the DOM,
 * and control user's actions.
 * 
 * @class Game
 */
export default class Game {
  protected container: HTMLDivElement;
  protected battlefield: Battlefield;
  protected cells: HTMLDivElement[][] = [];

  constructor(container: HTMLDivElement) {
    this.container = container;
    // Create battlefield
    this.battlefield = new Battlefield(BATTLEFIELD_SIZE);

    try {
      // Generate ships
      this.battlefield.generateShips([
        'battleship',
        'destroyer',
        'destroyer',
      ]);

      // Initialize game
      this.init();

      console.log('the game is ready! good luck!');

      /**
       * Cheats to help you test the game
       * /
      this.revealAllShips();
      /**/
    } catch (error) {
      // Handle Error and reset the game.
      this.renderError('The came could not be initialized. Attempting to reload the page...');
      console.log(error);

      setTimeout(() => {
        document.location.reload();
      }, 5000);
      return;
    }
  }

  /**
   * Initialize game
   * @returns void
   */
  protected init(): void {
    // Render game in the DOM
    this.renderGame();
    this.renderLegend();
    this.renderCells();

    // Add event listeners
    this.addEventListeners();
  }

  /**
   * Render error message in the DOM (instead of the game)
   * @param message string
   * @returns void
   */
  protected renderError(message: string): void {
    this.container.innerHTML = `<p style="text-align: center" class="error">${message}</p>`;
  }

  /**
   * Render game in the DOM
   * @returns void
   */
  protected renderGame(): void {
    this.container.innerHTML = `
  <div class="battleship-game">
    <div class="battlefield-panel">
      <div class="battlefield"></div>
    </div>
    <div class="combat-panel">
      <div class="fire-station">
        <p>Introduce coordinates and press Fire!</p>

        <div class="input-group">
          <input id="target" type="text" placeholder="A1" />
          <button id="fire" type="button">
            <span>Fire!</span>
            <img src="${targetLogo}" alt="" />
          </button>
        </div>

        <p id="feedback"></p>

        <div class="legend">
          <div class="legend-item">
            <span class="legend-item__icon legend-item__icon--miss"></span>
            <span class="legend-item__text">Miss</span>
          </div>
          <div class="legend-item">
            <span class="legend-item__icon legend-item__icon--hit"></span>
            <span class="legend-item__text">Hit</span>
          </div>
          <div class="legend-item">
            <span class="legend-item__icon legend-item__icon--sunk"></span>
            <span class="legend-item__text">Sunk</span>
          </div>
        </div>
      </div>
    </div>
  </div>
`
  }

  /**
   * Render the Legend dynamically in the DOM (A-J, 1-10)
   * @returns void
   */
  protected renderLegend(): void {
    const elementBattlefieldPanel = this.container.querySelector<HTMLDivElement>('.battlefield-panel')!;

    // Generate legend for x-axis (A-J)
    for (let i = 1; i < BATTLEFIELD_SIZE + 1; i++) {
      const legend = document.createElement('div');
      legend.innerHTML = numberToLetter(i - 1);
      legend.classList.add('legend');
      legend.style.gridColumn = `${i + 1}`;
      legend.style.gridRow = '1';
      elementBattlefieldPanel.append(legend);
    }

    // Generate legend for y-axis (1-10)
    for (let i = 1; i < BATTLEFIELD_SIZE + 1; i++) {
      const legend = document.createElement('div');
      legend.innerHTML = i.toString();
      legend.classList.add('legend');
      legend.style.gridColumn = '1';
      legend.style.gridRow = `${i + 1}`;
      elementBattlefieldPanel.append(legend);
    }
  }

  /**
   * Render cells dynamically in the DOM
   * @returns void
   */
  protected renderCells(): void {
    const elementBattlefield = this.container.querySelector<HTMLDivElement>('.battlefield')!;

    // Create 2D array of cells [y][x], and render each cell in the DOM.
    // Using [y][x] coordinates instead of [x][y] because of 2D array best practices.
    for (let y = 0; y < BATTLEFIELD_SIZE; y++) {
      this.cells[y] = [];
      for (let x = 0; x < BATTLEFIELD_SIZE; x++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-x', x.toString());
        cell.setAttribute('data-y', y.toString());

        elementBattlefield.appendChild(cell);

        this.cells[y][x] = cell;
      }
    }
  }

  /**
   * Add event listeners to DOM elements
   * @returns void
   */
  protected addEventListeners(): void {
    // Input element
    const elementTargetInput = this.container.querySelector<HTMLInputElement>('#target')!;

    // Fire button element
    const elementFireButton = this.container.querySelector<HTMLButtonElement>('#fire')!;

    // Add event listener to fire button
    elementFireButton.addEventListener('click', () => {
      // Attempt fire with input value (A1, B2, etc.)
      this.attemptFire(elementTargetInput.value.toUpperCase());

      // Clear input after fire
      elementTargetInput.value = '';
    });

    // Add event listener to input
    elementTargetInput.addEventListener('keyup', (event) => {
      // If enter key is pressed, press the button
      if (event.key === "Enter") {
        elementFireButton.click();
      }
    });
  }

  /**
   * Check if game is finished
   * @returns boolean
   */
  protected gameOver(): boolean {
    return this.battlefield.getAfloatShips().length === 0;
  }

  /**
   * Clear feedback element
   * @returns void
   */
  protected clearFeedback(): void {
    const elementFeedbak = document.getElementById('feedback')!;
    elementFeedbak.innerHTML = '';
    elementFeedbak.classList.remove('error', 'success');
  }

  /**
   * Invalid target feedback for the user
   * @returns void
   */
  protected invalidTargetFeedback(): void {
    const elementFeedbak = document.getElementById('feedback')!;
    elementFeedbak.innerHTML = 'Invalid target! Try again.';
    elementFeedbak.classList.add('error');
  }

  /**
   * Win feedback for the user
   * @returns void
   */
  protected winFeedback(): void {
    const elementFeedbak = document.getElementById('feedback')!;
    elementFeedbak.innerHTML = 'Congratulations, you won!<br>Refresh the page to play again.';
    elementFeedbak.classList.add('success');
  }

  /**
   * Attempt to fire to the target
   * @param target string Assumes uppercase (A1, B2, etc)
   * @returns void
   */
  protected attemptFire(target: string): void {
    console.log('attempt fire on: ', target);

    // Check if the game is over
    if (this.gameOver()) {
      console.log('the game is over! stop shooting!');
      this.winFeedback(); // Sanity message feedback
      return;
    }

    // Skip if the user didn't introduce any target
    if (!target) return;

    // Clear feedback element before fire attempt
    this.clearFeedback();

    // Check if the user is using a valid cheat code and cheats are enabled
    if (this.checkCheatCode(target)) {
      // If the user is cheating, we don't need to do anything else
      return;
    }

    // Convert target to coordinates
    const [x, y] = stringToCoordinates(target);

    // Check if coordinates exists
    if (!validateCoordinates(x, y) || !this.cellExists(x, y)) {
      // Invalid coordinates
      console.log('invalid coordinates');
      this.invalidTargetFeedback();
      return;
    }

    // Hit the target in the battlefield
    const hittedShip = this.battlefield.hit(x, y);

    if (hittedShip && hittedShip.hits === hittedShip.size) {
      // Sink the ship
      this.updateCells(hittedShip.coordinates, ['hit', 'sunk']);
    } else {
      // Add hit or miss class to the cell
      this.updateCells([x, y], hittedShip ? 'hit' : 'miss');
    }

    // Check if the game is over
    if (this.gameOver()) {
      console.log('the game is over! you won!');
      this.winFeedback();
    }
  }

  /**
   * Check if the cell exists
   * @param x number
   * @param y number
   * @returns void
   */
  protected cellExists(x: number, y: number): boolean {
    return !!this.cells[y] && !!this.cells[y][x];
  }

  /**
   * Update cells with classNames
   * @param coordinates Coordinate | Coordinate[]
   * @param classNames string | string[]`
   * @returns void
   */
  protected updateCells(coordinates: Coordinate | Coordinate[], classNames: string | string[]): void {
    // Skip if coordinates is empty
    if (coordinates.length === 0) return;

    // Convert coordinates to array if it's not
    const coords: Coordinate[] = typeof coordinates[0] === 'number'
      ? [coordinates] as Coordinate[]
      : coordinates as Coordinate[];

    coords.forEach(([x, y]) => {
      this.cells[y][x]?.classList.add(...(Array.isArray(classNames) ? classNames : [classNames]));
    });
  }

  /**
   * Check if the user is using a valid cheat code and cheats are enabled.
   *
   * If the user is cheating, we perform the action and return true.
   * If the user is not cheating, we return false.
   *
   * @param cheatCode string
   * @returns 
   */
  protected checkCheatCode(cheatCode: string): boolean {
    try {
      // Skip if cheats are not enabled
      if (import.meta.env.VITE_CHEATS_ENABLED !== 'true') return false;
    } catch (error) {
      // In case env is not available just skip the cheats
      // (eg. file is imported somewhere else)
      return false;
    }

    // Check if the cheat code is valid
    if (CHEAT_CODES.includes(cheatCode)) {
      console.log('cheat code detected, you tricky bastard!');

      switch (cheatCode) {
        case "MARCOPOLO":
          this.revealAllShips();
          return true;
        case "HITHERE":
          this.hitRandomShip();
          return true;
        case "TORPEDO":
          this.sinkRandomShip();
          return true;
        case "GOTTAGOFAST":
          this.sinkAllShips();
          return true;
      }
    }

    return false;
  }

  /**
   * Reveal all ships
   * @returns void
   */
  protected revealAllShips() {
    console.log('contacting satellite...');

    // Get all ships
    this.battlefield.getShips().forEach(ship => {
      // Add ghost class to the ship cells
      this.updateCells(ship.coordinates, 'ghost');
    });

    console.log('satellite connection established, revealing all ships!');
  }

  /**
   * Hit a random ship
   * @returns void
   */
  protected hitRandomShip() {
    // Get afloat ships
    const afloatShips = this.battlefield.getAfloatShips();

    // No ships afloat, skip
    if (afloatShips.length === 0) return;

    console.log(`there are ${afloatShips.length} afloat ships, hitting one...`);

    // Get a random ship
    const ship = afloatShips[Math.floor(Math.random() * afloatShips.length)];

    // Get a random coordinate from the ship
    let [x, y] = ship.coordinates[Math.floor(Math.random() * ship.coordinates.length)];

    // Make sure the coordinate hasn't been hit before
    // TODO: Handle infinite loop (theorically impossible)
    while (this.battlefield.coordinateHasBeenHit(x, y)) {
      [x, y] = ship.coordinates[Math.floor(Math.random() * ship.coordinates.length)];
    }

    // Hit the target in the battlefield
    this.battlefield.hit(x, y);

    // Add hit to the cell
    this.updateCells([x, y], 'hit');

    // Check if the ship has been sunk
    if (ship.hits === ship.size) {
      // Sink the ship
      this.updateCells(ship.coordinates, 'sunk');
    }

    // Check if the game is over
    if (this.gameOver()) {
      console.log('the game is over! you won using cheats, no prize for you!');
      this.winFeedback();
    }
  }

  /**
   * Sink a random ship
   * @returns void
   */
  protected sinkRandomShip() {
    const afloatShips = this.battlefield.getAfloatShips();

    // No ships afloat, skip
    if (afloatShips.length === 0) return;

    console.log(`there are ${afloatShips.length} afloat ships, sinking one...`);

    // Get a random ship
    const ship = afloatShips[Math.floor(Math.random() * afloatShips.length)];

    // Hit every coordinate of the ship in the battlefield
    ship.coordinates.forEach(([x, y]) => this.battlefield.hit(x, y));

    // Add hit and sunk to the cell
    this.updateCells(ship.coordinates, ['hit', 'sunk']);

    // Check if the game is over
    if (this.gameOver()) {
      console.log('the game is over! you won using cheats, no prize for you!');
      this.winFeedback();
    }
  }

  /**
   * Sink all ships
   * @returns void
   */
  protected sinkAllShips() {
    const afloatShips = this.battlefield.getAfloatShips();

    // No ships afloat, skip
    if (afloatShips.length === 0) return;

    console.log(`there are ${afloatShips.length} afloat ships, sinking all...`);

    // Sink all ships
    afloatShips.forEach(ship => {
      // Hit every coordinate of the ship in the battlefield
      ship.coordinates.forEach(([x, y]) => this.battlefield.hit(x, y));

      // Add hit and sunk to the cell
      this.updateCells(ship.coordinates, ['hit', 'sunk']);
    });

    // Check if the game is over (it should be)
    if (this.gameOver()) {
      console.log('the game is over! you won using cheats, no prize for you!');
      this.winFeedback();
    }
  }
}
