import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store.service';
import { Customer, TargetFields } from '../models/customer';
import { Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
declare var toastr;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  public csvRecords: any[] = [];
  sourceFields: Array<any> = [];
  targetFields: Array<any> = [];
  mapping: Array<any> = [];
  headersRow;
  customerFile;
  public config: PerfectScrollbarConfigInterface = {
    suppressScrollX: false,
    wheelPropagation: true


  };

  constructor(public storeService: StoreService, private router: Router) {}

  ngOnInit() {
    console.log('file in map', localStorage.getItem('File'));
    this.getCustomerFields();
    this.storeService.getCustomerFile().subscribe(file => {
      console.log('file', file);
      if (file) {
        this.customerFile = file;
        this.loadHeader(file);
      }
    });
  }
  getCustomerFields() {
    console.log('Object.keys(TargetFields)', Object.keys(TargetFields));
    for (const key of Object.keys(TargetFields)) {
      this.targetFields.push(TargetFields[key]);
    }
    console.log('targetFields', this.targetFields);
    // by default set all target fields = sourceFields
    this.targetFields.forEach(t => {
      this.mapping.push({ SourceField: t, TargetField: t });
    });
  }
  getMappingTargetValue(sourceField) {
    const field = this.mapping.filter(x => x.SourceField === sourceField);
    return field && field.length > 0 ? field[0].TargetField : null;
  }
  onFieldChange(sourceField, targetField) {
    // const newMapping = { SourceField: sourceField.value, TargetField: targetField };
    // const existingIndex = this.mapping.findIndex(
    //   x => x.SourceField === sourceField.value
    // );
    // console.log(targetField);
    // const sourceSelectedIndex = this.sourceFields.findIndex(x => x.value === sourceField.value);
    // if(sourceSelectedIndex >= 0)
    // {
    // console.log(targetField);
    //   this.sourceFields[sourceSelectedIndex] = {
    //     value: sourceField.value,
    //     Selected : targetField
    //   };
    //   console.log(this.sourceFields[sourceSelectedIndex]);
    // }
    // console.log('existing Index', existingIndex);
    // if (existingIndex >= 0) {
    //   this.mapping[existingIndex] = newMapping;
    // } else {
    //   this.mapping.push(newMapping);
    // }
    // console.log(this.mapping);
    // console.log('source Fields',this.sourceFields);
    // console.log('target Fields',this.targetFields);
    const newMapping = { SourceField: sourceField, TargetField: targetField };
    const existingIndex = this.mapping.findIndex(
      x => x.SourceField === sourceField
    );
    console.log('existing Index', existingIndex);
    if (existingIndex >= 0) {
      this.mapping[existingIndex] = newMapping;
    } else {
      this.mapping.push(newMapping);
    }
    console.log(this.mapping);
  }

  onSaveMapping() {
    this.storeService.setCustomerFieldMappings(this.mapping);
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
    if (str && str.length > 0) {
      return str.substring(0, 10);
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
      //  const headersRow = this.getHeaderArray(csvRecordsArray);
      this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray);
      console.log('csvRecords', JSON.stringify(this.csvRecords));

      //  console.log('csv Data', csvRecordsArray);
      // TODO: commented temporarily
      // this.storeService.setcustomerFinalData(this.csvRecords);
    };

    reader.onerror = function() {
      toastr.error('Unable to read file');
    };
  }
  getHeaderArray(csvRecordsArr: any) {
    const headers = csvRecordsArr[0].split(',');
    const headerArray = [];

    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    this.sourceFields = JSON.parse(JSON.stringify(headerArray));
    console.log('sourceFields', this.sourceFields);
    return headerArray;
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any) {
    const dataArr = [];
    for (let i = 1; i < csvRecordsArray.length; i++) {
      const tempData = csvRecordsArray[i].split(',');
      // FOR EACH ROW IN CSV FILE IF THE NUMBER OF COLUMNS
      // ARE SAME AS NUMBER OF HEADER COLUMNS THEN PARSE THE DATA
      let data = [];
      for (let j = 0; j < this.headersRow.length; j++) {
        data[this.headersRow[j]] = tempData[j];
      }
      //  console.log('new Data', data);

      if (tempData.length == this.headersRow.length) {
        const csvRecord: Customer = new Customer();
        csvRecord['id'] = i;
        this.mapping.forEach(m => {
          csvRecord[m.SourceField] = data[m.TargetField];
        });
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
