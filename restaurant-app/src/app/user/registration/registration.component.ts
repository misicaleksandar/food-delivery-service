import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Registration } from 'src/app/shared/models/registration.model';
import { Upload } from 'src/app/shared/models/upload.model';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styles: [
  ]
})
export class RegistrationComponent implements OnInit {
  
  uploadedImagePath = "";

  registrationForm = this.fb.group({
    Username: ['', Validators.required],
    Email: ['', [Validators.required, Validators.email]],
    Passwords: this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(4)]],
      ConfirmPassword: ['', [Validators.required]]
    }, { validators: this.comparePasswords }),
    FirstName: ['', Validators.required],
    LastName: ['', Validators.required],
    DateOfBirth: ['', Validators.required],
    Address: ['', Validators.required],
    Type: ['', Validators.required],
    Image: ['', Validators.required]
  });

  comparePasswords(control: AbstractControl) : ValidationErrors | null {
    let confirmPassword = control.get('ConfirmPassword');

    if (confirmPassword?.errors == null || 'passwordMismatch' in confirmPassword.errors) {
      if (control.get('Password')?.value != confirmPassword?.value){
        confirmPassword?.setErrors({ passwordMismatch: true });
        return ({ passwordMismatch: true});
      }
      else {
        confirmPassword?.setErrors(null);
        return null;
      }
    }
    return null;
  }

  constructor(private service: UserService, private fb: UntypedFormBuilder, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    let regModel = new Registration();
    regModel.username = this.registrationForm.value.Username
    regModel.email = this.registrationForm.value.Email
    regModel.password = this.registrationForm.value.Passwords.Password
    regModel.firstName = this.registrationForm.value.FirstName
    regModel.lastName = this.registrationForm.value.LastName
    regModel.dateOfBirth = this.registrationForm.value.DateOfBirth
    regModel.address = this.registrationForm.value.Address
    regModel.type = this.registrationForm.value.Type
    regModel.image = this.uploadedImagePath

    this.service.register(regModel).subscribe({
      next: (res : any) => { 
        this.registrationForm.reset();
        this.toastr.success('New user created', 'Registration successful');
      },
      error: (error) => { 
        this.toastr.error(error.error);
      }
    });
  }

  uploadFile(files: any) {
    if(files.length === 0){
      return;
    }

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.service.upload(formData).subscribe({
      next: (data: Upload) => {
        this.uploadedImagePath = data.dbPath;
      },
      error: (error) => { this.toastr.error(error.error) }
    });
  }

}
