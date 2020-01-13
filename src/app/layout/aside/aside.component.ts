import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { StoreService } from 'src/app/customer/services/store.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})
export class AsideComponent implements OnInit {

  dedupShow = false;
  activeMenu = 'Import';
  constructor(private storeService: StoreService) { }

  ngOnInit() {
  }

  importClick() { }
  toggleMenu() {
    const sidebar = document.querySelector('.sidebar');
    const bodyWrapper = document.querySelector('.body-wrapper');
    bodyWrapper.classList.toggle('move');
    sidebar.classList.toggle('fliph');
  }

}
