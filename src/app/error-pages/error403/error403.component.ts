import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../layout/services/header.service';

@Component({
  selector: 'app-error403',
  templateUrl: './error403.component.html',
  styleUrls: ['./error403.component.scss']
})
export class Error403Component implements OnInit {

  constructor(private headerService: HeaderService) { }

  ngOnInit() {
    this.headerService.setTitle('Error 403');
  }

}
