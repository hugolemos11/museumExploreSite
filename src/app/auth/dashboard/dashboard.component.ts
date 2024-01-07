import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { ListArtworkComponent } from '../../collection/list-artwork/list-artwork.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  title = 'MuseumExplore';
  barChart: any = [];
  doughnutChart: any = [];

  /*@ViewChild(ListArtworkComponent) listArtWorkComponent!: ListArtworkComponent;*/

  ngOnInit(): void {
    /*if (this.listArtWorkComponent) {
      const artWorkList = this.listArtWorkComponent.artWorkList;
    }*/
    this.createBarChart();
    this.createDoughnutChart();
  }

  createBarChart() {
    this.barChart = new Chart('barCanvas', {
      type: 'bar',
      data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{
          label: 'Número de pedidos',
          data: [10, 15, 12, 18, 14, 20, 25],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }

  createDoughnutChart() {
    this.doughnutChart = new Chart('doughnutCanvas', {
      type: 'doughnut',
      data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{
          label: 'Número de pedidos',
          data: [10, 15, 12, 18, 14, 20, 25],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: {
            position: 'right',
          },
          /*footer: {
            text: 'Texto abaixo do gráfico'
          }*/
        }
      }
    })
  }
}
