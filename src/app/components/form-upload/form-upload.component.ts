import {Component, OnInit} from '@angular/core';
import {UploadFileService} from 'src/app/services/upload-file.service';
import {HttpResponse, HttpEventType} from '@angular/common/http';
import {FileUploader} from 'ng2-file-upload';

const URL = '';

@Component({
  selector: 'form-upload',
  templateUrl: './form-upload.component.html',
  styleUrls: ['./form-upload.component.scss']
})

export class FormUploadComponent implements OnInit {

  selectedFiles: FileList;
  selectedFilesBrowse: FileList;
  currentFileUpload: File;
  type: string;
  optionIsNull = true;
  progress: { percentage: number } = {percentage: 0};
  submitted = false;
  documents: any = []

  constructor(private uploadService: UploadFileService) {
  }

  ngOnInit() {
  }

  files = [];
  docutype = [];
  temfiles = [];
  temdocutype = [];

  selectFile(event) {

    this.selectedFiles = event;

    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.temfiles.push(this.selectedFiles[i]);
      this.temdocutype.push(this.type);
    }
  }


  selectFileBrowse(event) {

    this.selectedFilesBrowse = event.target.files;
    this.temfiles.push(this.selectedFilesBrowse[0]);
    this.temdocutype.push(this.type);


  }

  addToTable(filetoadd: File, filetype: string) {
  }

  remove(event) {
    this.temfiles.splice(event, 1)
    this.temdocutype.splice(event, 1)
  }


  removefromtemparray(filetoremove: File, filetypetoremove: string) {
    for (var i = 0; i < this.temfiles.length; i++) {
      if (this.temfiles[i] === filetoremove) {
        this.temfiles.splice(i, 1);
        this.files.splice(i, 1);
      }

    }
  }

  upload() {
    this.progress.percentage = 0;
    for (let j = 0; j < this.temfiles.length; j++) {
      this.currentFileUpload = this.temfiles[j];
      this.uploadService.pushFileToStorage(this.currentFileUpload, this.type, "").subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress.percentage = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
        }
      });
      this.files.push(this.currentFileUpload);
      this.docutype.push(this.temdocutype[j]);
    }

    this.optionIsNull = true;
    this.type = '';
  }

  public uploader: FileUploader = new FileUploader({url: URL});
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
}
