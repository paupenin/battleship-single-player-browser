/**
 * Coordinate type
 */
export type Coordinate = [number, number];

/**
 * Ship type
 */
export type ShipType = {
  type: 'battleship' | 'destroyer';
  size: number;
  hits: number;
  direction: 'horizontal' | 'vertical';
  bow: Coordinate; // Front of the ship
  coordinates: Coordinate[];
}
