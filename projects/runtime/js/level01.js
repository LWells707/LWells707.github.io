var level01 = function (window) {

    window.opspark = window.opspark || {};

    var draw = window.opspark.draw;
    var createjs = window.createjs;

    window.opspark.runLevelInGame = function(game) {
        // some useful constants 
        var groundY = game.groundY;

        // this data will allow us to define all of the
        // behavior of our game
        var levelData = {
            "name": "Robot Romp",
            "number": 1, 
            "speed": -3,
            "gameItems": [
                { "type": "sawblade", "x": 400, "y": groundY },
                { "type": "sawblade", "x": 600, "y": groundY },
                { "type": "sawblade", "x": 900, "y": groundY },
                { "type": "enemy", "x": 400, "y": 10},
                { "type": "enemy", "x": 800, "y": 100},
                { "type": "enemy", "x": 1200, "y": 50},
                { "type": "laser", "x": 2500, "y": groundY},
                {"type": "squirrel", "x": 300, "y": groundY}
            ]
        };
        for(var i = 0; i < levelData.gameItems.length; i++){
            var obj = levelData.gameItems[i];
            var objX = obj.x;
            var objY = obj.y;
            var objKey = obj.type;
            if(objKey === "sawblade"){
                createSawBlade(objX, objY);
            }
            else if (objKey === "enemy"){
                createEnemy(objX, objY);
            }
            else if (objKey === "laser"){
                createLaser(objX, objY);
            }
            else {
                for(s = 0; s < 289; s++){
                    createSquirrel(objX,objY);
                }
            }
        }
        window.levelData = levelData;
        // set this to true or false depending on if you want to see hitzones
        game.setDebugMode(true);

        // TODO 6 and on go here
        // BEGIN EDITING YOUR CODE HERE
        function createSawBlade(x, y){
            var hitZoneSize = 25;
            var damageFromObstacle = 10;
            var sawBladeHitZone = game.createObstacle(hitZoneSize, damageFromObstacle);
            sawBladeHitZone.x = x;
            sawBladeHitZone.y = y;
            game.addGameItem(sawBladeHitZone);  
            var obstacleImage = draw.bitmap('img/sawblade.png');
            sawBladeHitZone.addChild(obstacleImage);
            obstacleImage.x = -hitZoneSize;
            obstacleImage.y = -hitZoneSize;
        }
        function createLaser(x){
            var hitZoneSize = 500;
            var damageFromObstacle = 100000000000;
            var laserHitZone = game.createObstacle(hitZoneSize, damageFromObstacle);
            laserHitZone.x = x;
            laserHitZone.y = 650;
            game.addGameItem(laserHitZone);
            var obstacleImage = draw.bitmap('img/whenceThouShaltDie.png');
            laserHitZone.addChild(obstacleImage);
            obstacleImage.x = -hitZoneSize;
            obstacleImage.y = -hitZoneSize;
        }
        function createEnemy(x, y){
            var enemy = game.createGameItem('enemy',25);
            redSquare = draw.rect(50,50,'red');
            redSquare.x = -25;
            redSquare.y = -25;
            enemy.addChild(redSquare);
            enemy.x = x;
            enemy.y = groundY - y;
            game.addGameItem(enemy);
            enemy.velocityX = -1;
            enemy.rotationalVelocity = 150;
            enemy.onPlayerCollision = function() {
                console.log('The enemy has hit Halle');
                game.changeIntegrity(-69);
            }
            enemy.onProjectileCollision = function(){
                console.log("Player has hit the enemy");
                game.increaseScore(420);
                enemy.fadeOut();
            }
        }
        function createSquirrel(x){
            var squirrel = game.createGameItem('squirrel', 25);
            squirrelImage = draw.bitmap('img/sqerlPickup.jpg');
            squirrelImage.x = -25;
            squirrelImage.y = -25;
            squirrel.addChild(squirrelImage);
            squirrel.x = x;
            squirrel.y = groundY - 20;
            game.addGameItem(squirrel);
            squirrel.velocityX = -1;
            squirrel.onPlayerCollision = function() {
                squirrel.fadeOut();
                game.increaseScore(" squirrel ");
            }
        }
    
        createSquirrel(300);
        // DO NOT EDIT CODE BELOW HERE
    }
};

// DON'T REMOVE THIS CODE //////////////////////////////////////////////////////
if((typeof process !== 'undefined') &&
    (typeof process.versions.node !== 'undefined')) {
    // here, export any references you need for tests //
    module.exports = level01;
}
