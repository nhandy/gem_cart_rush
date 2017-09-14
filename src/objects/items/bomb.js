import Item from '../item';

export default class Bomb extends Item {
    constructor (game, x, y) {
        super(game, x, y, 'bomb');

        this.spawnRate = 0.1;

        this.scale.x = this.scale.y = 0.25;
    }
}
