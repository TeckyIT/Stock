import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FetchPriceQuery, SelectSymbol } from './price-query.actions';
import { PriceQueryPartialState } from './price-query.reducer';
import { getSelectedSymbol, getAllPriceQueries } from './price-query.selectors';
import { map, skip, filter } from 'rxjs/operators';
import * as moment from "moment";

@Injectable()
export class PriceQueryFacade {
  fromDate: Date;
  toDate: Date;

  selectedSymbol$ = this.store.pipe(select(getSelectedSymbol));
  priceQueries$ = this.store.pipe(
    select(getAllPriceQueries),
    skip(1),
    map(priceQueries =>
      priceQueries.map(priceQuery => [priceQuery.date, priceQuery.close])
        .filter((priceQuery: any) => {
          if (this.fromDate && this.toDate) {
            let date = moment(priceQuery[0]);
            let _fromDate = moment(new Date(this.fromDate), "yyyy-mm-dd");
            let _toDate = moment(new Date(this.toDate), "yyyy-mm-dd");
            return _fromDate.valueOf() <= date.valueOf() && _toDate.valueOf() >= date.valueOf();
          } else {
            return true;
          }
        })
    )
  );


  constructor(private store: Store<PriceQueryPartialState>) { }

  fetchQuote(symbol: string, period: string, fromDate: Date = null, toDate: Date = null) {
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.store.dispatch(new FetchPriceQuery(symbol, period));
    this.store.dispatch(new SelectSymbol(symbol));
  }
}
