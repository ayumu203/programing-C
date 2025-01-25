function makeRandomRegText(){
    const characters = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん".split("");
    const char1 = characters[Math.floor(Math.random() * characters.length)];
    const char2 = characters[Math.floor(Math.random() * characters.length)];
    const char3 = characters[Math.floor(Math.random() * characters.length)];
    const text = `^${char1}${char2}${char3}***&|$`
    return text;
}

export default makeRandomRegText;