import Spawner from '../objects/spawner';
import Player from '../objects/player';
import BlueGem from '../objects/items/blueGem';
import Bomb from '../objects/items/bomb';
import Portal from '../objects/items/portal';
import TrackPool from '../objects/track-pool';
import dropRates from '../../assets/json/drop_rates.json';

require('../../assets/images/Back.png');
require('../../assets/images/bg_cave.png');
require('../../assets/images/track_str_sm.gif');
require('../../assets/images/cart_str.gif');
require('../../assets/images/blueGem.png');
require('../../assets/images/greyGem.png');
require('../../assets/images/bomb.png');
require('../../assets/images/portal.png');
require('../../assets/images/arrow.png');
require('../../assets/images/brake.png');
require('../../assets/images/Level_Button.png');
require('../../assets/images/MenuButton.png');
require('../../assets/images/ContinueArrow.png');
require('../../assets/images/ReplayArrow.png');

export default class PlayState extends Phaser.State {
    init () {
        this.player = this.game.player = this.game.player || new Player(this.game);
    }

    preload () {
        this.game.load.image('this.bgCave', '/assets/bg_cave.png');
        this.game.load.image('track_str', '/assets/track_str_sm.gif');
        this.game.load.image('cart_str', '/assets/cart_str.gif');
        this.game.load.image('back_button', '/assets/Back.png');
        this.game.load.image('bomb', '/assets/bomb.png');
        this.game.load.image('portal', '/assets/portal.png');
        this.game.load.image('boom', '/assets/explosion.png');
        this.game.load.image('arrow', '/assets/arrow.png');
        this.game.load.image('brake', '/assets/brake.png');
        this.game.load.image('jumper', '/assets/greyGem.png');
        this.game.load.image('blueGem', '/assets/blueGem.png');
        this.game.load.image('level_button', '/assets/Level_Button.png');
        this.game.load.image('menu', '/assets/MenuButton.png');
        this.game.load.image('continue', '/assets/ContinueArrow.png');
        this.game.load.image('replay', '/assets/ReplayArrow.png');
        this.booster = 0;
        this.powerUps = [];
        this.powerUpNames = [];
        this.usedPowerUp = [];
    }

    create () {
        this.bgCave = this.game.add.tileSprite(0, 0, 800, 600, 'this.bgCave');

        this.bombs = this.game.add.group();
        this.bombs.enableBody = true;
        this.bombs.inputEnableChildren = true;

        this.gems = this.game.add.group();
        this.gems.enableBody = true;
        this.gems.inputEnableChildren = true;

        this.portals = this.game.add.group();
        this.portals.enableBody = true;

        this.player.resetPlay();

        this.player.cart.events.speedUpdated.add(speed => { this.setGroupSpeed(this.tracks, speed); this.setGroupSpeed(this.bombs, speed); this.setGroupSpeed(this.gems, speed); this.setGroupSpeed(this.portals, speed); });

        this.tracks = new TrackPool(this.game);

        this.game.backButton = this.game.add.button(0, 0, 'back_button', function () { this.game.state.start('MainMenu') }, this);
        this.powerUpNames.push('boost','brake');
        this.powerUps['boost'] = this.game.add.button(this.game.width - 100, 0, 'arrow', () => {if (this.player.cart.booster < 700) { this.usePowerup('boost', 120); this.player.cart.booster += 300; }}, this);
        this.powerUps['brake'] = this.game.add.button(this.game.width - 200, 0, 'brake', () => {if (this.player.cart.booster > -100) { this.usePowerup('brake', 240); this.player.cart.booster -= 30; }}, this);

        this.gemSpawner = new Spawner(this.game, this.game.width + 15, 200, this.game.width + 15, 600, [BlueGem]);
        this.bombSpawner = new Spawner(this.game, this.game.width + 15, 200, this.game.width + 15, 600, [Bomb]);
        this.portalSpawner = new Spawner(this.game, this.game.width + 15, 200, this.game.width + 15, 600, [Portal]);

        var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

        this.gemText = this.game.add.text(200, 0, "Gems: -", style);
        this.scoreText = this.game.add.text(400, 0, "Score: -", style);

        this.player.setInfo("gems",0);
        this.player.setInfo("score",0);
    }

    update () {
        var gemCount = this.player.getInfo()["gems"];
        this.gemText.setText("Gems: " + gemCount);
        this.score = this.player.getInfo()["score"];
        this.scoreText.setText("Score: " + this.score);
        //  Scroll the background relative to track speed
        const lastAliveTrack = this.tracks.getLastAlive();

        this.bgCave.tilePosition.x -= -(lastAliveTrack.body.velocity.x / 100);

        // Keep spawning the tracks
        if (lastAliveTrack.body.x < this.game.width) {
            this.spawn();
        }

        // Wait till the timer is up to reenable the buttons
        this.powerUpNames.forEach(function(element) {
            if (this.usedPowerUp[element]) {
                this.usedPowerUp[element]--;
                if (!this.usedPowerUp[element]) {
                    this.reenablePowerup(element);
                }
            }
        }, this);

        // Make sure collision with tracks happens correctly, may need to do a callback to make sure it goes up hill?
        this.game.physics.arcade.collide(this.player.cart, this.tracks, null, null, null);
    }

    spawn () {
        const lastAliveTrack = this.tracks.getLastAlive();

        let currentSpeed = lastAliveTrack.body.velocity.x;

        let nextTrack = this.tracks.spawnTrack(lastAliveTrack.body.x, currentSpeed);

        var gem = this.gemSpawner.spawnItem();
        if (gem) {
            gem.body.x = nextTrack.body.x;
            gem.body.velocity.x = currentSpeed;
            this.gems.add(gem);
        }

        var bomb = this.bombSpawner.spawnItem();
        if (bomb) {
            bomb.body.x = nextTrack.body.x;
            bomb.body.velocity.x = currentSpeed;
            this.bombs.add(bomb);
        }

        var portal = this.portalSpawner.spawnItem();
        if (portal) {
            portal.body.x = nextTrack.body.x;
            portal.body.velocity.x = currentSpeed;
            portal.events.playerWins.add(() => {this.triggerOverlay()});
            this.portals.add(portal);
        }
    }

    setGroupSpeed (group, speed) {
        group.setAll('body.velocity.x', (speed), 'true', 'false', 0);
    }

    usePowerup(powerUp, resetTime) {
        this.powerUps[powerUp].tint = 0x888888;
        this.powerUps[powerUp].inputEnabled = false;
        this.usedPowerUp[powerUp] = resetTime;
    }

    reenablePowerup(powerUp) {
        this.powerUps[powerUp].tint = 0xffffff;
        this.powerUps[powerUp].inputEnabled = true;
    }

	triggerOverlay () {
        // TODO stop the game, somehow
		this.overlay = this.add.bitmapData(this.game.width, this.game.height);
		this.overlay.ctx.fillStyle = '#000';
		this.overlay.ctx.fillRect(0, 0, this.game.width, this.game.height);
		this.panel = this.add.sprite(0, this.game.height, this.overlay);
		this.panel.alpha = 0.65;

		var levelCompletePanel = this.add.tween(this.panel);
		levelCompletePanel.to({y: 0}, 500);

		levelCompletePanel.onComplete.add(function() {
			var style = {font: '40px Arial', fill: '#fff'};
			this.add.text(this.game.width/2, this.game.height/4,
				'Congratulations!', style).anchor.setTo(0.5);
			this.add.text(this.game.width/2, this.game.height/4 + 40,
				'Level Complete!', style).anchor.setTo(0.5);

			style = {font: '30px Arial', fill: '#fff'};
			this.add.text(this.game.width/2, this.game.height/3 + 40, 
				'Best Score: ' + this.score, style).anchor.setTo(0.5);

			this.add.text(this.game.width/2, this.game.height/3 + 80, 
				'Your Score: ' + this.score, style).anchor.setTo(0.5);

			if (this.bestTime == this.yourTime) {
				style = {font: '35px Arial', fill: '#f80'};
				this.add.text(this.game.width/2, this.game.height/2 + 30,
					'New Record!!!', style).anchor.setTo(0.5);
			}

			this.replayLevelIcon = this.add.button(this.game.width/2, this.game.height * 3/4, 'level_button', function () { this.game.state.start('Play') }, this);
			this.replayLevelIcon.customParams = {};
			this.replayLevelIcon.customParams.levelNumber = this.currentLevel;
			this.replayLevelIcon.width = this.game.width / 7 - 2;
			this.replayLevelIcon.height = this.game.width / 7 - 2;
			this.replayLevelIcon.anchor.setTo(0.5);
			this.replayArrow = this.add.sprite(this.replayLevelIcon.position.x, this.replayLevelIcon.position.y, 'replay');
			this.replayArrow.anchor.setTo(0.5);
			this.replayArrow.scale.setTo(this.replayLevelIcon.width/this.replayArrow.width*0.6);

			this.playNextLevelIcon = this.add.button(this.game.width * 3/4, this.game.height * 3/4, 'level_button', function () { this.game.state.start('MainMenu') }, this);
			this.playNextLevelIcon.customParams = {};
			this.playNextLevelIcon.customParams.levelNumber = this.nextLevel;
			this.playNextLevelIcon.width = this.game.width / 7 - 2;
			this.playNextLevelIcon.height = this.game.width / 7 - 2;
			this.playNextLevelIcon.anchor.setTo(0.5);
			this.playArrow = this.add.sprite(this.playNextLevelIcon.position.x + 4, this.playNextLevelIcon.position.y, 'continue');
			this.playArrow.anchor.setTo(0.5);
			this.playArrow.scale.setTo(this.playNextLevelIcon.width/this.playArrow.width*0.6);

			this.levelSelectorIcon = this.add.button(this.game.width/4, this.game.height * 3/4, 'level_button', function () { this.game.state.start('Shop') }, this);
			this.levelSelectorIcon.width = this.game.width / 7 - 2;
			this.levelSelectorIcon.height = this.game.width / 7 - 2;
			this.levelSelectorIcon.anchor.setTo(0.5);
			this.menuIcon = this.add.sprite(this.levelSelectorIcon.position.x, this.levelSelectorIcon.position.y, 'menu');
			this.menuIcon.anchor.setTo(0.5);
			this.menuIcon.scale.setTo(this.levelSelectorIcon.width/this.menuIcon.width*0.6);

		}, this);

		levelCompletePanel.start();
	}

};
