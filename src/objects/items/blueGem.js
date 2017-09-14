import Item from '../item';

export default class BlueGem extends Item {
    constructor (game, x, y) {
        super(game, x, y, 'blueGem');

        this.spawnRate = 0.08;

        this.scale.setTo(1);
        this.events.onInputDown.add(this.collided, this);
    }

    collided() {
        this.game.player.collectGem();
        this.destroy();
    }
}
