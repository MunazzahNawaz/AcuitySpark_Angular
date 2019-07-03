import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import * as Dropzone from 'dropzone/dist/dropzone';

@Component({
  selector: 'dz-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, AfterViewInit {
  @Input() autoProcessQueue: boolean;
  @Input() maxFiles;
  @Input() element;
  @Input() noPreview;
  previewTemplate;
  @Input() fileCategory;
  @Input() acceptedFiles;

  @Input() element_Id;
  // @Input() thumbnail;
  @Input() fileUrl;
  @Input() title;
  @Input() isSmall;
  @Input() uploadUrl;
  // @Input() removeThumbnail;

  @Output() addedFile = new EventEmitter<any>();
  @Output() removedFile = new EventEmitter<any>();
  @Output() success = new EventEmitter<any>();
  @Output() error = new EventEmitter<any>();
  @Output() complete = new EventEmitter<any>();
  @Output() fileNotFound = new EventEmitter<any>();
  previewFile;
  // uploadUrl;
  private _dropzone: any;
  private currentFile;

  constructor() {
    // this.uploadUrl = Config.FILE_UPLOAD_ENDPOINT;
  }
  ngOnInit() {}
  ngAfterViewInit() {
    if (this.noPreview) {
      this.previewTemplate = "<div style='display:none'></div>";
    } else {
      this.previewTemplate = `<div class="dz-preview dz-file-preview">
      <div class="dz-details">
        <div class="dz-filename"><span data-dz-name></span></div>
        <div class="dz-size" data-dz-size></div>
        <img data-dz-thumbnail />
      </div>
    </div>`;

      // <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
      // <div class="dz-success-mark"><span>✔</span></div>
      // <div class="dz-error-mark"><span>✘</span></div>
      // <div class="dz-error-message"><span data-dz-errormessage></span></div>

      //   `<div class="dz-preview dz-file-preview">
      //   <div class="dz-image"><img data-dz-thumbnail alt="" ></div>
      //   <div class="dz-details">
      //     <div class="dz-filename"><span data-dz-name></span></div>
      //     <div class="dz-size" data-dz-size></div>
      //   </div>
      //   <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
      //   <div class="dz-success-mark"><svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><title>Check</title><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF" sketch:type="MSShapeGroup"></path></g></svg></div>
      //   <div class="dz-error-mark"><svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><title>Error</title><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="Check-+-Oval-2" sketch:type="MSLayerGroup" stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475"><path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" sketch:type="MSShapeGroup"></path></g></g></svg></div>
      //   <div class="dz-error-message"><span data-dz-errormessage></span></div>
      // </div>`;
    }

    //   if (this.autoProcessQueue == 'true') {
    Dropzone.autoDiscover = false;
    this._dropzone = new Dropzone(this.element, {
      url: this.uploadUrl,
      maxFiles: 1,
      maxFilesize: 5, // MB
      autoProcessQueue: this.autoProcessQueue,
      addRemoveLinks: true,
      paramName: 'file',
      acceptedFiles: this.acceptedFiles,
      previewTemplate: this.previewTemplate
    });
    // } else {
    //   this._dropzone = new Dropzone(this.element, {
    //     url: this.uploadUrl,
    //     maxFiles: this.maxFiles,
    //     maxFilesize: 5, // MB
    //     autoProcessQueue: false, // this.autoProcessQueue,
    //     addRemoveLinks: true,
    //     paramName: 'file',
    //     acceptedFiles: this.acceptedFiles,
    //     previewTemplate: this.previewTemplate
    //   });
    // }
    this._dropzone.on('addedfile', file => {
      console.log('fileAdded', file);
      this.currentFile = file;

      // const reader = new FileReader();
      // reader.readAsDataURL(file); // read file as data url

      // reader.onload = () => {
      //   // called once readAsDataURL is completed
      //   reader.readAsText = () => {
      //     this.fileUrl = reader.result;
      //   };
      // };
      // this.saveFileTemporarily();
      this.addedFile.emit({ file: file });
    });
    this._dropzone.on('removedfile', file => {
      this.removedFile.emit({ file: file });
    });
    this._dropzone.on('success', (file, responseType) => {
      console.log('success', file);
      this.success.emit({ file: file, responseType: responseType });
      // if (this.removeThumbnail) {
      //   this._dropzone.removeFile(file);
      // }
    });
    this._dropzone.on('error', (file, response) => {
      this.error.emit({ file: file, response: response });
    });
    this._dropzone.on('sending', (file, xhr, formData) => {
      console.log('sending', file);
      console.log('IN SENDING ....');
    });
    this._dropzone.on('complete', file => {
      this.complete.emit({ file: file });
    });
    this._dropzone.on('maxfilesexceeded', file => {
      this._dropzone.removeFile(file);
    });

    this._dropzone.autoDiscover = false;
  }
  openDoc() {
    window.open(this.fileUrl, this.title, 'width=800, height=700');
  }

  previewFilNotFound() {
    this.fileNotFound.emit();
  }
}
