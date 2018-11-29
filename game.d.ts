//全局自定义声明文件
declare interface IUser {
    name: string;
    vip: number;
}

declare enum StarType {
    Red,
    Yellow,
    Blue,
    Green,
    Pur
}

declare interface GameData {
    print: function;
}
