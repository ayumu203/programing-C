// getMatchingMazLengthWord()をimportして使ってください。
//
//import { getMatchingMaxLengthWord } from "./searchWords.js";

import { charIndex } from './charIndex.js';
import { dictionary } from './dictionary.js';

export function getMatchingMaxLengthWord(pattern){
    const list = getMatchingMaxLengthWords(pattern);
    const rand = Math.floor(Math.random() * list.length);
    return list[rand];
}
// 正規表現にマッチする単語のリストを返す関数
    function getMatchingMaxLengthWords(pattern) {
    const hiraganaPattern = /^[ぁ-んー]$/;
    let searchIndex = [0, 0, 0];
    for(let i = 0; i < pattern.length; i++){
        if(hiraganaPattern.test(pattern[i])){
            let index = charIndex[pattern[i]].index;
            let bit = charIndex[pattern[i]].bit;
            searchIndex[index] = searchIndex[index] | (1<<bit);
        }
    }
    
    const regex = new RegExp(pattern);
    const matches = [];
    let maxMatchLength = 0;
    for (const [key, index] of Object.entries(dictionary)) {
        if(testSerachIndex(index, searchIndex)){
            if (regex.test(key)) {
                if(maxMatchLength < key.length){
                    maxMatchLength = key.length;
                }
                matches.push(key);  // キー（単語）を格納
            }
        }
    }

    const maxLengthMatches = [];
    for(let i = 0; i < matches.length; i++){
        if(matches[i].length == maxMatchLength){
            maxLengthMatches.push(matches[i]);
        }
    }
    return maxLengthMatches;  // マッチした単語のリストを返す
}

function testSerachIndex(index, searchIndex){
    for(let i = 0; i < index.length; i++){
        if(searchIndex != (index & searchIndex)){
            return false;
        }
    }
    return true;
}