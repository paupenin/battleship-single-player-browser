import { ShipType, Coordinate } from './types';

/**
 * Battlefield class
 * 
 * It is responsible for controlling the battlefield and ships state.
 * 
 * @class Battlefield
 */
class Battlefield {
  protected size: number;
  protected ships: ShipType[] = [];
  protected hits: Coordinate[] = [];

  /**
   * Constructor
   * @param size number Size of the battlefield
   * @returns Battlefield
   */
  constructor(size: number) {
    this.size = size;

    console.log(`creating a battlefield of ${size}km x ${size}km ...`);
  }

  /**
   * Generate ships
   * @param shipTypes ('battleship' | 'destroyer')[]
   * @returns void
   * @throws Error
   */
  public generateShips(shipTypes: ('battleship' | 'destroyer')[]) {
    console.log('securing contracts with the shipyard...');

    shipTypes.forEach((shipType) => {
      this.ships.push(
        this.createShip(shipType)
      );
    });

    console.log('ships are ready! pop the champagne!');
  }

  /**
   * Create ship with random coordinates and direction
   * @param type 'battleship' | 'destroyer'
   * @returns ShipType
   * @throws Error
   */
  protected createShip(type: 'battleship' | 'destroyer'): ShipType {
    console.log(`building a magnificent ${type}`);

    const size = type === 'battleship' ? 5 : 4;

    // Find random ship position
    const [bow, direction] = this.findRandomShipPosition(size);

    return {
      type,
      size,
      hits: 0,
      direction,
      bow,
      coordinates: this.generateShipCoordinates(bow, direction, size),
    } as ShipType;
  }

  /**
   * Find random ship position
   * @param size number
   * @returns [Coordinate, 'horizontal' | 'vertical']
   * @throws Error
   */
  protected findRandomShipPosition(size: number): [Coordinate, 'horizontal' | 'vertical'] {
    // Get random coordinates and direction
    let randomCoordinate = this.getRandomCoordinate();
    let randomDirection = this.getRandomDirection();

    // Loop until we find a valid position
    let attemps = 0;
    const maxAttemps = 100;
    while (!this.isValidShipPosition(randomCoordinate, randomDirection, size)) {
      // If we tried maxAttempts times, throw an error, this is
      // unlikely to happen in a 10x10 grid with 3 ships
      if (attemps > maxAttemps) {
        throw new Error('Could not find a valid position for the ship');
      }

      randomCoordinate = this.getRandomCoordinate();
      randomDirection = this.getRandomDirection();

      attemps++;
    }

    return [randomCoordinate, randomDirection];
  }

  /**
   * Get random coordinate
   * @returns Coordinate
   */
  protected getRandomCoordinate(): Coordinate {
    return [
      Math.floor(Math.random() * this.size),
      Math.floor(Math.random() * this.size),
    ];
  }

  /**
   * Get random direction
   * @returns 'horizontal' | 'vertical'
   */
  protected getRandomDirection(): 'horizontal' | 'vertical' {
    const directions = ['horizontal', 'vertical'];
    return directions[Math.floor(Math.random() * directions.length)] as 'horizontal' | 'vertical';
  }

  /**
   * Check if the given coordinates are valid to place a ship
   * @param bow Coordinate
   * @param direction 'horizontal' | 'vertical'
   * @param size number
   * @returns boolean
   */
  protected isValidShipPosition(
    bow: Coordinate,
    direction: 'horizontal' | 'vertical',
    size: number
  ): boolean {
    // Generate ship coordinates
    const coordinates = this.generateShipCoordinates(bow, direction, size);

    // Check if all coordinates are valid and there is no ship in the given coordinates
    return coordinates.every(
      ([x, y]) => this.isValidCoordinate(x, y) && !this.getShipAt(x, y)
    );
  }

  /**
   * Generate ship coordinates
   * @param bow Coordinate
   * @param direction 'horizontal' | 'vertical'
   * @param size number
   * @returns Coordinate[]
   */
  protected generateShipCoordinates(
    bow: Coordinate,
    direction: 'horizontal' | 'vertical',
    size: number
  ): Coordinate[] {
    const coordinates: Coordinate[] = [];

    for (let i = 0; i < size; i++) {
      coordinates.push(
        direction === 'horizontal'
          ? [bow[0] + i, bow[1]]
          : [bow[0], bow[1] + i]
      );
    }

    return coordinates;
  }

  /**
   * Hit the battlefield in the given coordinates
   * @param x number
   * @param y number
   * @returns ShipType | undefined
   * @throws Error
   */
  public hit(x: number, y: number): ShipType | undefined {
    // Check if the coordinate is valid
    if (!this.isValidCoordinate(x, y)) {
      throw new Error('Invalid coordinate');
    }

    // Check if the coordinate was already hit
    if (this.coordinateHasBeenHit(x, y)) {
      return this.getShipAt(x, y);
    }

    // Add hit to the hits array
    this.hits.push([x, y]);

    // Check if there is a ship in the given coordinates
    const ship = this.getShipAt(x, y);

    if (ship) {
      ship.hits++;
    }

    return ship;
  }

  /**
   * Check if the given coordinate exists in the battlefield
   * @param x number
   * @param y number
   * @returns boolean
   */
  protected isValidCoordinate(x: number, y: number): boolean {
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }

  /**
   * Check if the given coordinate has been hit
   * @param x number
   * @param y number
   * @returns boolean
   */
  public coordinateHasBeenHit(x: number, y: number): boolean {
    return !!this.hits.find(hit => hit[0] === x && hit[1] === y);
  }

  /**
   * Get ship in the given coordinates (if any)
   * @param x
   * @param y
   * @returns ShipType | undefined
   */
  public getShipAt(x: number, y: number): ShipType | undefined {
    return this.ships.find(ship => {
      return ship.coordinates.find(c => c[0] === x && c[1] === y);
    });
  }

  /**
   * Get all ships (sunk and afloat)
   * @returns ShipType[]
   */
  public getShips(): ShipType[] {
    return this.ships;
  }

  /**
   * Get afloat ships (not sunk)
   * @returns ShipType[]
   */
  public getAfloatShips(): ShipType[] {
    return this.ships.filter(ship => ship.hits < ship.size);
  }
}

export default Battlefield;
