// bible.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BibleService {

  private bibleJsonUrl = '../../assets/jsons/pt_aa.json'; // caminho do seu arquivo JSON

  constructor(private http: HttpClient) {}

  getBible(): Observable<any> {
    return this.http.get(this.bibleJsonUrl);
  }
}
