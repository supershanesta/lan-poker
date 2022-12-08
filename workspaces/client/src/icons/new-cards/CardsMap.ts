import { Cards } from '@memory-cards/shared/common/Cards';
import {
  Back,
  C2,
  C3,
  C4,
  C5,
  C6,
  C7,
  C8,
  C9,
  C10,
  C11,
  C12,
  C13,
  C14,
  D2,
  D3,
  D4,
  D5,
  D6,
  D7,
  D8,
  D9,
  D10,
  D11,
  D12,
  D13,
  D14,
  H2,
  H3,
  H4,
  H5,
  H6,
  H7,
  H8,
  H9,
  H10,
  H11,
  H12,
  H13,
  H14,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  S10,
  S11,
  S12,
  S13,
  S14,
  
} from '@icons/new-cards/index';
import { CardType } from '@memory-cards/shared/common/Deck';

export const CardsMap = (card: CardType) => {
  const cardValue = Cards[`${card.suite}${card.value}`];
  switch (cardValue) {
    case null:
      return Back;

    case Cards.C2:
      return C2;
    case Cards.C3:
      return C3;
    case Cards.C4:
      return C4;
    case Cards.C5:
      return C5;
    case Cards.C6:
      return C6;
    case Cards.C7:
      return C7;
    case Cards.C8:
      return C8;
    case Cards.C9:
      return C9;
    case Cards.C10:
      return C10;
    case Cards.C11:
      return C11;
    case Cards.C12:
      return C12;
    case Cards.C13:
      return C13;
    case Cards.C14:
      return C14;

    case Cards.D2:
      return D2;
    case Cards.D3:
      return D3;
    case Cards.D4:
      return D4;
    case Cards.D5:
      return D5;
    case Cards.D6:
      return D6;
    case Cards.D7:
      return D7;
    case Cards.D8:
      return D8;
    case Cards.D9:
      return D9;
    case Cards.D10:
      return D10;
    case Cards.D11:
      return D11;
    case Cards.D12:
      return D12;
    case Cards.D13:
      return D13;
    case Cards.D14:
      return D14;

    case Cards.H2:
      return H2;
    case Cards.H3:
      return H3;
    case Cards.H4:
      return H4;
    case Cards.H5:
      return H5;
    case Cards.H6:
      return H6;
    case Cards.H7:
      return H7;
    case Cards.H8:
      return H8;
    case Cards.H9:
      return H9;
    case Cards.H10:
      return H10;
    case Cards.H11:
      return H11;
    case Cards.H12:
      return H12;
    case Cards.H13:
      return H13;
    case Cards.H14:
      return H14;

    case Cards.S2:
      return S2;
    case Cards.S3:
      return S3;
    case Cards.S4:
      return S4;
    case Cards.S5:
      return S5;
    case Cards.S6:
      return S6;
    case Cards.S7:
      return S7;
    case Cards.S8:
      return S8;
    case Cards.S9:
      return S9;
    case Cards.S10:
      return S10;
    case Cards.S11:
      return S11;
    case Cards.S12:
      return S12;
    case Cards.S13:
      return S13;
    case Cards.S14:
      return S14;
    
  }
};