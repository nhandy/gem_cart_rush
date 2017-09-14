export default class Spawner {
    /*
        Params:
            game: Phaser Game object
            minX: lowest x value
            minY: lowest y value
            maxX: highest x value
            maxY: higest y value
            spawnItems: [
                [Item2Class, 0.3],
                [Item1Class, 0.5]
            ]
    */
    constructor (game, minX = 0, minY = 0, maxX = 0, maxY = 0, spawnItems = []) {
        this.game = game;
        this.minX = minX;
        this.maxX = maxX > minX ? maxX : minX;
        this.minY = minY;
        this.maxY = maxY > minY ? maxY : minY;

        if (!Array.isArray(spawnItems)) {
            throw new Error('spawnItems is not an array');
        }

        this.spawnItems = spawnItems;
    }

    spawnItem () {
        const randNum = this.game.rnd.frac();

        const spawnItems = _.filter(this.spawnItems, o => { return randNum <= o[1]; });

        if (spawnItems.length > 0) {
            const ItemClass = spawnItems[0][0];

            return new ItemClass(this.game, this.game.rnd.between(this.minX, this.maxX), this.game.rnd.between(this.minY, this.maxY));
        }

        return undefined;
    }
}
