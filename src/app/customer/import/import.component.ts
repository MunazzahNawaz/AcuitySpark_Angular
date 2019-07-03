import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StoreService } from '../services/store.service';
import * as Dropzone from 'dropzone/dist/dropzone';
import { Router } from '@angular/router';
declare var toastr;

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  customerFile;
  error;
  fileName;
  baseUploadUrl = 'testUrl';
  constructor(public storeService: StoreService, private router: Router) {}

  ngOnInit() {}
  onFileUpload(event, fileInput) {
    this.error = '';
    console.log(event);
    console.log(fileInput.value);
    this.fileName = fileInput.value.replace('C:\\fakepath\\', '');
    (document.getElementById(
      'uploadFile'
    ) as HTMLInputElement).value = this.fileName;
    this.customerFile = this.fileInput.nativeElement.files[0];
    console.log(this.customerFile);
    // const csvFileDropZone = Dropzone.forElement('#csvFileDropZone');
    // console.log('csvFileDropZone', csvFileDropZone);
    // csvFileDropZone.removeFile(fileInput.value);

    Dropzone.forElement('#csvFileDropZone').removeAllFiles(true);
  }
  isCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }
  uploadFile() {
    if(this.customerFile)
    {
        this.error = '';
        if (!this.isCSVFile(this.customerFile)) {
        toastr.info('select valid CSV file');
        return;
      }
      // TODO: call upload service to upload file on server and show loader. Then route to next screen
      this.storeService.setCustomerFile(this.customerFile);
      //   this.getHeaderArray();
      this.router.navigateByUrl('/customer/map');
    }
    else
    {
      this.error = 'Upload file';
    }
    
  }

  getFileName(url) {
    if (url) {
      const filename = url.split('\\').pop();
      return filename;
    }
    return '';
  }
  onFileAdd(event) {
   // console.log('on file added', event.file);
    this.fileName = event.file.name;
    this.customerFile = event.file;
  //  console.log('file frm dropzone', Dropzone.forElement('#csvFileDropZone').files[0]);
  //  this.storeService.setCustomerFile(Dropzone.forElement('#csvFileDropZone').files[0]);
    localStorage.setItem('File', event.file);
    (document.getElementById(
      'uploadFile'
    ) as HTMLInputElement).value = this.fileName;
  }
  onSuccess(event) {
    console.log('success');
    console.log(event);
  }
  isValidFile() {
    try {
      const csvFileDropZone = Dropzone.forElement('#csvFileDropZone');
      if (csvFileDropZone) {
        if (
          !(
            csvFileDropZone.getAcceptedFiles().length &&
            csvFileDropZone.getAcceptedFiles().length > 0
          )
        ) {
          return false;
        }
      }
      return true;
    } catch (ex) {
      return true;
    }
  }
  onError(event) {
    console.log('error');
    console.log(event);
  }
  onComplete(event) {
    console.log('complete');
    console.log(event);
  }
}
