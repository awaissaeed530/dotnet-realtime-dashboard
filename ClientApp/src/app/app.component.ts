import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as signalR from '@microsoft/signalr';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexStroke
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('form') formRef: NgForm;

  firstSeries: number[] = [4, 5];
  secondSeries: number[] = [2, 9];

  connection!: signalR.HubConnection;

  chartOptions!: ChartOptions;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.initializeHub();
    this.initializeChart();
  }

  triggerBroadcast(values: any): void {
    this.http.post('/api/dashboard', {
      firstValue: values.firstValue,
      secondValue: values.secondValue
    }).subscribe(() => {
      this.formRef.resetForm();
    });
  }

  private initializeHub(): void {
    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl('https://localhost:5001/dashboard')
      .build();

    this.connection.start().then(() => {
      console.log('SignalR Connected!');
    }).catch(err => console.error(err.toString()));

    this.connection.on('dashboardData', (res) => {
      console.log('Broadcast message received', res);
      this.firstSeries.push(res.firstValue);
      this.secondSeries.push(res.secondValue);
      this.chartOptions.series = [
        { name: 'series1', data: this.firstSeries },
        { name: 'series2', data: this.secondSeries }
      ];
    });
  }

  private initializeChart(): void {
    this.chartOptions = {
      series: [
        { name: 'series1', data: this.firstSeries },
        { name: 'series2', data: this.secondSeries }
      ],
      chart: { height: 300, type: 'area' },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' }
    };
  }
}
