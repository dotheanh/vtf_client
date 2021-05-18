
var LevelManager = cc.Class.extend({
    _currentLevel:null,
    _gameLayer:null,
    ctor:function(gameLayer){
        if(!gameLayer){
            throw "gameLayer must be non-nil";
        }
        this._currentLevelNum = 1;
        this._currentLevel = LEVELS[this._currentLevelNum-1];
        this._gameLayer = gameLayer;
        this._isGameEnd = false;
        this.setLevel(this._currentLevel);
    },

    setLevel:function(level){
    },

    nextLevel:function(){
        if (this._currentLevelNum === LEVELS.length) {
            this._isGameEnd = true;
        }
        else {
            this._currentLevel = LEVELS[++this._currentLevelNum-1];
        }
    },
});
