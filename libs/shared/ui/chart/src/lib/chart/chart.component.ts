import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'coding-challenge-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @Input() data$: Observable<any>;
  @Input() symbol$: Observable<any>;

  chart: {
    title: string;
    type: string;
    data: any;
    columnNames: string[];
    options: any;
  };
  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {

    this.symbol$.subscribe((symbol: string) => {
      if (this.chart) {
        this.chart.options.title = symbol.toUpperCase() + ` Stock price`
      }
    });

    this.chart = {
      title: '',
      type: 'LineChart',
      data: [],
      columnNames: ['period', 'close'],
      options: { title: `Stock price`, width: '900', height: '500' }
    };

    this.data$.subscribe(newData => (this.chart.data = newData));
  }
}
