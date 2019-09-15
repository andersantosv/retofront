import { Component, OnInit } from '@angular/core';
import { CustomersService } from '../../services/customers.service';
import { CustomerModel } from '../../models/customer.model';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

	customers: CustomerModel[] = [];
  averageage: number;
  devitationstandar: number;
  cargando = false;

  constructor(private customersService: CustomersService) { }

  ngOnInit() {
    
  	this.customersService.getCustomers()
  	.subscribe( resp => {
      this.customers = resp;
      this.averageage = this.customersService._getAverage(resp);
      this.devitationstandar = this.customersService._getStandarDevitation(resp);
      this.cargando = false;
    });
  }

  removeCustomer(customer: CustomerModel, i: number){
    this.customers.splice(i, 1);
    this.averageage = this.customersService._getAverage(this.customers);
    this.devitationstandar = this.customersService._getStandarDevitation(this.customers);
    this.customersService.deleteCustomer(customer.id).subscribe();
  }

}
