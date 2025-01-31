export function makeRandomRegText(){
    let reg = null;
    //const rand = Math.floor(Math.random() * 3);
    const rand = 0;
    switch(rand){
        case 0:
            reg = "^a.{n}a$";
            break;
        case 1:
            reg = "^a.a.{n}a$";
            break;
        case 2:
            reg ="^a.{n}a.a$";
            break;
        default:
    }
    return reg;
}

export function makeHiraganaList(){
    const hiraganaString = 
        'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん' +
        'がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ' +
        'ー';
    let hiraganalist = [];
    for(let i = 0; i < 6; i++){
        const rand = Math.floor(Math.random()*hiraganaString.length);
        hiraganalist.push(hiraganaString[rand]);
    }
    return hiraganalist;
}

export function makeNumberList(){
    const number = ['1', '2', '3', '4', '5', '6'];
    return number;
}