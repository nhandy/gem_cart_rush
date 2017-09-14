export default class Spawner {
    /*
        Params:
            game: Phaser Game object
            minX: lowest x value
            minY: lowest y value
            maxX: highest x value
            maxY: higest y value
            spawnItems: {
                [Item1Class, 0.5],
                [Item2Class, 0.3]
            }
    */
    constructor (game, minX = 0, minY = 0, maxX = 0, maxY = 0, spawnItems = {}) {
        this.game = game;
        this.minX = minX;
        this.maxX = maxX > minX ? maxX : minX;
        this.minY = minY;
        this.maxY = maxY > minY ? maxY : minY;
        this.spawnItems = spawnItems;
    }

    spawnItem () {
    }
}
