export enum Suites {
    HEART='H',
    SPADE='S',
    CLUBS='C',
    DIAMOND='D',
}

export type cardValues = 2|3|4|5|6|7|8|9|10|11|12|13|14
export const standardCards: cardValues[] = [2,3,4,5,6,7,8,9,10,11,12,13,14]

export const nToCard = new Map([
    [2 ,'2'],
    [3, '3'],
    [4 ,'4'],
    [5, '5'],
    [6 ,'6'],
    [7, '7'],
    [8 ,'8'],
    [9, '9'],
    [10 ,'10'],
    [11, 'J'],
    [12, 'Q'],
    [13, 'K'],
    [14, 'A'],
]);

export type CardType = {
    value: cardValues;
    suite: Suites;
}

export type Deck = {
    cards: Array<CardType>
}