import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppConfigServiceService} from 'src/app/services/app-config-service.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  msg: any;
  userDetails: any = JSON.parse(sessionStorage.getItem("currentUser"));

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe((msg: any) => {
      this.msg = msg.msg;
    });
  }

  ngOnInit() {
  }

  login() {
    window.location.href = AppConfigServiceService.settings.SSORedirectUrl;
  }
}
