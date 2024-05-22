import {Component, OnInit, ElementRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {PopUPService} from 'src/app/services/pop-up.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  status: string;
  loggedInUser: any;
  showError: boolean = false;
  loginError: any;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private popUPService: PopUPService,
    private elm: ElementRef
  ) {


  }

  openConfirmationDialog() {
    this.popUPService.confirm('Please confirm..', 'Do you really want to ... ?')
      .then((confirmed) => console.log('User confirmed:', confirmed),
        (cancelled) => console.log('User cancelled:', cancelled))
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }


  get f() {
    return this.loginForm.controls;
  }

  ngOnInit() {

    this.route
      .params
      .subscribe(params => {

      });

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });


    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {

    this.submitted = true;


    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.username = this.f.username.value

    this.username = this.username.trim()
    console.log('username', this.username)
    this.authenticationService.login(this.username, this.f.password.value)

      .pipe(first())
      .subscribe(data => {
          this.status = data.result.status;
          if (this.status == "-50167") {

            this.popUPService.confirm('User already logged in.', 'Do you  want to continue ?')
              .then((confirmed) => {

                if (confirmed) {
                  this.forceLogin();
                } else {

                }

              })
              .catch(() => console.log('User dismissed the dialog '));


          } else if (this.status == "0") {

            console.log('main 0')
            this.authenticationService.loginMethod = 'MANUVAL';
            this.router.navigate(['/dashboard']);
          } else {

            this.showError = true;
            this.loginError = data.result.error;


          }
        },
        error => {


        });
  }

  forceLogin() {

    this.loading = true;
    this.authenticationService.forceLogin(this.username, this.f.password.value)
      .pipe(first())
      .subscribe(data => {
          this.loggedInUser = data;

          this.authenticationService.loginMethod = 'MANUVAL';
          this.router.navigate(['./dashboard']);
        },
        error => {


        });

  }

}
