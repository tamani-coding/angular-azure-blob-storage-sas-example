import { AzureBlobStorageService } from './azure-blob-storage.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'azure-blob-storage';

  picturesList: string[] = [];
  picturesDownloaded: string[] = []

  videosList: string[] = [];
  videoDownloaded;

  constructor(private blobService: AzureBlobStorageService) {

  }

  ngOnInit(): void {
    this.reloadImages()
    this.reloadVideos()
  }

  public imageSelected(file: File) {
    this.blobService.uploadImage(file, file.name, () => {
      this.reloadImages()
    })
  }

  public videoSelected(file: File) {
    this.blobService.uploadVideo(file, file.name, () => {
      this.reloadVideos()
    })
  }

  public deleteImage (name: string) {
    this.blobService.deleteImage(name, () => {
      this.reloadImages()
    })
  }

  public deleteVideo (name: string) {
    this.blobService.deleteVideo(name, () => {
      this.reloadVideos()
    })
  }

  private reloadImages() {
    this.blobService.listImages().then(list => {
      this.picturesList = list
      const array = []
      this.picturesDownloaded = array

      for (let name of this.picturesList) {
        this.blobService.downloadImage(name, blob => {
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            array.push(reader.result as string)
          }
        })
      }
    })
  }

  private reloadVideos() {
    this.blobService.listVideos().then(list => {
      this.videosList = list
    })
  }
}
