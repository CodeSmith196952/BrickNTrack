import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-emi-calculator',
  templateUrl: './emi-calculator.component.html',
  styleUrls: ['./emi-calculator.component.scss']
})
export class EmiCalculatorComponent {
  @Input() propertyPrice: number = 0;

  loanAmount: number = 0;
  interestRate: number = 8.5;
  loanTenure: number = 20;
  downPayment: number = 20; // percentage

  get effectiveLoanAmount(): number {
    return this.loanAmount || (this.propertyPrice * (100 - this.downPayment) / 100);
  }

  get monthlyEmi(): number {
    const P = this.effectiveLoanAmount;
    const r = this.interestRate / 12 / 100;
    const n = this.loanTenure * 12;
    if (r === 0) return P / n;
    return Math.round(P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
  }

  get totalPayment(): number {
    return this.monthlyEmi * this.loanTenure * 12;
  }

  get totalInterest(): number {
    return this.totalPayment - this.effectiveLoanAmount;
  }

  ngOnInit(): void {
    if (this.propertyPrice) {
      this.loanAmount = this.propertyPrice * (100 - this.downPayment) / 100;
    }
  }

  onDownPaymentChange(): void {
    this.loanAmount = this.propertyPrice * (100 - this.downPayment) / 100;
  }
}
