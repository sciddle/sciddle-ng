import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import mockCards from '../../../../assets/cards/cards.json';
import {Card} from '../../entity/model/card/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardsMockService {

  /**
   * Returns mock cards
   */
  getMockCards(): Card[] {
    return mockCards;
  }
}
