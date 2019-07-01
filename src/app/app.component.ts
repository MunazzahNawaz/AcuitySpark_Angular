import { Component, OnInit } from '@angular/core';
import { CustomerService } from './customer/services/customer.service';
import { StoreService } from './customer/services/store.service';
import { AppConfigService } from './app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'AcuitySpark';

  constructor(
    private customerService: CustomerService,
    private storeService: StoreService,
    private appConfig: AppConfigService
  ) {}

  ngOnInit(): void {
    const pageSize = this.appConfig.getConfig('threshHold');
    console.log('pageSize', pageSize);
    this.customerService
      .getCustomerData(pageSize, 1)
      .subscribe(data => {
        const dataSet = [];
        data.forEach(d => {
          d.id = d.CustomerNo ? d.CustomerNo : -1;
          dataSet.push(d);
        });
       // data.map(x => x.id = x.CustomerNo);
        console.log('in app component', dataSet);
        this.storeService.setcustomerFinalData(dataSet);
      });
  }
}
