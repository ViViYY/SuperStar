import { Star } from "./Star";
import { Define } from './../Util/Define';
import { GameData } from './../Util/GameData';

const {ccclass, property} = cc._decorator;

@ccclass
export class StarController extends cc.Component {

    @property(cc.Prefab)
    starPrefab: cc.Prefab = null;

    _gameState = Define.GameState.init;
    _starList: Star[][] = [];
    private starSelect: Star = null;
    _starSameLinkList: Star[] = [];

    onLoad () {
        this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }
    
    private onTouchStart(event: cc.Touch):void {
        if( this._gameState != Define.GameState.wait ){
            return;
        }
        this.starUnSelectAll();
        const xIndex = Math.floor(event.getLocation().x / Define.StarWidth);
        const yIndex = Math.floor(event.getLocation().y / Define.StarHeight);
        this.onStarTouchStart(xIndex, yIndex);
    }
    private onTouchEnd(event):void {
        if( this._gameState != Define.GameState.wait ){
            return;
        }
        //检测消除
        const xIndex = Math.floor(event.getLocation().x / Define.StarWidth);
        const yIndex = Math.floor(event.getLocation().y / Define.StarHeight);
        let starTouchEnd: Star = this._starList[xIndex][yIndex];
        if(starTouchEnd && starTouchEnd === this.starSelect){
            this.eliminate();
            let eliminateCount = this._starSameLinkList.length;
            //是否过关
            let b1: boolean = GameData.getInstance().score >= GameData.getInstance().getTargetScore();
            let scoreAdd = 5 * eliminateCount * eliminateCount;
            GameData.getInstance().addScore(scoreAdd);
            cc.director.emit("score-refresh", scoreAdd);
            let b2: boolean = GameData.getInstance().score >= GameData.getInstance().getTargetScore();
            if(!b1 && b2){
                cc.director.emit("chapter-pass");
            }
        }
        starTouchEnd = null;
        //清除数据
        this.starSelect = null;
        this._starSameLinkList.length = 0;
        this.starUnSelectAll();
    }

    private onStarTouchStart(_x: number, _y: number):void {
        this.starSelect = this._starList[_x][_y];
        if(!this.starSelect){
            return;
        }
        this.starSelect.beSelect();
        this._starSameLinkList.length = 0;
        this._starSameLinkList.push(this.starSelect);
        //连接的同色方块高亮显示
        let count = 0;
        while(count != this._starSameLinkList.length){
            count = this._starSameLinkList.length;
            for(let m = 0; m < this._starSameLinkList.length; m++){
                    let starSameLink: Star = this._starSameLinkList[m];
                    for(let i: number = 0; i < Define.StarNumberV; i++){
                        for(let j: number = 0; j < Define.StarNumberH; j++){
                            let starTemp:Star = this._starList[i][j];
                            if(!starTemp){
                                continue;
                            }
                            //在同类数组中
                            if( this._starSameLinkList.indexOf(starTemp) > -1 ){
                                continue;
                            }
                            if(starSameLink.type != starTemp.type){
                                continue;
                            }
                            if((starSameLink.x === starTemp.x && Math.abs(starSameLink.y - starTemp.y) === 1) || (starSameLink.y === starTemp.y && Math.abs(starSameLink.x - starTemp.x) === 1)){
                                this._starSameLinkList.push(starTemp);
                            }
                        }
                    }
            }
        }
        for(let i: number = 0; i < this._starSameLinkList.length; i++){
            let starSameLink: Star = this._starSameLinkList[i];
            starSameLink.beSelect();
        }
    }
    //消除
    private eliminate(): void {
        if( this._starSameLinkList.length >= 2 ){
            for(let i: number = 0; i < this._starSameLinkList.length; i++){
                let starEiminate: Star = this._starSameLinkList[i];
                starEiminate.clean();
                this._starList[starEiminate.x][starEiminate.y] = null;
            }
            this.moveDownAndRefreshStarList();
        }
    }
    //移动(向下) && 刷新列表
    private moveDownAndRefreshStarList(): void {
        let elimateCount: number = 0;
        let maxMoveNumber = 0;
        for(let i = 0; i < Define.StarNumberV; i++){
            elimateCount = 0;
            for(let j = 0; j < Define.StarNumberH; j++){
                let star: Star = this._starList[i][j];
                if(star){
                    if(elimateCount > 0){
                        if( this._gameState != Define.GameState.moving ){
                            cc.log('开始移动-向下');
                            this._gameState = Define.GameState.moving;
                        }
                        if(elimateCount > maxMoveNumber){
                            maxMoveNumber = elimateCount;
                        }
                        star.moveDown(elimateCount); 
                        this._starList[i][j] = null;
                        this._starList[i][star.y] = star;
                    }
                } else {
                    elimateCount++;
                }
            }
        }
        if(maxMoveNumber > 0){
            const dis = Define.StarHeight * maxMoveNumber;
            const timeCost = dis / Define.StarMoveSpeed;
            setTimeout(() => {
                this.moveLeftAndRefreshStarList();
            }, timeCost * 1000 + 50);
        } else {
            this.moveLeftAndRefreshStarList();
        }
        
    }

    //移动(向左) && 刷新列表
    private moveLeftAndRefreshStarList(): void {
        cc.log('检测动-向左');
        // 遍历列
        for(let i = 0; i < Define.StarNumberH - 1; i++){
            let empty: boolean = true;
            for(let j = 0; j < Define.StarNumberV; j++){
                let star: Star = this._starList[i][j];
                if(star){
                    empty = false;
                    break;
                }
            }
            //该列空白,移动右边的星星
            if(empty){
                for(let m = i + 1; m < Define.StarNumberH; m++){
                    for(let n = 0; n < Define.StarNumberV; n++){
                        let starMove: Star = this._starList[m][n];
                        if(!starMove){
                            continue;
                        }
                        starMove.moveLeftCount();
                        this._starList[m][n] = null;
                        this._starList[starMove.x][n] = starMove;
                    }
                }
            }
        }
        // 开始左移
        let maxMoveNumber = 0;
        for(let i = 0; i < Define.StarNumberH; i++){
            for(let j = 0; j < Define.StarNumberV; j++){
                let star: Star = this._starList[i][j];
                if(!star){
                    continue;
                }
                let count = star.moveLeft();
                if( count > maxMoveNumber ) {
                    maxMoveNumber = count;
                }
            }
        }
        if( maxMoveNumber > 0 ){
            const dis = Define.StarWidth * maxMoveNumber;
            const timeCost = dis / Define.StarMoveSpeed;
            setTimeout(() => {
                for(let i = 0; i < Define.StarNumberH - 1; i++){
                    for(let j = 0; j < Define.StarNumberV; j++){
                        let star: Star = this._starList[i][j];
                        if(!star){
                            continue;
                        }
                        star.resetMoveLeftCount();
                    }
                }
                if(this.checkGameOver()){
                    this.gameOver();
                } else {
                    cc.log('可移动');
                    this._gameState = Define.GameState.wait;
                }
            }, timeCost * 1000 + 50);
        } else {
            if(this.checkGameOver()){
                this.gameOver();
            } else {
                cc.log('可移动');
                this._gameState = Define.GameState.wait;
            }
        }
        
    }

    //检测游戏是否结束
    private checkGameOver(): boolean {
        //保存数据
        GameData.getInstance().saveCurrentData(this.getStarPattern());
        for(let i: number = 0; i < Define.StarNumberV; i++){
            for(let j: number = 0; j < Define.StarNumberH; j++){
                let star: Star = this._starList[i][j];
                if(!star){
                    continue;
                }
                //上下左右
                let starUp = null;
                if(j + 1 < Define.StarNumberV){
                    starUp = this._starList[i][j + 1];
                }
                let starDown = null;
                if(j - 1 >= 0){
                    starDown = this._starList[i][j - 1];
                }
                let starLeft = null;
                if(i - 1 >= 0){
                    starLeft = this._starList[i - 1][j];
                }
                let starRight = null;
                if(i + 1 < Define.StarNumberH){
                    starRight = this._starList[i + 1][j];
                }
                if( (starUp && starUp.type === star.type) || (starDown && starDown.type === star.type) || (starLeft && starLeft.type === star.type) || (starRight && starRight.type === star.type) ){
                    return false;
                }
            }
        }
        return true;
    }

    //游戏结束
    private gameOver(): void {
        cc.log('gameOver');
        this._gameState = Define.GameState.over;
        this.checkAward();
    }

    //检测奖励
    private checkAward(): void{
        let num = 0;
        for(let i: number = 0; i < Define.StarNumberV; i++){
            for(let j: number = 0; j < Define.StarNumberH; j++){
                let star: Star = this._starList[i][j];
                if(star){
                    num++;
                }
            }
        }
        cc.log('检测奖励,剩余个数：' + num);
        if(num < 10 + 100){
            cc.log('额外奖励:' + num);
            setTimeout(() => {
                this.getAwardOne();
            }, 1000);
        } else {
            cc.log('没有奖励');
            setTimeout(() => {
                for(let i: number = 0; i < Define.StarNumberV; i++){
                    for(let j: number = 0; j < Define.StarNumberH; j++){
                        let star: Star = this._starList[i][j];
                        if(star){
                            star.clean();
                        }
                    }
                }
                setTimeout(() => {
                    this.gotoNext();
                }, 1000);
            }, 2000);
        }
    }

    //一个一个领取额外奖励
    private getAwardOne(): void{
        cc.log("getAwardOne");
        let b: boolean = false;
        for(let i: number = 0; i < Define.StarNumberV; i++){
            for(let j: number = 0; j < Define.StarNumberH; j++){
                let star: Star = this._starList[i][j];
                if(star){
                    star.clean();
                    this._starList[i][j] = null;
                    b = true;
                    break;
                }
            }
            if(b){
                break;
            }
        }
        if(b){
            setTimeout(() => {
                this.getAwardOne();
            }, 100);
        } else {
            this.gotoNext();
        }
    }

    //进去下一关
    private gotoNext(): void{
        GameData.getInstance().chapterEnd();
        cc.director.emit("chapter-start");
    }

    onDestroy () {
        cc.log(' StarController clean ');
    }

    private cleanStar (): void {
        cc.log(' StarController cleanStar ');
        for(let i: number = 0; i < Define.StarNumberV; i++){
            for(let j: number = 0; j < Define.StarNumberH; j++){
                let star: Star = this._starList[i][j];
                if(star){
                    star.clean();
                }
            }
        }
    }

    private starUnSelectAll (): void {
        for(let i: number = 0; i < Define.StarNumberV; i++){
            for(let j: number = 0; j < Define.StarNumberH; j++){
                let star: Star = this._starList[i][j];
                if(star){
                    star.unSelect();
                }
            }
        }
    }

    public initStar(): void {
        if( GameData.getInstance().isNewGame ){
            this.createStarsRandom();
        } else {
            //读取记录
            let starPattern = GameData.getInstance().starPattern;
            // starPattern = "3#4#1#3#4#2#3#2#-1#-1#1#2#-1#-1#-1#-1#-1#-1#-1#-1#1#1#-1#-1#-1#-1#-1#-1#-1#-1#4#-1#-1#-1#-1#-1#-1#-1#-1#-1#0#-1#-1#-1#-1#-1#-1#-1#-1#-1#1#-1#-1#-1#-1#-1#-1#-1#-1#-1#3#0#1#-1#-1#-1#-1#-1#-1#-1#2#3#4#2#3#-1#-1#-1#-1#-1#3#4#1#-1#-1#-1#-1#-1#-1#-1#-1#-1#-1#-1#-1#-1#-1#-1#-1#-1#";
            if(starPattern.length === 0){
                this.createStarsRandom();
            } else {
                // cc.log("starPattern = " + starPattern);
                let strsList: string[] = starPattern.split('#');
                // cc.log('strsList = ' + strsList.length);
                // cc.log('strsList = ' + strsList);
                for(let i: number = 0; i < Define.StarNumberV; i++){
                    this._starList[i] = [];
                }
                for(let i = 0; i < strsList.length; i++){
                    let t: number = parseInt(strsList[i]);
                    let xIndex: number = Math.floor(i / Define.StarNumberH);
                    let yIndex: number = i % Define.StarNumberH;
                    if(xIndex >= Define.StarNumberH){
                        break;
                    }
                    // cc.log('i = ' + i + 't = ' + t + ' - xIndex:' + xIndex + ' - yIndex:' + yIndex);
                    if(-1 === t){
                        this._starList[xIndex][yIndex] = null;
                    } else {
                        let starNode = cc.instantiate(this.starPrefab);
                        starNode.parent = this.node;
                        starNode.getComponent('Star').init(t, xIndex, yIndex, Define.StarInitMoveV);
                        this._starList[xIndex].push(starNode.getComponent('Star'));
                    }
                }
            }
        }
        
        const timeCost = Define.StarInitMoveV / Define.StarMoveSpeed;
        setTimeout(() => {
           this._gameState = Define.GameState.wait; 
        }, timeCost);
        // 检测结束
        if(this.checkGameOver()){
            this.gameOver();
        } else {
            cc.log('可移动');
            this._gameState = Define.GameState.wait;
        }
    }

    private createStarsRandom(): void{
        // 随机产生
        for(let i: number = 0; i < Define.StarNumberV; i++){
            this._starList[i] = [];
            for(let j: number = 0; j < Define.StarNumberH; j++){
                let starNode = cc.instantiate(this.starPrefab);
                starNode.parent = this.node;
                starNode.getComponent('Star').init(Math.floor(Math.random() * 5), i, j, Define.StarInitMoveV);
                this._starList[i].push(starNode.getComponent('Star'));
            }
        }
    }
    
    //组合星星数据
    private getStarPattern(): string{
        let pattern: string = "";
        for(let i: number = 0; i < Define.StarNumberV; i++){
            for(let j: number = 0; j < Define.StarNumberH; j++){
                let star: Star = this._starList[i][j];
                if(star){
                    pattern += star.type + "#";
                } else {
                    pattern += "-1#";
                }
            }
        }
        return pattern;
    }

}
