import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  password = true;
  confirmPassword = true;
  signupForm: any = FormGroup
  responseMessage:any;

  constructor(
    private formBuilder:FormBuilder,
    private router:Router,
    private useService:UserService,
    private snackbarService:SnackbarService,
    public dialogRef:MatDialogRef<SignupComponent>,
    private ngxService:NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber:[null,[Validators.required,Validators.pattern(GlobalConstants.contactNumberRegex)]],
      password: [null,[Validators.required]],
      confirmPassword: [null,[Validators.required]]
    })
  }

  validateSubmit(){

    if(this.signupForm.controls['password'].value != this.signupForm.controls['confirmPassword'].value){
      return true;
    }else{
      return false;
    }
  }

  handleSubmit(){
    this.ngxService.start();
    var formdData = this.signupForm.value;
    var data = {
        name: formdData.name,
        email: formdData.email,
        contactNumber: formdData.contactNumber,
        password: formdData.password
    }

    this.useService.signup(data).subscribe((response:any)=> {
      this.ngxService.stop();
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"");
      this.router.navigate(['/']);
    },(error)=>{
      this.ngxService.stop();
      console.log("Error during signup", error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;

      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

}
