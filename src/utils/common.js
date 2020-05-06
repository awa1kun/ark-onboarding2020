export const hand2number = (hand) => {
    if(hand == "r"){
        return 0
    }
    else if (hand == "s"){
        return 1
    }
    else if (hand == "p"){
        return 2
    }
    else{
        throw new Error(`invalid hand paramater : ${hand}`);
    }
}

export const number2hand = (number) => {
    if(number == 0){
        return "r";
    }
    else if (number == 1){
        return "s";
    }
    else{
        return "p";
    }
}