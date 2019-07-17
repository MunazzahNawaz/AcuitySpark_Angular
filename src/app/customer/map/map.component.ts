import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store.service';
import { Customer, TargetFields } from '../models/customer';
import { Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HeaderService } from 'src/app/layout/services/header.service';
import { UploadService } from '../services/upload.service';
declare var toastr;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  public csvRecords: any[] = [];
  sourceFields: Array<any> = [];
  sourceFieldsNew: Array<any> = [];
  targetFields: Array<any> = [];
  mapping: Array<any> = [];
  headersRow;
  customerFile;
  isHeaderRow = false;
  public config: PerfectScrollbarConfigInterface = {
    suppressScrollX: false,
    wheelPropagation: true
  };

  constructor(
    public storeService: StoreService,
    private router: Router,
    protected headerService: HeaderService,
    private uploadService: UploadService
  ) {}

  ngOnInit() {
    this.headerService.setTitle('Map fields');
    console.log('file in map', localStorage.getItem('File'));
    this.getCustomerFields();
    this.storeService.getCustomerFile().subscribe(file => {
      console.log('file', file);
      if (file) {
        this.customerFile = file;
        this.loadHeader(file);
        this.loadCSVFile();
      }
    });
  }
  onIsHeaderChange() {
    this.loadHeader(this.customerFile);
    this.loadCSVFile();
  }
  getCustomerFields() {
    console.log('Object.keys(TargetFields)', Object.keys(TargetFields));
    for (const key of Object.keys(TargetFields)) {
      this.targetFields.push(TargetFields[key]);
    }
  }
  getMappingTargetValue(sourceField) {
    const field = this.mapping.filter(x => x.SourceField === sourceField);
    return field && field.length > 0 ? field[0].TargetField : null;
  }
  onFieldChange(sourceField, targetField) {
    const newMapping = { SourceField: sourceField, TargetField: targetField };
    const existingIndex = this.mapping.findIndex(
      x => x.SourceField === sourceField
    );
    console.log('existing Index', existingIndex);
    console.log('new Mapping', newMapping);
    if (existingIndex >= 0) {
      this.mapping[existingIndex] = newMapping;
    } else {
      this.mapping.push(newMapping);
    }
    console.log(this.mapping);
    this.loadCSVFile();
  }

  onSaveMapping() {
    this.storeService.setCustomerFieldMappings(this.mapping);
    let fileName = localStorage.getItem('FileName');
    this.uploadService.saveCsvFile(fileName, this.mapping).subscribe(x => {
      console.log(x);
    });
    console.log(this.mapping);
    // this.loadCSVFile();
    this.router.navigateByUrl('/customer/data');
  }
  onPreview() {
    this.storeService.setCustomerFieldMappings(this.mapping);
    console.log(this.mapping);
    this.loadCSVFile();
  }
  getSubString(str) {
    // just to get small data and avoid wrap in preview
    if (str && str.length > 0) {
      return str.substring(0, 12);
    }
    return '';
  }

  loadHeader(customerFile) {
    const reader = new FileReader();
    reader.readAsText(customerFile);

    reader.onload = data => {
      const csvData = reader.result;
      const csvRecordsArray = (csvData as string).split(/\r\n|\n/);
      this.headersRow = this.getHeaderArray(csvRecordsArray);
      console.log(this.csvRecords);
    };

    reader.onerror = function() {
      toastr.error('Unable to read file');
    };
  }
  getSourceFieldFromMapping(targetField) {
    const index = this.mapping.findIndex(x => x.TargetField == targetField);
    if (index >= 0) {
      return this.mapping[index].SourceField;
    } else {
      return '-NA-';
    }
  }
  getTargetFieldFromMapping(sourceField) {
    const index = this.mapping.findIndex(x => x.SourceField == sourceField);
    if (index >= 0) {
      return this.mapping[index].TargetField;
    } else {
      return '-NA-';
    }
  }
  loadCSVFile() {
    const reader = new FileReader();
    reader.readAsText(this.customerFile);

    reader.onload = data => {
      const csvData = reader.result;
      const csvRecordsArray = (csvData as string).split(/\r\n|\n/);
      // const headersRow = this.getHeaderArray(csvRecordsArray);
      this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray);
      //   console.log('csvRecords', JSON.stringify(this.csvRecords));

      //      console.log('csv Data', csvRecordsArray);
      // TODO: commented temporarily
      this.storeService.setcustomerFinalData(this.csvRecords);
    };

    reader.onerror = function() {
      toastr.error('Unable to read file');
    };
  }
  getHeaderArray(csvRecordsArr: any) {
    const headers = csvRecordsArr[0].split(',');
    const headerArray = [];

    if (this.isHeaderRow) {
      for (let j = 0; j < headers.length; j++) {
        headerArray.push(headers[j]);
      }
    } else {
      for (let j = 0; j < headers.length; j++) {
        headerArray.push('Column' + (j + 1));
      }
    }

    this.sourceFields = JSON.parse(JSON.stringify(headerArray));
    this.sourceFieldsNew = JSON.parse(JSON.stringify(headerArray));;
    console.log('sourceFields', this.sourceFields);

    console.log('targetFields', this.targetFields);
    // by default set all target fields = sourceFields
    this.mapping = [];
    this.targetFields.forEach(t => {
      let isExist = this.sourceFields.indexOf(t);
      if (isExist >= 0) {
        this.mapping.push({
          SourceField: this.sourceFields[isExist],
          TargetField: t
        });
      }
    });

    console.log('first mapping', this.mapping);

    return headerArray;
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any) {
    const dataArr = [];
    let startFrom = this.isHeaderRow ? 1 : 0;
    for (let i = startFrom; i < csvRecordsArray.length; i++) {
      const tempData = csvRecordsArray[i].split(',');
      // FOR EACH ROW IN CSV FILE IF THE NUMBER OF COLUMNS
      // ARE SAME AS NUMBER OF HEADER COLUMNS THEN PARSE THE DATA
      let data = [];
      for (let j = 0; j < this.headersRow.length; j++) {
        data[this.headersRow[j]] = tempData[j];
      }
      //      console.log('new Data', data);

      if (tempData.length == this.headersRow.length) {
        const csvRecord: Customer = new Customer();
        csvRecord['id'] = i;
        this.sourceFieldsNew = JSON.parse(JSON.stringify(this.sourceFields));
        this.mapping.forEach(m => {
          let index = this.sourceFieldsNew.findIndex(x => x == m.SourceField);
          if (index >= 0) {
            this.sourceFieldsNew[index] = m.TargetField;
          }
        });

        this.sourceFields.forEach(f => {
          let index = this.mapping.findIndex(x => x.SourceField == f);
          if (index >= 0) {
            // mapping exist
            csvRecord[this.mapping[index].TargetField] = data[f];
          } else {
            csvRecord[f] = data[f];
          }
        });
        console.log('csvRecord', csvRecord);

        // this.mapping.forEach((m, index) => {
        //   if (data[m.SourceField]) {
        //     csvRecord[m.TargetField] = data[m.SourceField];
        //   } else {
        //     csvRecord[m.TargetField] = data[index];
        //   }
        //   console.log('index', index);
        // });

        // csvRecord.NewCustID = data[0].trim();
        // csvRecord.DWCustNo = data[1].trim();
        // csvRecord.FirstName = data[2].trim();
        // csvRecord.LastName = data[3].trim();
        // csvRecord.EmailAddress = data[4].trim();
        // csvRecord.AddressLine1 = data[5].trim();
        // csvRecord.PhoneNumber = data[6].trim();
        // csvRecord.StatusInd = data[7].trim();
        dataArr.push(csvRecord);
      }
    }
    return dataArr;
  }
  // getDataRecordsArrayFromCSVFile(csvRecordsArray: any) {
  //   const dataArr = [];
  //   console.log('csvRecordsArray',csvRecordsArray);
  //   for (let i = 1; i < csvRecordsArray.length; i++) {
  //     const tempData = csvRecordsArray[i].split(',');
  //     // FOR EACH ROW IN CSV FILE IF THE NUMBER OF COLUMNS
  //     // ARE SAME AS NUMBER OF HEADER COLUMNS THEN PARSE THE DATA
  //     let data = [];
  //     for (let i = 0; i < this.headersRow.length; i++) {
  //       console.log('this.headersRow[i]', this.headersRow[i]);
  //       console.log('tempData[i]', tempData[i]);
  //       data[this.headersRow[i]] = tempData[i];
  //     }
  //      console.log('tempData',tempData);
  //      console.log('headersRow',this.headersRow);
  //      console.log('data', data);

  //     if (tempData.length == this.headersRow.length) {
  //       const csvRecord: Customer = new Customer();
  //       csvRecord['id'] = i;
  //       this.mapping.forEach(m => {
  //         csvRecord[m.SourceField] = data[m.TargetField];
  //       });
  //       // csvRecord.NewCustID = data[0].trim();
  //       // csvRecord.DWCustNo = data[1].trim();
  //       // csvRecord.FirstName = data[2].trim();
  //       // csvRecord.LastName = data[3].trim();
  //       // csvRecord.EmailAddress = data[4].trim();
  //       // csvRecord.AddressLine1 = data[5].trim();
  //       // csvRecord.PhoneNumber = data[6].trim();
  //       // csvRecord.StatusInd = data[7].trim();
  //       dataArr.push(csvRecord);
  //     }
  //   }
  //   return dataArr;
  // }
}
