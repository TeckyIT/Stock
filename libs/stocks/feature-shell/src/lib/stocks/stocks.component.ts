import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  symbol: string;
  period: string;
  selectedValue: string;
  quotes$ = this.priceQuery.priceQueries$;
  selectedSymbol$ = this.priceQuery.selectedSymbol$;

  timePeriods = [
    { viewValue: 'Max', value: 'max' },
    { viewValue: '5Y', value: '5y' },
    { viewValue: '2Y', value: '2y' },
    { viewValue: '1Y', value: '1y' },
    { viewValue: 'YTD', value: 'ytd' },
    { viewValue: '6M', value: '6m' },
    { viewValue: '3M', value: '3m' },
    { viewValue: '1M', value: '1m' }
  ];

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {

    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      period: [null, Validators.required]
    });
  }

  ngOnInit() {

    this.stockPickerForm.get('symbol').valueChanges.subscribe(res => {
      this.clickEvent(this.timePeriods[3]);
    });
  }

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const { symbol, period } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, period);
    }
  }

  clickEvent(timePeriod) {
    this.selectedValue = timePeriod.value;
    this.stockPickerForm.patchValue({ period: this.selectedValue });
    this.fetchQuote();
  }

}
