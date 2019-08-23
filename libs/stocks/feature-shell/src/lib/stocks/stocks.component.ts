import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import * as moment from "moment";

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
  maxDate: Date;

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

  isSelected: boolean = false;
  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.maxDate = new Date();
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      period: [null, Validators.required],
      fromDate: null,
      toDate: null
    });
  }

  ngOnInit() {
    this.stockPickerForm.get('symbol').valueChanges.subscribe(res => {
      debugger;
      const { fromDate, toDate } = this.stockPickerForm.value;
      if (fromDate && toDate) {
        this.dateChange();
      } else {
        this.clickEvent(this.timePeriods[3]);
      }
    });
  }

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const { symbol, period } = this.stockPickerForm.value;
      if (symbol) {
        this.priceQuery.fetchQuote(symbol, period);
      }
    }
  }

  clickEvent(timePeriod) {
    this.selectedValue = timePeriod.value;
    this.stockPickerForm.patchValue({ period: this.selectedValue, fromDate: null, toDate: null });
    this.fetchQuote();
  }

  dateChange() {
    const { fromDate, toDate } = this.stockPickerForm.value;
    let symbol = this.stockPickerForm.get('symbol').value;
    if (fromDate && toDate) {
      let _fromDate = moment(new Date(fromDate), "yyyy-mm-dd");
      let _toDate = moment(new Date(toDate), "yyyy-mm-dd");
      if (symbol && _fromDate.valueOf() <= _toDate.valueOf()) {
        let period = this.timePeriods[0].value;
        this.selectedValue = '';
        this.priceQuery.fetchQuote(symbol, period, fromDate, toDate);
      } else if (_fromDate.valueOf() > _toDate.valueOf()) {
        this.stockPickerForm.patchValue({ fromDate: toDate });
      }
    }
  }

}
