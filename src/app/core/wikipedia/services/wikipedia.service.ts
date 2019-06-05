import {EventEmitter, Injectable} from '@angular/core';
import {ConnectionService} from '../../util/services/connection.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WikipediaService {

  /**
   * Constructor
   * @param http http client
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Retrieves wikipedia abstract of a given word
   * @param word word
   * @param abstractEmitter abstract emitter
   */
  getAbstract(word: string, abstractEmitter: EventEmitter<string>) {

    if (ConnectionService.isOnline()) {

      if (word != null && abstractEmitter != null) {
        const options = {
          method: 'POST',
          headers: {'Content-type': 'application/json'},
          json: true,
        };

        const ob =
          this.http.post(`https://de.wikipedia.org/w/api.php` +
            `?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&origin=*` +
            `&titles=${word.replace('', '%20')}`, [], options);
        ob.subscribe(value => {
          console.log(JSON.stringify(value));
          // abstractEmitter.emit(value[0]['translations'][0]['text']);
        });
      }
    } else {
      console.error('Client is offline');
      abstractEmitter.emit(null);
    }
  }
}
