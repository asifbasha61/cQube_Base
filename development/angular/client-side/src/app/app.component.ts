import { Component, OnInit } from '@angular/core';
import { KeycloakSecurityService } from './keycloak-security.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public keyclockService: KeycloakSecurityService, public router: Router) { };

  ngOnInit() {
    localStorage.setItem('roleName', this.keyclockService.kc.tokenParsed.realm_access.roles[0]);
    if (this.keyclockService.kc.tokenParsed.realm_access.roles[0] == "admin") {
      this.router.navigate(['/homePage']);
    } else if (this.keyclockService.kc.tokenParsed.realm_access.roles[0] == "report_viewer") {
      this.router.navigate(['home']);
    } else {
      this.router.navigate(['/homePage']);
    }
  }
}