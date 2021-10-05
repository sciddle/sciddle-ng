import {HttpClient} from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import {delay, timeout} from 'rxjs/operators';
import {ConnectionService} from '../../util/services/connection.service';

/**
 * Handles requests against wikipedia API
 */
@Injectable({
  providedIn: 'root',
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
   * @param t timeout
   * @param d delay
   * @param abstractEmitter abstract emitter
   */
  public getExtract(word: string, language: string, t: number, d: number,
                    abstractEmitter: EventEmitter<{ pageURL?: string, extract: string }>) {

    if (abstractEmitter != null) {

      // Check if client is offline
      if (!ConnectionService.isOnline()) {
        abstractEmitter.emit({extract: 'Du bist offline.'});
      }

      // Check if passed word is null
      if (word === null) {
        abstractEmitter.emit({extract: 'Du bist offline.'});
      }

      // Define options
      const options = {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        json: true,
      };

      // Build query
      const title = word.trim().replace(' ', '%20');
      const pageURL = `https://` + language + `.wikipedia.org/wiki/` + title;
      const queryURL = `https://` + language + `.wikipedia.org/w/api.php` +
        `?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&origin=*` +
        `&titles=` + title;

      // Call post
      this.http.post(queryURL, [], options)
        .pipe(timeout(t), delay(d))
        .subscribe((data: any) => {
          const query = data.query;
          const pages = query != null ? query.pages : null;
          const pageKeys = pages != null ? Object.keys(pages) : pages;
          const firstPageKey = pageKeys != null ? pageKeys[0] : null;
          const firstPage = firstPageKey != null ? pages[firstPageKey] : null;
          const extract = firstPage != null ? firstPage.extract : null;

          abstractEmitter.emit({pageURL, extract});
        }, () => {
          abstractEmitter.emit({extract: 'Das Timeout wurde erreicht.'});
        });
    } else {
      console.error(`emitter is null`);
    }
  }
}
