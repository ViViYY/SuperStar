import { GameData } from './../Util/GameData';
import { Define } from '../Util/Define';

const {ccclass, property} = cc._decorator;

@ccclass
export class Game extends cc.Component {

    @property(cc.Node)
    layerStar: cc.Node = null;

    @property(cc.Label)
    labelChapter: cc.Label = null;

    @property(cc.Label)
    labelTargetScore: cc.Label = null;

    @property(cc.Label)
    labelHistory: cc.Label = null;

    @property(cc.Label)
    labelScore: cc.Label = null;

    @property(cc.Label)
    labelScoreAdd: cc.Label = null;

    @property(cc.Node)
    passNode: cc.Node = null;

    @property(cc.Prefab)
    pausePrefab: cc.Prefab = null;

    @property(cc.Node)
    chapterPass: cc.Node = null;

    sx: number = 1;
    sy: number = 1;

    onLoad (){
        this.passNode.active = false;
        this.labelScoreAdd.node.opacity = 0;
        cc.director.on("chapter-start", this.gotoNextChapter, this);
        cc.director.on("score-refresh", this.scoreRefresh, this);
        cc.director.on("chapter-pass", this.pass, this);
        this.startGame();
        if(cc.sys.isBrowser){

        } else {
            this.getWindowProperty();
        }
    }

    private getWindowProperty ():void{
        let visibleSize: cc.Size;
        if(cc.sys.platform === cc.sys.ANDROID){
            visibleSize = cc.view.getFrameSize();
        } else if(cc.sys.platform === cc.sys.IPHONE){
            visibleSize = cc.view.getFrameSize();
        } else if(cc.sys.platform === cc.sys.WECHAT_GAME){
            visibleSize = cc.view.getCanvasSize();
        } else if(cc.sys.isBrowser){
            visibleSize = cc.view.getCanvasSize();
        } else {
            visibleSize = cc.view.getVisibleSize();
        }
        let designSize: cc.Size = cc.view.getDesignResolutionSize();
        let p1: number = designSize.width / designSize.height;
        let p2: number = visibleSize.width / visibleSize.height;
        cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.SHOW_ALL);
        //真实运行环境比较宽
        if(p1 < p2){
            this.sx = visibleSize.width / (visibleSize.height / designSize.height * designSize.width);
        } else {
            this.sy = visibleSize.height / (visibleSize.width / designSize.width * designSize.height);
        }
        this.node.scaleX = this.sx;
        this.node.scaleY = this.sy;
    }

    onDestroy (){
        cc.director.off("chapter-start", this.startGame, this);
        cc.director.off("score-refresh", this.scoreRefresh, this);
        cc.director.off("chapter-pass", this.pass, this);
    }

    //到下一关的动画
    private gotoNextChapter(): void{
        //是否过关
        let b: boolean = GameData.getInstance().isChapterPass();
        if( !b ){
            this.chapterPass.getComponent("ChapterPass").showOver(() => {
                GameData.getInstance().isNewGame = true;
                this.gameover();
            });
            return;
        }
        //游戏数据进入下一关
        GameData.getInstance().chapterEnd();
        let chapter: number = GameData.getInstance().chapter;
        let score: number = GameData.getInstance().getTargetScore();
        this.chapterPass.getComponent("ChapterPass").showPass(chapter, score, () => {
            GameData.getInstance().isNewGame = true;
            this.startGame();
        });
    }

    //游戏结束
    private gameover(): void{
        GameData.getInstance().reset(true);
        cc.director.loadScene("welcome");
    }

    //过关
    private pass(): void{
        this.passNode.active = true;
        this.passNode.setPosition(0, 0);
        let ac: cc.FiniteTimeAction = cc.moveTo(1, cc.v2(156, 229));
        this.passNode.runAction(ac);
    }
    
    //分数变化
    private scoreRefresh(scoreAdd: number = 0): void{
        this.labelChapter.string = GameData.getInstance().chapter.toString();
        this.labelScore.string = GameData.getInstance().score.toString();
        this.labelTargetScore.string = GameData.getInstance().getTargetScore().toString();
        this.labelHistory.string = GameData.getInstance().getHistoryChapter(GameData.getInstance().chapter).toString();
        if( scoreAdd > 0 ){
            this.labelScoreAdd.string = scoreAdd.toString();
            this.labelScoreAdd.node.opacity = 255;
            this.labelScoreAdd.node.stopAllActions();
            let ac: cc.FiniteTimeAction = cc.fadeOut(2).easing(cc.easeBounceIn());
            this.labelScoreAdd.node.runAction(ac);
        }
    }

    private startGame(): void{
        this.passNode.active = false;
        this.scoreRefresh();
        this.layerStar.getComponent('StarController').initStar();
    }

    private checkPass(): void{
        if(GameData.getInstance().score >= GameData.getInstance().getTargetScore()){
            this.pass();
        }
    }

    onPause (): void {
        cc.log('onPause');
        // GameData.getInstance().removeStorageData();
        let pauseNode: cc.Node = cc.instantiate(this.pausePrefab);
        pauseNode.parent = this.node;
        pauseNode.zIndex = 200;
    }



}
