/**
 * Converts a letter to a number (A -> 0, B -> 1, etc.)
 * @param letter string
 * @returns number
 */
export function letterToNumber(letter: string) {
    return letter.charCodeAt(0) - 65;
}

/**
* Converts a number to a letter (0 -> A, 1 -> B, etc.)
* @param number number
* @returns string
*/
export function numberToLetter(number: number) {
    return String.fromCharCode(number + 65);
}

/**
 * Converts a string to coordinates
 * @param target string
 * @returns [number, number]
 */
export function stringToCoordinates(target: string): [number, number] {
    const x = letterToNumber(target[0]);
    const y = parseInt(target.substring(1)) - 1;

    return [x, y];
}

/**
 * Validates coordinates
 * @param x number
 * @param y number
 * @returns boolean
 */
export function validateCoordinates(x: number, y: number): boolean {
  return typeof x === 'number'
  && !Number.isNaN(x)
  && typeof y === 'number'
  && !Number.isNaN(y)
}
