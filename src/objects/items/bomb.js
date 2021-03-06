import Item from '../item';

export default class Bomb extends Item {
    constructor (game, x, y) {
        super(game, x, y, 'bomb');

        this.spawnRate = 0.1;

        this.scale.setTo(0.25);
    }

    clicked () {
        console.log('Clicked a BOMB');
        this.destroy();
    }

    collided () {
        console.log('Collided with BOMB');
        this.destroy();
    }
}
