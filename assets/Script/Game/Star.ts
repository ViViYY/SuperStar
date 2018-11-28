import { Define } from './../Util/Define';



const {ccclass, property} = cc._decorator;

@ccclass
export class Star extends cc.Component {

    @property([cc.SpriteFrame])
    spriteList : cc.SpriteFrame[] = [];

    @property(cc.Integer)
    _type : number = 0;

    @property(cc.Integer)
    _x : number = 0;

    @property
    _y : number = 0;

    @property(cc.Sprite)
    selectPic: cc.Sprite = null;

    onLoad () {
        
    }

    public init (type : number, x : number,  y : number): void {
        this._type = type;
        this._x = x;
        this._y = y;
        this.node.getComponent(cc.Sprite).spriteFrame = this.spriteList[this._type];
        this.refreshPosition();
    }

    private refreshPosition (): void {
        this.node.setPosition(Define.StarWidth * this._x, Define.StarHeight * this._y);
    }

    private onClick (): void {
        cc.log('star click:' + this._type + ' x:' + this._x + ' y:' + this._y);
        this.beSelect();
    }

    public beSelect (): void {
        this.selectPic.node.active = true;
    }

    public unSelect (): void {
        this.selectPic.node.active = false;
    }

}
