import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { Registration } from '../shared/models/registration.model';
import { Upload } from '../shared/models/upload.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {
  uploadedImagePath = "";

  profileForm = this.fb.group({
    Username: ['', Validators.required],
    Email: ['', [Validators.required, Validators.email]],
    FirstName: ['', Validators.required],
    LastName: ['', Validators.required],
    DateOfBirth: ['', Validators.required],
    Address: ['', Validators.required],
    Type: ['', Validators.required],
  });

  passwordForm = this.fb.group({
    Password: ['', [Validators.required, Validators.minLength(4)]],
    ConfirmPassword: ['', [Validators.required]]
  }, { validators: this.comparePasswords })

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
    let email = localStorage.getItem('currentUser')!;
    this.service.getUserByEmail(email).subscribe({
      next: (data: Registration) => {
        this.profileForm.get('Username')?.patchValue(data.username)
        this.profileForm.get('Email')?.patchValue(data.email)
        this.profileForm.get('FirstName')?.patchValue(data.firstName)
        this.profileForm.get('LastName')?.patchValue(data.lastName)
        this.profileForm.get('DateOfBirth')?.patchValue(data.dateOfBirth.split('T')[0])
        this.profileForm.get('Address')?.patchValue(data.address)
        this.profileForm.get('Type')?.patchValue(data.type)
        this.uploadedImagePath = data.image
        
        this.getImage(data.image);
      },
      error: (error) => { 
        this.toastr.error(error.error);
      }
    });
  }

  getImage(serverPath: string) {
    const profileImage = document.getElementById('profileImage') as HTMLImageElement;
    if(profileImage) {
      profileImage.src = this.service.getImage(serverPath);
    }
  }

  updateProfile(){
    let updated = new Registration();
    updated.email = this.profileForm.value.Email
    updated.firstName = this.profileForm.value.FirstName
    updated.lastName = this.profileForm.value.LastName
    updated.username = this.profileForm.value.Username
    updated.password = 'nochanges'
    updated.dateOfBirth = this.profileForm.value.DateOfBirth
    updated.address = this.profileForm.value.Address
    updated.type = this.profileForm.value.Type
    updated.image = this.uploadedImagePath

    this.service.updateProfile(updated).subscribe({
      next: (data : Registration) => {
        this.toastr.success('Your data has been updated', 'Update successful')
        this.ngOnInit();
      },
      error: (error) => { 
        this.toastr.error(error.error);
      }
    })
  }

  changePassword() {
    let updated = new Registration();
    updated.email = localStorage.getItem('currentUser')!
    updated.password = this.passwordForm.value.Password

    this.service.changePassword(updated).subscribe({
      next: (data : Registration) => {
        this.toastr.success('Password changed successfully');
        this.passwordForm.reset();
      },
      error: (error) => { 
        this.toastr.error(error.error); 
      }
    })
  }

  changePicture(files: any) {
    if(files.length === 0){
      return;
    }

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.service.upload(formData).subscribe({
      next: (data: Upload) => {
        this.uploadedImagePath = data.dbPath;
        this.updateProfile();
      },
      error: (error) => { this.toastr.error(error.error); }
    })
  }

}
