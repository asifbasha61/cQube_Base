import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  logData: any = {};
  err;
  msg;
  roleIds: any = [];
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private service: AppService, private router: Router) {

  }

  ngOnInit() {
    document.getElementById('backBtn').style.display = "none";
    document.getElementById('homeBtn').style.display = "Block";
    this.service.getRoles().subscribe(res => {
      this.roleIds = res['roles'];
    })
  }


  onSubmit(formData: NgForm) {
    var currUser = this.logData;
    document.getElementById('spinner').style.display = 'block';
    this.logData['createrId'] = localStorage.getItem('user_id');
    this.service.addUser(this.logData).subscribe(res => {
      document.getElementById('success').style.display = "Block";
      this.msg = res['msg'];
      document.getElementById('spinner').style.display = 'none';
      this.err = '';
      setTimeout(() => {
        this.service.getCreatedUser(currUser).subscribe(user => {
          this.service.addRole(user['id']).subscribe();
        });
        formData.resetForm();
        document.getElementById('success').style.display = "none";
      }, 2000);
    }, err => {
      this.err = err.error['errMsg'];
      document.getElementById('spinner').style.display = 'none';
    });

  }
}