function makeRandomRegText(){
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

export default makeRandomRegText;