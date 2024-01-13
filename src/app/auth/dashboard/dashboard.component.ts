import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { ListArtworkComponent } from '../../collection/list-artwork/list-artwork.component';
import { MuseumService } from '../../museums/museum.service';
import { AuthService } from '../auth.service';
import { Museum } from '../../museums/museum';
import { TicketService } from '../../tickets/ticket.service';
import { Ticket, TicketType } from '../../tickets/ticket';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  title = 'MuseumExplore';
  barChart: any = [];
  doughnutChart: any = [];

  ticketsData: Array<Ticket> = [];
  ticketTypesData: Array<TicketType> = [];

  constructor(private museumService: MuseumService, private authService: AuthService, private ticketService: TicketService) { }

  /*@ViewChild(ListArtworkComponent) listArtWorkComponent!: ListArtworkComponent;*/

  ngOnInit(): void {
    /*if (this.listArtWorkComponent) {
      const artWorkList = this.listArtWorkComponent.artWorkList;
    }*/
    if (this.authService.userData?.museumId != null) {
      this.ticketService.getAllTicketsFromMuseum(this.authService.userData?.museumId).subscribe((data) => {
        if (data != null) {
          this.ticketsData = data;
          console.log(this.ticketsData)
          this.createBarChart();
        } else {
          console.log('Data ID is empty.');
        }
      }, (error) => {
        console.error('Error fetching tickets data:', error);
      });

      this.ticketService.getAllTicketsTypes(this.authService.userData?.museumId).subscribe((data) => {
        if (data != null) {
          this.ticketTypesData = data;
          console.log(this.ticketTypesData)
          this.createDoughnutChart();
        } else {
          console.log('Data ID is empty.');
        }
      }, (error) => {
        console.error('Error fetching ticket types data:', error);
      });
    } else {
      console.log('UserData museumId is null!');
    }
  }

  createBarChart() {
    // Destroy existing chart
    if (this.barChart && this.barChart.destroy) {
      this.barChart.destroy();
    }

    const currentDate = new Date();
    const daysLabels = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(currentDate);
      day.setDate(currentDate.getDate() - i);
      return `${day.getDate()}/${day.getMonth() + 1}`;
    }).reverse();

    const ticketsNumberData = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(currentDate);
      day.setDate(currentDate.getDate() - i);
      const ticketsCount = this.ticketsData.filter(ticket => {
        console.log(`${ticket.purchaseDate.toISOString().split('T')[0]} | ${day.toISOString().split('T')[0]}`)
        return ticket.purchaseDate.toISOString().split('T')[0] === day.toISOString().split('T')[0];
      }).length;
      return ticketsCount;
    }).reverse();

    this.barChart = new Chart('barCanvas', {
      type: 'bar',
      data: {
        labels: daysLabels,
        datasets: [{
          label: 'Tickets Bought',
          data: ticketsNumberData,
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
    // Destroy existing chart
    if (this.doughnutChart && this.doughnutChart.destroy) {
      this.doughnutChart.destroy();
    }

    const ticketTypesLabels = Array.from({ length: this.ticketTypesData.length }, (_, i) => {
      return this.ticketTypesData[i].type
    }).reverse();

    const ticketsNumberData = Array.from({ length: this.ticketTypesData.length }, (_, i) => {
      const ticketsCount = this.ticketsData.filter(ticket => {
        console.log(`${ticket.ticketTypeId} | ${this.ticketTypesData[i].id}`)
        return ticket.ticketTypeId === this.ticketTypesData[i].id;
      }).length;
      return ticketsCount;
    }).reverse();

    this.doughnutChart = new Chart('doughnutCanvas', {
      type: 'doughnut',
      data: {
        labels: ticketTypesLabels,
        datasets: [{
          label: 'Número de pedidos',
          data: ticketsNumberData,
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
