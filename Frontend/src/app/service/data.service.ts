import { Injectable } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { brickntrackService } from './brickntrack-service.service';
import { NavItem } from './user-model.service';
import { UserScreenAccesData } from './user-model.service';
 
@Injectable({
  providedIn: 'root',
})
export class DataService {
  public isLoading = false;
 
  constructor(
    public session: SessionStorageService,
    private brickntrackService: brickntrackService
  ) {}
 
  setUserDetail(userDetails: any) {
    this.session.set('LoginResponse', userDetails);
  }
 
  setDamageDetail(damageDetail: any) {
    this.session.set('DamageResponse', damageDetail);
  }


  getDamageDetail(): any {
    return this.session.get('DamageResponse');
  }
 
  getUserDetail(): any {
   
    return this.session.get('LoginResponse');
  }
 
  getUserDisplayName(): any {
  
    return this.getUserDetail().firstName + ' ' + this.getUserDetail().lastName;
  }
 
  getUserRole(): any {
   
    return this.getUserDetail().roleName;
  }
  getApiUrl(): string {
    return this.brickntrackService.END_POINT;
  }
 
  setUserMenu(menuData: any) {
    this.session.set('menu', menuData);
  }
 
  getUserMenu(): Array<NavItem> {
    return this.session.get('menu');
  }
   getUserId(): any {
    return this.getUserDetail().id;
  }
 
  getUserScreenAccessMenu(screenCode: string): UserScreenAccesData {
    var userdata = this.session.get('LoginResponse');
    var filteredData = userdata.userAccess.filter(
      (x: any) => x.screenCode == screenCode
    );
    return filteredData;
  }
}