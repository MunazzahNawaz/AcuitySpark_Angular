import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private customerFile$ = new BehaviorSubject<any>(null);
  private customerFieldMappings$ = new BehaviorSubject<any>(null);
  private customerFinalData$ = new BehaviorSubject<any>(null);
  private customerGoldenRecordData$ = new BehaviorSubject<any>(null);
  private customerRules$ = new BehaviorSubject<any>([]);
  private customerArchivedRules$ = new BehaviorSubject<any>([]);
  private goldenCustomerField$ = new BehaviorSubject<any>(null);
  private customerManualRecordData$ = new BehaviorSubject<any>(null);

  constructor() {}
  setCustomerFile(file) {
    this.customerFile$.next(file);
  }
  getCustomerFile(): Observable<any> {
    return this.customerFile$.asObservable();
  }
  setGoldenCustomerField(val) {
    this.goldenCustomerField$.next(val);
  }
  getGoldenCustomerField(): Observable<any> {
    return this.goldenCustomerField$.asObservable();
  }
  setCustomerRules(rules) {
    this.customerRules$.next(rules);
  }
  getCustomerRules(): Observable<any> {
    return this.customerRules$.asObservable();
  }
  setCustomerArchivedRules(rules) {
    this.customerArchivedRules$.next(rules);
  }
  getCustomerArchivedRules(): Observable<any> {
    return this.customerArchivedRules$.asObservable();
  }
  setCustomerGoldenRecordData(val) {
    this.customerGoldenRecordData$.next(val);
  }
  getCustomerGoldenRecordData(): Observable<any> {
    return this.customerGoldenRecordData$.asObservable();
  }
  setCustomerFieldMappings(mappings) {
    this.customerFieldMappings$.next(mappings);
  }
  getCustomerFieldMappings(): Observable<any> {
    return this.customerFieldMappings$.asObservable();
  }
  setCustomerManualRecordData(mappings) {
    this.customerManualRecordData$.next(mappings);
  }
  getCustomerManualRecordData(): Observable<any> {
    return this.customerManualRecordData$.asObservable();
  }

  setcustomerFinalData(data) {
    console.log('in set customer data', data);

    const dataSet = [];
    let id = 1;
    data.forEach(d => {
      d.id = id;
      id++;
      dataSet.push(d);
    });
   // data.map(x => x.id = x.CustomerNo);
    console.log('in app component', dataSet);
   // this.storeService.setcustomerFinalData(dataSet);

    this.customerFinalData$.next(dataSet);
  }
  getcustomerFinalData(): Observable<any> {
    return this.customerFinalData$.asObservable();
  }
}
