import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private title: string;

  constructor() { }
  get Title() {
    return this.title;
  }
  setTitle(value: string) {
    this.title = value;
  }
}
