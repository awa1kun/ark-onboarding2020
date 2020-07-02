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

export const status2number = (status) => {
    if(status == "close"){
        return 2
    }
    else if(status == "progress"){
        return 1
    }
    else if(status == "open"){
        return 0
    }
    else{
        return -1
    }
}

export const mod = (i, j) =>{
    return (i % j) < 0 ? (i % j) + 0 + (j < 0 ? -j : j) : (i % j + 0);
}