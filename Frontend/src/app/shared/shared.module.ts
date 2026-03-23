import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { TimelineModule } from 'primeng/timeline';
import { TabViewModule } from 'primeng/tabview';
import { MultiSelectModule } from 'primeng/multiselect';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';

import { PropertyCardComponent } from './components/property-card/property-card.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { EmiCalculatorComponent } from './components/emi-calculator/emi-calculator.component';
import { MapViewComponent } from './components/map-view/map-view.component';

const PRIMENG_MODULES = [
  TableModule,
  DialogModule,
  ToastModule,
  DropdownModule,
  InputTextModule,
  InputNumberModule,
  CheckboxModule,
  TimelineModule,
  TabViewModule,
  MultiSelectModule,
  AccordionModule,
  BadgeModule,
];

@NgModule({
  declarations: [
    PropertyCardComponent,
    PaginationComponent,
    StarRatingComponent,
    ConfirmationDialogComponent,
    EmiCalculatorComponent,
    MapViewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ...PRIMENG_MODULES,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ...PRIMENG_MODULES,
    PropertyCardComponent,
    PaginationComponent,
    StarRatingComponent,
    ConfirmationDialogComponent,
    EmiCalculatorComponent,
    MapViewComponent,
  ]
})
export class SharedModule {}
