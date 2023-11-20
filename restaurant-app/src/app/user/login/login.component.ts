import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Login } from 'src/app/shared/models/login.model';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {
  
  loginForm = this.fb.group({
    Email : ['', Validators.required],
    Password : ['', Validators.required],
  });

  constructor(private service: UserService, private fb: UntypedFormBuilder, private router: Router,
    private toastr: ToastrService, private externalAuthService: SocialAuthService) { }

  ngOnInit(): void { }

  onSubmit() {
    let logModel = new Login();
    logModel.email = this.loginForm.value.Email
    logModel.password = this.loginForm.value.Password
    
    this.service.login(logModel).subscribe({
      next: (data : User) => { 
        localStorage.setItem('currentUser', data.email);
        localStorage.setItem('currentUserType', data.type);
        localStorage.setItem('token', data.token); 
        this.router.navigateByUrl('dashboard');
      },
      error: (error) => { 
        this.toastr.error(error.error, 'Authentication failed');
      }
    });

  }

}
