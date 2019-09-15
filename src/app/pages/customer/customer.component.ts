import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { CustomerModel } from '../../models/customer.model';
import { CustomersService } from '../../services/customers.service';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styles: [
    `.ng-invalid.ng-touched:not(form){
      border: 1px solid red;
    }`
  ]
})
export class CustomerComponent implements OnInit {
  
  customer: CustomerModel = new CustomerModel();
  formCustomer: FormGroup;
  datePickerConfig: Partial<BsDatepickerConfig>;
  
  constructor(
              private fb: FormBuilder,
              private customersService: CustomersService,
      			  private route: ActivatedRoute,
              private router:Router
              ) { 
              this.datePickerConfig = Object.assign({},
                { containerClass: 'theme-dark-blue',
                  dateInputFormat: 'DD/MM/YYYY',
                  minDate:  new Date(1900,1,1),
                  maxDate:  new Date()
                });
  }

  ngOnInit() {
  	
    this.formCustomer = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: [null, [
              Validators.required,
              Validators.minLength(1), 
              Validators.maxLength(3),
              Validators.min(1), 
              Validators.max(150)
            ]],
      birthday: [null, Validators.required]
    });

    this.formCustomer.get('birthday').valueChanges.subscribe(
      value => {
        if (typeof value === 'object') {
          let date = new Date(value).toLocaleString("es-ES", {timeZone: "America/Lima"});
          date = date.split(' ')[0];
          this.formCustomer.get('birthday').setValue(date);
        }
      }
    );

    const id = this.route.snapshot.paramMap.get('id');

  	if (id!='new') {
  		this.customersService.getCustomer(id)
  		.subscribe( (resp: CustomerModel) => {
        this.customer = resp;
        this.customer.id = id;
        this.formCustomer.patchValue(this.customer);
  		})
  	}
  }

  guardar(form){
  	let peticion : Observable<any>;
  	let message : string;
    this.customer = this.formCustomer.value;

  	if (this.customer.id) {
  		peticion = this.customersService.actualizarCustomer(this.customer);
  		message = 'Se actualizó correctamente';
  	}else{
	   	peticion = this.customersService.crearCustomer(this.customer);
	   	message = 'Se agregó correctamente';
  	}
  	peticion.subscribe( resp => {    		
	  	this.router.navigate(['/customers']);	
  	});


  }

}
