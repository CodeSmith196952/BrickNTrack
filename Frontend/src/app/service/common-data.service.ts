import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonDataService {

  constructor() { }


getInventoryStatus(): any {
  const ctStatus = [
    {"key":"All","status":"All"},
    {"key":"New","status":"New"},
    {"key":"In Use","status":"InUse"},
    {"key":"Damaged","status":"Damaged"},
    {"key":"Repaired","status":"Repaired"},
    {"key":"Not Detected","status":"Not Detected"},
  ];
  return ctStatus;
}

getPlateSubType(): any {
  const PStatus = [
    {"key":"All","status":"All"},
    {"key":"Head","status":"Head"},
    {"key":"Middle","status":"Middle"},
    {"key":"End","status":"End"},
  ];
  return PStatus;
}

getClothSubType(): any {
  const CStatus = [
    {"key":"All","status":"All"},
    {"key":"CS","status":"Chamber Side"},
    {"key":"MS","status":"Membrane Side"},
  ];
  return CStatus;
}

getClothNPlateSubType(): any {
  const CPStatus = [
    {"key":"All","status":"All"},
    {"key":"Head","status":"Head"},
    {"key":"Middle","status":"Middle"},
    {"key":"End","status":"End"},
    {"key":"CS","status":"Chamber Side"},
    {"key":"MS","status":"Membrane Side"},
  ];
  return CPStatus;
}

}
