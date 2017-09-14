import Spawner from '../objects/spawner';
import Bomb from '../objects/items/bomb';
import dropRates from '../../assets/json/drop_rates.json';

require('../../assets/images/Back.png');
require('../../assets/images/bg_cave.png');
require('../../assets/images/track_str_sm.gif');
require('../../assets/images/cart_str.gif');
require('../../assets/images/bomb.png');
require('../../assets/images/arrow.png');
require('../../assets/images/brake.png');
require('../../assets/images/blueGem.png');

export default class PlayState extends Phaser.State {
    preload () {
        this.game.load.image('this.bgCave', '/assets/bg_cave.png');
        this.game.load.image('track_str', '/assets/track_str_sm.gif');
        this.game.load.image('cart_str', '/assets/cart_str.gif');
        this.game.load.image('back_button', '/assets/Back.png');
        this.game.load.image('bomb', '/assets/bomb.png');
        this.game.load.image('arrow', '/assets/arrow.png');
        this.game.load.image('brake', '/assets/brake.png');
        this.game.load.image('blueGem', '/assets/blueGem.png');
        this.booster = 0;
    }

    create () {
        this.game.keyboard = new Phaser.Keyboard(this.game);
        this.game.dpad = this.game.keyboard.createCursorKeys();
        this.bgCave = this.game.add.tileSprite(0, 0, 800, 600, 'this.bgCave');
        this.tracks = this.game.add.group();
        this.tracks.enableBody = true;
        for (var i = 0, len = 100; i < len; i += 35) {
            this.t = this.tracks.create(i, this.game.height * 0.8, 'track_str');
            this.t.body.immovable = true;
        }
        this.cartType = this.game.add.group();
        this.cartType.enableBody = true;
        this.cart = this.cartType.create(50, 430, 'cart_str');
        this.game.physics.enable(this.cart, Phaser.Physics.ARCADE);
        this.cart.body.gravity.y = 200;
        this.cart.body.collideWorldBounds = true;
        this.cart.body.checkCollision.up = true;
        this.cart.body.checkCollision.down = true;
        this.game.backButton = this.game.add.button(0, 0, 'back_button', function () { this.game.state.start('MainMenu') }, this);
        this.game.boostButton = this.game.add.button(this.game.width - 100, 0, 'arrow', function(){if (this.booster < 700) { this.booster += 50; }}, this);
        this.game.brakeButton = this.game.add.button(this.game.width - 200, 0, 'brake', function(){if (this.booster > -100) { this.booster -= 50; }}, this);
        this.gemSpawner = new Spawner(this.game, this.game.width + 15, 200, this.game.width + 15, 600, ['gem', 1]);
        this.bombSpawner = new Spawner(this.game, this.game.width + 15, 200, this.game.width + 15, 600, [Bomb]);
    }

    update () {
        //  Scroll the background relative to track speed
        this.bgCave.tilePosition.x -= -(this.t.body.velocity.x/100)

        if (this.t.body.x < 800) {
            this.spawn();
        }

        var firstAlive = this.tracks.getFirstAlive();
        if (firstAlive.x < -35) { // Cleanup as we go
            this.tracks.removeChild(firstAlive);
        }
        // Make sure collision with tracks happens correctly, may need to do a callback to make sure it goes up hill?
        this.game.physics.arcade.collide(this.cartType, this.tracks, null, null, null);
        this.syncCart(this.cart, this.tracks);
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
        }

        var bomb = this.bombSpawner.spawnItem();
        if (bomb) {
            bomb.body.x = this.t.body.x;
            bomb.body.velocity.x = currentVelocity;
            this.game.add.existing(bomb);
        }
    }

	syncCart(myCart, trackGroup) {
        var modifier = 0;
        if (myCart.body.x > 150) {
            modifier = 20;
            this.fix_position = 1;
        } else if (myCart.body.x < 20) {
            modifier = -20;
            this.fix_position = 1;
        } else if (this.fix_position && (myCart.body.x >= 70 && myCart.body.x <= 80)) {
            // Move the cart until it gets up to full speed
            this.setTrackSpeed(trackGroup, -(myCart.body.velocity.x));
            this.fix_position = 0;
        } else {
            if (myCart.body.velocity.x < (300 + this.booster)) {
                myCart.body.velocity.x += 10;
            // Move the cart until it gets back close to full speed
            } else if (myCart.body.velocity.x > (200 + this.booster + 20)) {
                myCart.body.velocity.x -= 10;
            }
        }
        if (modifier) {
            this.setTrackSpeed(trackGroup, -(myCart.body.velocity.x + modifier));
        }
	}

	setTrackSpeed(trackGroup, speed) {
        trackGroup.setAll('body.velocity.x', (speed), 'true', 'false', 0);
    }
};
