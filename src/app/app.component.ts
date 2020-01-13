import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { RowCountService } from './shared/services/row-count.service';
import { StoreService } from './customer/services/store.service';
import { Event, Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'AcuitySpark';
  countSub;
  loading = false;

  constructor(
    private rowCountService: RowCountService,
    private storeService: StoreService,
    private authService: AuthService,
    private router: Router
  ) {
    this.router.events.subscribe( (event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }

    });
  }

  ngOnInit(): void {
    // use this below line only in production to disbale all console.log
    // window.console.log = function () { };   // disable any console.log debugging statements in production mode

    const autoPopulateFields = ['state', 'country', 'city'];
    // setTimeout(() => {

    //   });
    // }, 5000);

    this.authService.getIsLoginReady().subscribe(isLoggedIn => {
      if (isLoggedIn != null && isLoggedIn == true) {
        autoPopulateFields.forEach(field => {
          this.countSub = this.rowCountService.GetUniqueKeys(field).subscribe(resp => {
            this.storeService.addFieldCountKeys(resp, field);
            console.log('in app component GetUniqueKeys', resp);
          });
        });
      }
    });

  }

  ngOnDestroy(): void {
    if (this.countSub) {
      this.countSub.unsubscribe();
    }
  }
}
