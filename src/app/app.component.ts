import { AzureBlobStorageService } from './azure-blob-storage.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'azure-blob-storage';

  // SAS (shared access signatures)
  sas = "<>";

  picturesList: string[] = [];
  picturesDownloaded: string[] = []

  videosList: string[] = [];
  videoDownloaded;

  constructor(private blobService: AzureBlobStorageService) {

  }

  ngOnInit(): void {
    this.reloadImages()
  }

  public imageSelected(file: File) {
    this.blobService.uploadImage(this.sas, file, file.name, () => {
      this.reloadImages()
    })
  }

  public deleteImage (name: string) {
    this.blobService.deleteImage(this.sas, name, () => {
      this.reloadImages()
    })
  }

  public downloadImage (name: string) {
    this.blobService.downloadImage(this.sas, name, blob => {
      let url = window.URL.createObjectURL(blob);
      window.open(url);
    })
  }

  private reloadImages() {
    this.blobService.listImages(this.sas).then(list => {
      this.picturesList = list
      const array = []
      this.picturesDownloaded = array

      for (let name of this.picturesList) {
        this.blobService.downloadImage(this.sas, name, blob => {
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            array.push(reader.result as string)
          }
        })
      }
    })
  }
}
