window.onload = function()
{
    var game = new Phaser.game();
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            fps: 60,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: Preload,
        create: Create,
        update: Update
    }
};

const FPS = 30;
const SHIP_SIZE = 30;

var game = new Phaser.Game(config);


var keys;

var canv = document.getElementById("gameCanvas");
var context = canv.getContext("2d");
var bullets;
var fire;

function Preload()
{
    this.load.setBaseURL('http://labs.phaser.io');

    this.load.image('background', 'assets/tests/space/nebula.jpg'); 
    this.load.image('bullet', 'assets/games/asteroids/bullets.png');
    this.load.image('ship', 'assets/games/asteroids/ship.png');
    this.load.atlas('space', 'assets/tests/space/space.png', 'assets/tests/space/space.json');

}

function Create()
{            
    var Bullet = new Phaser.Class({

        Extends: Phaser.Physics.Arcade.Image,

        initialize:

        function Bullet (scene)
        {
            Phaser.Physics.Arcade.Image.call(this, scene, 0, 0, 'space', 'blaster');

            this.setBlendMode(1);
            this.setDepth(1);

            this.speed = 300;
            this.lifespan = 1000;

            this._temp = new Phaser.Math.Vector2();
        },

        fire: function (player)
        {
            this.lifespan = 1000;

            this.setActive(true);
            this.setVisible(true);

            this.setAngle(player.body.rotation);
            this.setPosition(player.x, player.y);
            this.body.reset(player.x, player.y);

            var angle = Phaser.Math.DegToRad(player.body.rotation);

            this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);

            this.body.velocity.x *= 2;
            this.body.velocity.y *= 2;
        },

        update: function (time, delta)
        {
            this.lifespan -= delta;

            if (this.lifespan <= 0)
            {
                this.setActive(false);
                this.setVisible(false);
                this.body.stop();
            }
        }

    });


    var bg = this.add.tileSprite(400, 300, 800, 600, 'background').setScrollFactor(0);

    var particles = this.add.particles('space');
    var emitter = particles.createEmitter({
        frame: 'blue',
        speed: 100,
        lifespan: {
            onEmit: function (particle, key, t, value)
            {
                return Phaser.Math.Percent(player.body.speed, 0, 300) * 2000;
            }
        },
        alpha: {
            onEmit: function (particle, key, t, value)
            {
                return Phaser.Math.Percent(player.body.speed, 0, 300);
            }
        },
        angle: {
            onEmit: function (particle, key, t, value)
            {
                var v = Phaser.Math.Between(-10, 10);
                return (player.angle - 180) + v;
            }
        },
        scale: { start: 0.3, end: 0 },
        blendMode: 'ADD'
    });

    player = this.physics.add.image(400, 300, 'ship');

    player.setDamping(true);
    player.setDrag(0.99);
    player.setMaxVelocity(200);
    player.setBounce(1, 1);
    player.setCollideWorldBounds(true);


    keys = this.input.keyboard.createCursorKeys();
    emitter.startFollow(player);

    bullets = this.physics.add.group({
        classType: Bullet,
        maxSize: 30,
        runChildUpdate: true
    });

    fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

}




function Update()
{
    

    if (keys.up.isDown)
    {
        this.physics.velocityFromRotation(player.rotation, 200, player.body.acceleration);
    }
    else
    {
        player.setAcceleration(0);
    }

    if (keys.left.isDown)
    {
        player.setAngularVelocity(-300);
    }
    else if (keys.right.isDown)
    {
        player.setAngularVelocity(300);
    }
    else
    {
        player.setAngularVelocity(0);
    }


    if (fire.isDown)
    {
        var bullet = bullets.get();

        if (bullet)
        {
            bullet.fire(player);
        }
    }

}