import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {


  // https://cors-anywhere.herokuapp.com/
  private rexApi: string = "https://naijahacks.appspot.com/predict";
  private googleApis: string = "https://translation.googleapis.com/language/translate/v2";
  // private lang = ["yo"];

  constructor(public http: HttpClient) {
    console.log('Hello ApiProvider Provider');
  }


  fetchWiki(query: string)
  {
    
    return this.http.get(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${query}`);
  }


  postImage(imgUrl)
  {
    return this.http.post(this.rexApi, { plant_image:  imgUrl});
  }

}
