import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { CustomersService } from '../../services/customers.service';
import { CustomerModel } from '../../models/customer.model';

@Component({
  selector: 'app-projection',
  templateUrl: './projection.component.html',
  styleUrls: ['./projection.component.css']
})
export class ProjectionComponent implements OnInit {
  customer: CustomerModel = new CustomerModel();
  avg: Number;
  sda: Number;
  nsda: Number;
  deathday: Date;
  deathAge: Number;


  constructor(
  	private route: ActivatedRoute,
  	private customersService: CustomersService
  	) { }

  ngOnInit() {
  		const id = this.route.snapshot.paramMap.get('id');
		this.customersService.getCustomer(id)
		.subscribe( (resp: CustomerModel) => {
	      this.customer = resp;
	      this.customer.id = id;
	      this.getTheDeathday();
		});
  }

  private getTheDeathday(){

  		this.customersService.getCustomers()
  		.subscribe( resp => {
  	    
        let dateString = this.customer.birthday;
        let age = this.customer.edad;
        let dateArray = dateString.split("/");
        let avg = this.customersService._getAverage(resp);
        this.avg = avg;

        let sda = this.customersService._getStandarDevitation(resp);
        this.sda = sda;

        let nsda = this.getDesviationNumbers(sda, Number(dateArray[2]));
        this.nsda = nsda;

  	    let devitationstandar = sda * nsda;
        let yearSda = Math.trunc(devitationstandar);
        this.deathAge = yearSda;
        
  	    let monthSdaDecimal = (devitationstandar - yearSda) * 12;
  	    let monthSda = Math.trunc(monthSdaDecimal);
  	    let daySdaDecimal = (monthSdaDecimal - monthSda) * 30;
  	    let daySda = Math.trunc(daySdaDecimal);

  	    let dia = Number(dateArray[0]) + daySda;
  	    let mes = Number(dateArray[1]) + monthSda;
  	    let anio = Number(dateArray[2]) + yearSda;
  	    this.deathday = new Date(anio, mes - 1, dia);

  	  });
  }

  private getDesviationNumbers(sda, yearCustomer){
    let nsda = 0;
    let currentYear = (new Date()).getFullYear();
    do {
      nsda += 1;
      yearCustomer += sda;
    } while (yearCustomer < currentYear);
    return nsda;
  }

}
