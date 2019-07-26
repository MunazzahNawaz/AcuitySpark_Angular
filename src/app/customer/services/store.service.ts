import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerService } from './customer.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private customerFile$ = new BehaviorSubject<any>(null);
  private customerFieldMappings$ = new BehaviorSubject<any>(null);
  private customerFinalData$ = new BehaviorSubject<any>(null);
  private customerRules$ = new BehaviorSubject<any>([]);
  private customerArchivedRules$ = new BehaviorSubject<any>([]);
  private customerManualRecordData$ = new BehaviorSubject<any>(null);
  private goldenCustomerField$ = new BehaviorSubject<any>(null);
  private currentFileUrl$ = new BehaviorSubject<any>(null);

  constructor(private customerService: CustomerService) {}
  setCurrentFileUrl(url) {
    this.currentFileUrl$.next(url);
  }
  getCurrentFileUrl(): Observable<any> {
    return this.currentFileUrl$.asObservable();
  }
  setCustomerFile(file) {
    this.customerFile$.next(file);
  }
  getCustomerFile(): Observable<any> {
    return this.customerFile$.asObservable();
  }
  // setManualCustomerField(val) {
  //   this.manualCustomerField$.next(val);
  // }
  // getManualCustomerField(): Observable<any> {
  //   return this.manualCustomerField$.asObservable();
  // }
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
  setCustomerGoldenRecordData(val) {
    this.goldenCustomerField$.next(val);
  }
  getCustomerGoldenRecordData(): Observable<any> {
    return this.goldenCustomerField$.asObservable();
  }

  refreshCustomerFinalData() {
    this.customerService.getCustomerData().subscribe(c => {
      this.customerFinalData$.next(c.customer);
    });
    //  console.log('in set customer data', data);
    // TODO: Temporary code
    // const dataSet = [];
    // this.dataSet = [];
    // let id = 1;
    // data.forEach(d => {
    //   d.id = id;
    //   id++;
    //   this.dataSet.push(d);
    // });
    // end temporary code
    // data.map(x => x.id = x.CustomerNo);
    //   console.log('in app component', this.dataSet);
    // this.storeService.setcustomerFinalData(dataSet);

    // this.customerFinalData$.next(data);
  }
  getcustomerFinalData(): Observable<any> {
    if (this.customerFinalData$.getValue() == null) {
      this.customerService.getCustomerData().subscribe(c => {
        console.log('in store service', c);
        this.customerFinalData$.next(c.customer);
      });
    }
    return this.customerFinalData$.asObservable();
  }
}
