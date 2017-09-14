import Track from './track';

export default class TrackPool extends Phaser.Group {
    constructor (game) {
        super(game);

        const imageStr = 'track_str';

        const img = this.game.cache.getImage(imageStr);

        this.trackWidth = img.width;

        this.enableBody = true;

        const numTracks = Math.floor(this.game.width / this.trackWidth);

        for (let i = 0; i < numTracks * 2; i++) { // double the width of the screen
            this.add(new Track(this.game));
        }

        for (let t = -1; t < numTracks + 1; t++) { // start with some tracks created
            this.spawnTrack(t * this.trackWidth, 0);
        }
    }

    getLastAlive () {
        return _.last(_.filter(this.children, o => { return o.alive; }).sort((a, b) => { return a.x - b.x; }));
    }

    spawnTrack (startX, startSpeed) {
        startX = typeof startX !== 'undefined' ? startX : this.game.width;

        let nextTrack = this.getFirstDead();
        nextTrack.reset(startX + this.trackWidth, this.game.height * 0.8);
        nextTrack.body.velocity.x = startSpeed;
        nextTrack.body.immovable = true;

        return nextTrack;
    }
}
