import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }



  private baseUrl ='https://api-dev.cashfloweg.com';
  getbaseurl(){
  return this.baseUrl
  }
  
}
