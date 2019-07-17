import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewContainerRef
} from '@angular/core';
import { StoreService } from '../services/store.service';
import * as Dropzone from 'dropzone/dist/dropzone';
import { Router } from '@angular/router';
import { UploadService } from '../services/upload.service';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { HeaderService } from 'src/app/layout/services/header.service';
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
  success = false;
  progress;
  uploadResponse = { status: '', message: 0, filePath: '' };
  constructor(
    public storeService: StoreService,
    private router: Router,
    private uploadService: UploadService,
    protected headerService: HeaderService
  ) {}

  ngOnInit() {
    this.headerService.setTitle('Import Your Data');
  }
  onFileUpload(event, fileInput) {
    this.error = '';
    console.log(event);
    console.log(fileInput.value);
    this.fileName = fileInput.value.replace('C:\\fakepath\\', '');
    // (document.getElementById(
    //   'uploadFile'
    // ) as HTMLInputElement).value = this.fileName;
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
    if (this.customerFile) {
      this.error = '';
      if (!this.isCSVFile(this.customerFile)) {
        toastr.info('select valid CSV file');
        return;
      }
      // this.uploadService.uploadDoc(this.customerFile).subscribe(res => {
      //   console.log(res);
      //   this.storeService.setCurrentFileUrl(res);
      // });

      this.uploadService.uploadDoc(this.customerFile).subscribe(
        res => {
          console.log('response', res);
          this.uploadResponse = res;
          if (this.uploadResponse.status == 'progress') {
            this.progress = this.uploadResponse.message;
          }
          this.storeService.setCurrentFileUrl(res);
          this.storeService.setCustomerFile(this.customerFile);
          this.success = true;
        },
        err => {
          console.log('in error', err);
          this.error = err;
          this.success = false;
          this.uploadResponse = { status: 'error', message: 100, filePath: '' };
        }
      );
      //   this.getHeaderArray();
      // this.router.navigateByUrl('/customer/map');
    } else {
      this.error = 'Upload file';
    }
  }
  nextClick() {
    this.router.navigateByUrl('/customer/map');
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
    localStorage.setItem('File', event.file);
    localStorage.setItem('FileName', this.fileName);
    this.uploadFile();
  }
  onRemoveFile(event) {
    this.success = false;
    this.customerFile = undefined;
    this.fileName = undefined;
    this.uploadResponse = { status: '', message: 0, filePath: '' };
  }
  onCancelFile() {
    Dropzone.forElement('#csvFileDropZone').removeAllFiles(true);
    this.onRemoveFile(null);
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
