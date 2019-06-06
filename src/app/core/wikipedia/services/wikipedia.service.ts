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
   * Retrieves wikipedia extract of a given word
   * @param word word
   * @param language language
   * @param abstractEmitter abstract emitter
   */
  getExtract(word: string, language: string, abstractEmitter: EventEmitter<{pageURL: string, extract: string}>) {

    if (ConnectionService.isOnline()) {
      if (word != null && abstractEmitter != null) {
        const options = {
          method: 'POST',
          headers: {'Content-type': 'application/json'},
          json: true,
        };

        const title = word.trim().replace(' ', '%20');
        const pageURL = `https://` + language + `.wikipedia.org/wiki/` + title;
        const queryURL = `https://` + language + `.wikipedia.org/w/api.php` +
          `?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&origin=*` +
          `&titles=` + title;
        const observable =
          this.http.post(queryURL, [], options);
        observable.subscribe(value => {
          const query = value['query'];
          const pages = query != null ? query['pages'] : null;
          const pageKeys = pages != null ? Object.keys(pages) : pages;
          const firstPageKey = pageKeys != null ? pageKeys[0] : null;
          const firstPage = firstPageKey != null ? pages[firstPageKey] : null;
          const extract = firstPage != null ? firstPage['extract'] : null;

          abstractEmitter.emit({pageURL, extract});
        });
      }
    } else {
      console.error('Client is offline');
      abstractEmitter.emit(null);
    }
  }
}
