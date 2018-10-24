import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { AlertController, LoadingController } from 'ionic-angular';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions} from '@ionic-native/camera-preview';
import { AboutPage } from '../about/about';
import { ResultPage } from '../result/result';
import { ApiProvider } from '../../providers/api/api';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public imgURL: any;
  public maxZoom: any = 10;
  public zoom: any = 0;

  constructor(public navCtrl: NavController, private imagePicker: ImagePicker, private alertCtrl: AlertController, private cameraPreview: CameraPreview, public loadingCtrl: LoadingController,  private api: ApiProvider) { }

 
  ionViewWillEnter()
  {
    console.log(window.screen.width, window.screen.height);

      // camera options (Size and location). In the following example, the preview uses the rear camera and display the preview in the back of the webview
      const cameraPreviewOpts: CameraPreviewOptions = {
        x: 0,
        y: 0,
        width: window.screen.width,
        height: window.screen.height,
        camera: 'rear',
        tapPhoto: true,
        previewDrag: false,
        toBack: true,
        tapToFocus: true
      };

      // start camera
      this.cameraPreview.startCamera(cameraPreviewOpts).then(
        (res) => {
          console.log(res)
        },
        (err) => {
          console.log(err)
        });

          // get maxZoom
          this.cameraPreview.getMaxZoom().then((res)=>this.maxZoom = res, (err)=>this.maxZoom = 10);
          //get current zoom
          this.cameraPreview.getZoom().then((res)=>this.zoom = res, (err)=>this.zoom = 0);

       
       
  }

  ionViewWillLeave ()
  {
    this.cameraPreview.stopCamera();
    this.imgURL = "";
    this.zoom = 0;
  }
        

  captureImage()
  {
          // picture options
      const pictureOpts: CameraPreviewPictureOptions = {
        width: 1280,
        height: 1280,
        quality: 85
      }

      // take a picture
      this.cameraPreview.takePicture(pictureOpts).then((imageData) => {
        this.imgURL = 'data:image/jpeg;base64,' + imageData;
       // this.cameraPreview.hide();
        this.presentCaptureConfirm();
      }, (err) => {
        console.log(err);
      });

  }

  reverseCam()
  {
      // Switch camera
      this.cameraPreview.switchCamera();
  }

  pickImage()
  {
    const options = {
      maximumImagesCount: 1,
      outputType: 1
    }
    this.imagePicker.getPictures(options).then((results) => {
      
      if(results[0] != null)
      {
        this.imgURL = 'data:image/jpeg;base64,' + results[0];
        this.presentCaptureConfirm();
      }
    

    }, (err) => { 
      // this.cameraPreview.show();
    });
  }


   cameraFocus(e)
   {
     //tab to focus x,y
    //  console.log(e.center.x, e.center.y);
     this.cameraPreview.tapToFocus(e.center.x, e.center.y);

   }

   zoomChange(e)
   {
     console.log(e);
     this.cameraPreview.setZoom(this.zoom);
   }

  presentCaptureConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Retake Picture',
      message: 'Do you want to retake plant picture?',
      buttons: [
        {
          text: 'Retake',
          role: 'cancel',
          handler: () => {
            // retake photo, show the preview
            // this.cameraPreview.show();
            this.imgURL = undefined;

          }
        },
        {
          text: 'Use',
          handler: () => {
            // this.cameraPreview.stopCamera();
             // do image processing logics
             console.log('Process image');
             this.presentLoadingDefault();
          }
        }
      ]
    });
    alert.present();
  }

  presentAlert(msg, type) {
    let alert = this.alertCtrl.create({
      title: type,
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }

    presentLoadingDefault() {
      let loading = this.loadingCtrl.create({
        content: 'Processing...'
      });
    
      loading.present();
      
      this.api.postImage(this.imgURL).subscribe(
        data => {

          if((<any>data).error!=0)
          {
            
            // ai unable to process image.
            loading.dismiss();
            // this.cameraPreview.show();
            this.presentAlert("Unable to recognize Image. Try Another Picture", "Error");
            this.imgURL = undefined;
            
          } else
          {
            // image  gotten. Awesome move to the next page
            loading.dismiss();
            this.cameraPreview.stopCamera();
            this.navCtrl.push(ResultPage, {
              base64: this.imgURL,
              plantName: (<any>data).data
            });
          }
        },
        err => {
            // show error message of unable to connect
            loading.dismiss();
            // this.cameraPreview.show();
            this.imgURL = undefined;
            this.presentAlert("Unable to connect to server. Try Again!", "Error");
        });


      
    }

    aboutPage()
    {
      this.navCtrl.push(AboutPage);
      // this.navCtrl.push(ResultPage);

    }

    

}
