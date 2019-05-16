import {Injectable} from '@angular/core';
import {Card} from '../../entity/model/card/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardsMockService {

  public CARDS: Card[] = [
    new Card('Vegan', ['Essen', 'Ernährung', 'Fleisch', 'Vegetarisch', 'Milch'], 1),
    new Card('Vegetarisch', ['Fleisch', 'Essen', 'Vegan', 'Ernährung', 'Tiere'], 1)
  ];

  constructor() {
  }
}
