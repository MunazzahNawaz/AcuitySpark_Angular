import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../layout/services/header.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(private headerService: HeaderService) { }

  ngOnInit() {
    this.headerService.setTitle('Error 404');
  }

}
