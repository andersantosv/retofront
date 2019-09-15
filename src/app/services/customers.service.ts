import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomerModel } from '../models/customer.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
	private url ='https://clientes-6f175.firebaseio.com';

  constructor(private http: HttpClient) { }

  crearCustomer(customer: CustomerModel){
  	return this.http.post(`${ this.url }/customers.json`, customer)
  	.pipe(
  		map( (resp: any) => {
  			customer.id = resp.name; //name is the id returned
  			return customer;
  		})
  	);
  }

  actualizarCustomer(customer: CustomerModel){
  	const customerTmp = {
  		...customer
  	};
  	delete customerTmp.id;
  	return this.http.put(`${ this.url}/customers/${ customer.id}.json`, customerTmp);
  }

  deleteCustomer(id: string){
  	return this.http.delete(`${ this.url }/customers/${ id }.json`);
  }

  getCustomer(id: string){
  	return this.http.get(`${ this.url }/customers/${ id }.json`);
  }

  getCustomers(){
  	return this.http.get(`${ this.url }/customers.json`)
  				.pipe(
  					map( this._crearArreglo)
  				)
  }

  _getAverage(customers: any[]){
    let ncustomers = customers.length;
    let average = 0;
    if (ncustomers > 0) {
      customers.forEach(item => average+=item.edad );
      average = average / ncustomers;
    }
    return average;
  }

  _getStandarDevitation(customers: any[]){
    let varianza = this._getVariance(customers);
    let sda = Math.sqrt(varianza);
    //console.log(varianza,'varianza');
    return sda;
  }

  _getVariance(customers: any[]){
    let average = this._getAverage(customers);
    let ncustomers = customers.length;
    let sumSquare = 0;
    let varianza = 0;
    if (ncustomers > 0) {
      customers.forEach( item => {
          sumSquare+=Math.pow(item.edad - average, 2);
      });
      varianza = sumSquare / ncustomers;
    }
    return varianza;
  }

  private _crearArreglo( customersObj: object){
  	const customers: CustomerModel[] = [];
    if (customersObj === null) {
      return [];
    }
  	
    Object.keys(customersObj).forEach( key =>{
  		const customer: CustomerModel = customersObj[key];
  		customer.id = key;
  		customers.push(customer);
  	});

  	return customers;
  }

}
