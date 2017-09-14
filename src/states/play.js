require('../../assets/images/Back.png');
require('../../assets/images/bg_cave.png');
require('../../assets/images/track_str_sm.gif');
require('../../assets/images/cart_str.gif');
require('../../assets/images/bomb.png');
import dropRates from '../../assets/json/drop_rates.json';
var bg_cave;
var cart;
var tracks;
var cart_type;
import Spawner from '../objects/spawner';

export default class PlayState extends Phaser.State {
    preload () {
        this.game.load.image('bg_cave', '/assets/bg_cave.png');
        this.game.load.image('track_str', '/assets/track_str_sm.gif');
        this.game.load.image('cart_str', '/assets/cart_str.gif');
        this.game.load.image('back_button', '/assets/Back.png');
        this.game.load.image('bomb', '/assets/bomb.png');
    }

    create () {
        this.game.keyboard = new Phaser.Keyboard(this.game);
        this.game.dpad = this.game.keyboard.createCursorKeys();
        bg_cave = this.game.add.tileSprite(0, 0, 800, 600, 'bg_cave');
        tracks = this.game.add.group();
        tracks.enableBody = true;
        for (var i = 0, len = 100; i < len; i += 35) {
            this.t = tracks.create(i, this.game.height * 0.8, 'track_str');
            this.t.body.immovable = true;
        }
        cart_type = this.game.add.group();
        cart_type.enableBody = true;
        cart = cart_type.create(50, 430, 'cart_str');
        this.game.physics.enable(cart, Phaser.Physics.ARCADE);
        cart.body.gravity.y = 200;
        cart.body.collideWorldBounds = true;
        cart.body.checkCollision.up = true;
        cart.body.checkCollision.down = true;
        this.game.backButton = this.game.add.button(0, 0, 'back_button', function(){this.game.state.start('MainMenu')}, this);
        this.gemSpawner = new Spawner(this.game, this.game.width + 15, 200, this.game.width + 15, 600, ['gem', 1]);
    }

    update () {
        //  Scroll the background, may want to do it relative to speed of tracks
        bg_cave.tilePosition.x -= 2;

        if (this.t.body.x < 800) {
            this.spawn();
        }

        // Move the cart until it gets up to full speed
        if (cart.body.velocity.x < 200) {
            cart.body.velocity.x += 30;
            tracks.setAll('body.velocity.x', -(cart.body.velocity.x), 'true', 'false', 0);
        }
        var firstAlive = tracks.getFirstAlive();
        if (firstAlive.x < -35) { // Cleanup as we go
            tracks.removeChild(firstAlive);
        }
        // Make sure collision with tracks happens correctly, may need to do a callback to make sure it goes up hill?
        this.game.physics.arcade.collide(cart_type, tracks, null, null, null);
    }

    spawn() {
        var currentVelocity = this.t.body.velocity.x
        var currentX = this.t.body.x

        this.t = tracks.create(currentX + 35, this.game.height*.8, 'track_str');
        this.t.body.velocity.x = currentVelocity;
        this.t.body.immovable = true;

        var newGem = this.gemSpawner.spawnItem();
        if (newGem) {
            newGem.body.x = this.t.body.x;
            newGem.body.velocity.x = currentVelocity;
        }
    }
};
