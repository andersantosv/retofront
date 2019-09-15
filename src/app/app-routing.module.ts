import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CustomersComponent} from './pages/customers/customers.component';
import {CustomerComponent} from './pages/customer/customer.component';
import {ProjectionComponent} from './pages/projection/projection.component';

const routes: Routes = [
  {path: 'customers', component: CustomersComponent},
  {path: 'customer/:id', component: CustomerComponent},
  {path: 'customer/projection/:id', component: ProjectionComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'customers'}
  ];

@NgModule({
  imports: [
  	RouterModule.forRoot(routes,{useHash: true})
  ],
  exports: [
  	RouterModule
  ]
})

export class AppRoutingModule { }
