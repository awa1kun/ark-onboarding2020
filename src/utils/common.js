export const hand2number = (hand) => {
    if(hand == "r"){
        return 0
    }
    else if (hand == "p"){
        return 1
    }
    else if (hand == "s"){
        return 2
    }
    else{
        throw new Error(`invalid hand paramater : ${hand}`);
    }
}