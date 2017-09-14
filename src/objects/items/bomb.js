import Item from '../item';

export default class Bomb extends Item {
    constructor (game, x, y) {
        super(game, x, y, 'bomb');
    }
}
