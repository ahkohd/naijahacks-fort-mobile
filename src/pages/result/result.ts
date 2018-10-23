import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';

/**
 * Generated class for the ResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {

  imgURL: any;
  plantName: string;
  wikiResult: any[];
  fetching: boolean = true;


  constructor(public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider, private themeableBrowser: ThemeableBrowser) {
    this.imgURL = this.navParams.get("base64");
    this.plantName = this.navParams.get("plantName");
    

    this.api.fetchWiki(this.plantName).subscribe(data=>
      {
        this.fetching = false;
        this.wikiResult = (<any>data).query.search;
        console.log(this.wikiResult);
      },
      err => {
        console.log(err);
        this.fetching = false;
      });
  }


  tryAgain()
  {
    this.fetching = true;
    this.api.fetchWiki(this.plantName).subscribe(data=>
      {
        this.fetching = false;
        console.log(data);
      },
      err => {
        console.log(err);
        this.fetching = false;
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultPage');
  }

  share()
  {
    console.log("share");
  }


    openInAppBrowser(pageid)
    {
      const options: ThemeableBrowserOptions = {
        toolbar: {
          height: 55,
          color: '#219653'
        },
        title: {
          color: '#ffffffff',
          showPageTitle: true,
        },
        closeButton: {
          wwwImage: 'assets/imgs/close-button.png',
          align: 'left',
          event: 'closePressed'
        }
  
      };
    
      const browser: ThemeableBrowserObject = (new ThemeableBrowser()).create('https://en.wikipedia.org/?curid='+pageid, '_blank', options);
      browser.on('closePressed').subscribe(data => {
        browser.close();
      });
    
    }

}
