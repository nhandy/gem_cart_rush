import Item from '../item';

export default class Portal extends Item {
    constructor (game, x, y) {
        super(game, x, y, 'portal');
        // if this.player.getInfo()['gems'] >= 100
        // this.spawnRate = 0.01;
        // else
        this.spawnRate = 0.005;

        this.scale.setTo(0.30);
    }
}
