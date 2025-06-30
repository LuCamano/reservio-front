import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OpenStreetMapService {

  private nominatimUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) { }

  getCoordinates(query: string): Observable<any> {
    return this.http.get<any[]>(this.nominatimUrl, {
      params: {
        q: query,
        format: 'json',
        limit: '1'
      }
    }).pipe(
      map(results => {
        if (results && results.length > 0) {
          return {
            lat: parseFloat(results[0].lat),
            lng: parseFloat(results[0].lon),
            address: results[0].display_name
          };
        }
        return null;
      })
    );
  }
}
