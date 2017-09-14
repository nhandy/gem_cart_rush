import Spawner from '../objects/spawner';
import Player from '../objects/player';
import BlueGem from '../objects/items/blueGem';
import Bomb from '../objects/items/bomb';
import dropRates from '../../assets/json/drop_rates.json';

require('../../assets/images/Back.png');
require('../../assets/images/bg_cave.png');
require('../../assets/images/track_str_sm.gif');
require('../../assets/images/cart_str.gif');
require('../../assets/images/blueGem.png');
require('../../assets/images/bomb.png');
require('../../assets/images/arrow.png');
require('../../assets/images/brake.png');

export default class PlayState extends Phaser.State {
    preload () {
        this.game.load.image('this.bgCave', '/assets/bg_cave.png');
        this.game.load.image('track_str', '/assets/track_str_sm.gif');
        this.game.load.image('cart_str', '/assets/cart_str.gif');
        this.game.load.image('back_button', '/assets/Back.png');
        this.game.load.image('bomb', '/assets/bomb.png');
        this.game.load.image('boom', '/assets/explosion.png');
        this.game.load.image('arrow', '/assets/arrow.png');
        this.game.load.image('brake', '/assets/brake.png');
        this.game.load.image('blueGem', '/assets/blueGem.png');
    }

    create () {
        this.bgCave = this.game.add.tileSprite(0, 0, 800, 600, 'this.bgCave');

        this.tracks = this.game.add.group();
        this.tracks.enableBody = true;

        this.bombs = this.game.add.group();
        this.bombs.enableBody = true;

        this.gems = this.game.add.group();
        this.gems.enableBody = true;

        this.game.player = this.player = new Player(this.game);

        for (var i = 0, len = 100; i < len; i += 35) {
            this.t = this.tracks.create(i, this.game.height * 0.8, 'track_str');
            this.t.body.immovable = true;
        }

        this.player.cart.events.speedUpdated.add(speed => { this.setGroupSpeed(this.tracks, speed); this.setGroupSpeed(this.bombs, speed); this.setGroupSpeed(this.gems, speed); });

        this.game.backButton = this.game.add.button(0, 0, 'back_button', function () { this.game.state.start('MainMenu') }, this);
        this.game.boostButton = this.game.add.button(this.game.width - 100, 0, 'arrow', () => { if (this.player.cart.booster < 700) { this.player.cart.booster += 50; } }, this);
        this.game.brakeButton = this.game.add.button(this.game.width - 200, 0, 'brake', () => { if (this.player.cart.booster > -100) { this.player.cart.booster -= 50; } }, this);

        this.gemSpawner = new Spawner(this.game, this.game.width + 15, 200, this.game.width + 15, 600, [BlueGem]);
        this.bombSpawner = new Spawner(this.game, this.game.width + 15, 200, this.game.width + 15, 600, [Bomb]);
  

        var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

        this.gemText = this.game.add.text(200, 0, "Gems: -", style);
        this.scoreText = this.game.add.text(400, 0, "Score: -", style);
 
        this.player.setInfo("gems",0);
        this.player.setInfo("score",0);
   }

    update () {
        var gemCount = this.player.getInfo()["gems"];
        this.gemText.setText("Gems: " + gemCount);
        var score = this.player.getInfo()["score"];
        this.scoreText.setText("Score: " + score);
        //  Scroll the background relative to track speed
        this.bgCave.tilePosition.x -= -(this.t.body.velocity.x / 100)

        if (this.t.body.x < 800) {
            this.spawn();
        }

        var firstAlive = this.tracks.getFirstAlive();
        if (firstAlive.x < -35) { // Cleanup as we go
            this.tracks.removeChild(firstAlive);
        }
        // Make sure collision with tracks happens correctly, may need to do a callback to make sure it goes up hill?
        this.game.physics.arcade.collide(this.player, this.tracks, null, null, null);
        // this.syncCart(this.cart, this.tracks);
    }

    spawn () {
        var currentVelocity = this.t.body.velocity.x
        var currentX = this.t.body.x

        this.t = this.tracks.create(currentX + 35, this.game.height * 0.8, 'track_str');
        this.t.body.velocity.x = currentVelocity;
        this.t.body.immovable = true;

        var newGem = this.gemSpawner.spawnItem();
        if (newGem) {
            newGem.body.x = this.t.body.x;
            newGem.body.velocity.x = currentVelocity;
            this.gems.add(newGem);
        }

        var bomb = this.bombSpawner.spawnItem();
        if (bomb) {
            bomb.body.x = this.t.body.x;
            bomb.body.velocity.x = currentVelocity;
            this.bombs.add(bomb);
        }
    }

    setGroupSpeed (group, speed) {
        group.setAll('body.velocity.x', (speed), 'true', 'false', 0);
    }
};
