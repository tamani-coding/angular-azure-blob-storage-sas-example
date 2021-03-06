import { ErrorHandler, Injectable } from '@angular/core';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

@Injectable({
  providedIn: 'root'
})
export class AzureBlobStorageService {

  // Enter your storage account name
  account = "<>";
  // SAS (shared access signatures)
  picturesSas = "<>";
  videosSas = "<>";

  picturesContainer = "pictures";
  videosContainer = "videos";
  picturesContainerClient: ContainerClient;
  videosContainerClient: ContainerClient;

  constructor() {
    this.picturesContainerClient = new BlobServiceClient(`https://${this.account}.blob.core.windows.net?${this.picturesSas}`)
      .getContainerClient(this.picturesContainer);
    this.videosContainerClient = new BlobServiceClient(`https://${this.account}.blob.core.windows.net?${this.videosSas}`)
      .getContainerClient(this.videosContainer);
  }

  // +IMAGES
  public uploadImage(content: Blob, name: string, handler: () => void) {
    this.uploadBlob(content, name, this.picturesContainerClient, handler)
  }

  public listImages(): Promise<string[]> {
    return this.listBlobs(this.picturesContainerClient)
  }

  public downloadImage(name: string, handler: (blob: Blob) => void) {
    this.downloadBlob(name, this.picturesContainerClient, handler)
  }

  public deleteImage(name: string, handler: () => void) {
    this.deleteBlob(name, this.picturesContainerClient, handler)
  }
  // -IMAGES

  // +VIDEOS
  public uploadVideo(content: Blob, name: string, handler: () => void) {
    this.uploadBlob(content, name, this.videosContainerClient, handler)
  }

  public listVideos(): Promise<string[]> {
    return this.listBlobs(this.videosContainerClient)
  }

  public downloadVideo(name: string, handler: (blob: Blob) => void) {
    this.downloadBlob(name, this.videosContainerClient, handler)
  }

  public deleteVideo(name: string, handler: () => void) {
    this.deleteBlob(name, this.videosContainerClient, handler)
  }
  // -VIDEOS

  private uploadBlob(content: Blob, name: string, client: ContainerClient, handler: () => void) {
    let blockBlobClient = client.getBlockBlobClient(name);
    blockBlobClient.uploadData(content, { blobHTTPHeaders: { blobContentType: content.type } })
      .then(() => handler())
  }

  private async listBlobs(client: ContainerClient): Promise<string[]> {
    let result: string[] = []

    let blobs = client.listBlobsFlat();
    for await (const blob of blobs) {
      result.push(blob.name)
    }

    return result;
  }

  private downloadBlob(name: string, client: ContainerClient, handler: (blob: Blob) => void) {
    const blobClient = client.getBlobClient(name);
    blobClient.download().then(resp => {
      resp.blobBody.then(blob => {
        handler(blob)
      })
    })
  }

  private deleteBlob(name: string, client: ContainerClient, handler: () => void) {
    client.deleteBlob(name).then(() => {
      handler()
    })
  }
}
