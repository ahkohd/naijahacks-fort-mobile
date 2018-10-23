import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';


/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private themeableBrowser: ThemeableBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

  openLink(link)
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
  
    const browser: ThemeableBrowserObject = (new ThemeableBrowser()).create(link, '_blank', options);
    browser.on('closePressed').subscribe(data => {
      browser.close();
    });
  }
}
