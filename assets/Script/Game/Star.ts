import { Define } from './../Util/Define';



const {ccclass, property} = cc._decorator;

@ccclass
export class Star extends cc.Component {

    @property(cc.Prefab)
    particlePrefab: cc.Prefab = null;

    @property([cc.SpriteFrame])
    spriteList : cc.SpriteFrame[] = [];

    @property({
        type:Define.StarType
    })
    _type = Define.StarType.Red;

    public get type() : number {
        return this._type;
    }
    public set type(v : number) {
        this._type = v;
    }

    @property(cc.Integer)
    _x : number = 0;
    public get x() : number {
        return this._x;
    }
    public set x(v : number) {
        this._x = v;
    }

    @property
    _y : number = 0;
    public get y() : number {
        return this._y;
    }
    public set y(v : number) {
        this._y = v;
    }
    @property(cc.Sprite)
    selectPic: cc.Sprite = null;

    _moveLeftCount: number = 0;

    onLoad () {

    }

    onDestroy () {
        // cc.log(' Star clean ' + this.type + ' x:' + this.x + ' y:' + this.y);
        this.spriteList.length = 0;
        this.type = 0;
        this.x = 0;
        this.y = 0;
    }

    public init (type: StarType, x: number,  y: number, dy: number): void {
        this.type = type;
        this.x = x;
        this.y = y;
        this.node.getComponent(cc.Sprite).spriteFrame = this.spriteList[this.type];
        this.refreshPosition(0, dy);
        this.move();
    }

    private refreshPosition (dx: number = 0, dy: number = 0): void {
        this.node.setPosition(Define.StarWidth * this.x + dx, Define.StarHeight * this.y + dy);
    }

    public beSelect (): void {
        if(!this.selectPic.node.active){
            this.selectPic.node.active = true;
        }
    }

    public unSelect (): void {
        if(this.selectPic.node.active){
            this.selectPic.node.active = false;
        }
    }

    public clean (): void {
        this.showParticleEffect();
        this.node.destroy();
    }

    public print (): void{
        let str: string = '';
        switch (this.type) {
            case Define.StarType.Red:
                str = '红';
                break;
            case Define.StarType.Yellow:
                str = '黄';
                break;
            case Define.StarType.Blue:
                str = '蓝';
                break;
            case Define.StarType.Green:
                str = '绿';
                break;
            case Define.StarType.Pur:
                str = '紫';
                break;
            default:
                break;
        }
        cc.log(str);
    }

    private move (): void {
        const location = this.node.getPosition();
        const target = cc.v2(Define.StarWidth * this.x, Define.StarHeight * this.y);
        //down
        const disDown = Math.abs(location.y - target.y);
        const timeCostDown = disDown / Define.StarMoveSpeed;
        let acDown: cc.FiniteTimeAction = cc.moveTo(timeCostDown, cc.v2(location.x, target.y));
        //left
        const disLeft = Math.abs(location.x - target.x);
        const timeCostLeft = disLeft / Define.StarMoveSpeed;
        let acLeft: cc.FiniteTimeAction = cc.moveTo(timeCostLeft, cc.v2(target.x, target.y));
        //seq
        const seq = cc.sequence(acDown, acLeft, cc.callFunc(function () {
            
        }));
        this.node.runAction(seq);
    }

    public moveDown (num: number):void {
        this.y -= num;
        const location = this.node.getPosition();
        const target = cc.v2(location.x, location.y - Define.StarHeight * num);
        //down
        const dis = Define.StarHeight * num;
        const timeCost = dis / Define.StarMoveSpeed;
        let ac: cc.FiniteTimeAction = cc.moveTo(timeCost, cc.v2(location.x, target.y));
        this.node.runAction(ac);
    }

    public resetMoveLeftCount (): void {
        this._moveLeftCount = 0;
    }

    public moveLeftCount (): void {
        this.x--;
        this._moveLeftCount++;
    }

    public moveLeft ():number {
        if(this._moveLeftCount <= 0){
            return;
        }
        const location = this.node.getPosition();
        const target = cc.v2(location.x - Define.StarWidth * this._moveLeftCount, location.y);
        //left
        const dis = Define.StarWidth * this._moveLeftCount;
        const timeCost = dis / Define.StarMoveSpeed;
        let ac: cc.FiniteTimeAction = cc.moveTo(timeCost, cc.v2(target.x, location.y));
        this.node.runAction(ac, );
        return this._moveLeftCount;
    }

    private showParticleEffect ():void {
        let parNode = cc.instantiate(this.particlePrefab);
        let ps: cc.ParticleSystem = parNode.getComponent(cc.ParticleSystem);
        ps.startColor = this.getColor();
        parNode.parent = this.node.parent;
        parNode.zIndex = 100;
        parNode.setPosition(this.node.getPosition().x + Define.StarWidth / 2 , this.node.getPosition().y + Define.StarHeight / 2);
    }

    private getColor(): cc.Color {
        switch(this.type){
        case Define.StarType.Pur:
            return cc.color(189, 77, 255, 255);
        case Define.StarType.Blue:
            return cc.color(84, 203, 254, 255);
        case Define.StarType.Red:
            return cc.color(253, 80, 126, 255);
        case Define.StarType.Yellow:
            return cc.color(253, 234, 84, 255);
        case Define.StarType.Green:
            return cc.color(132, 226, 111, 255);
        }
        return cc.color(255,255,255,255);
    }

    private getDistance(v1:cc.Vec2, v2:cc.Vec2):number {
        return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y));
    }
    
}
