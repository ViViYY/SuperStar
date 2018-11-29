//全局自定义文件
export module Define {

    //星星初始化时偏移高度
    export const StarInitMoveV: number = 25;

    export const StarWidth: number = 48;
    export const StarHeight: number = 48;

    export const StarNumberH: number = 10;
    export const StarNumberV: number = 10;

    export const StarMoveSpeed: number = 360;
    
    export const StarType = cc.Enum({
        Red: 0,
        Yellow: 1,
        Blue: 2,
        Green: 3,
        Pur: 4
    })

    export const GameState = cc.Enum({
        init: 0,
        wait: 1,
        moving: 2,
        over: 3,
    })

}