import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { MuseumService } from '../../museums/museum.service';
import { AuthService } from '../auth.service';
import { TicketService } from '../../tickets/ticket.service';
import { Ticket, TicketType } from '../../tickets/ticket';
import { Observable, map } from 'rxjs';
import { Artwork } from '../../collection/artwork';
import { ArtworkService } from '../../collection/artwork.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  title = 'MuseumExplore';
  barChart: any = [];
  doughnutChart: any = [];

  ticketsData$: Observable<Array<Ticket>> = new Observable<Array<Ticket>>;
  ticketTypesData$: Observable<Array<TicketType>> = new Observable<Array<TicketType>>;
  artWorksData$: Observable<Array<Artwork>> = new Observable<Array<Artwork>>;
  artworkImages: string[] = [];

  constructor(private ticketService: TicketService, private artWorkService: ArtworkService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    const userDataJSON = localStorage.getItem('user');
    if (userDataJSON != null) {
      const userData = JSON.parse(userDataJSON)
      if (userData.museumId != null) {

        this.artWorksData$ = this.artWorkService.getAllArtWorksFromMuseum(userData.museumId);
        this.ticketsData$ = this.ticketService.getAllTicketsFromMuseum(userData.museumId);
        this.ticketTypesData$ = this.ticketService.getAllTicketsTypes(userData.museumId);

        // Subscribe to the observables to get the data
        this.artWorksData$.subscribe(artWorksData => {
          if (artWorksData != null) {
            // Update the --num-artworks variable
            document.documentElement.style.setProperty('--num-artworks', artWorksData.length.toString());
            this.loadImages();
            this.ticketsData$.subscribe(ticketsData => {
              if (ticketsData != null) {
                this.createBarChart(ticketsData)
                this.ticketTypesData$.subscribe(ticketTypesData => {
                  if (ticketTypesData != null) {
                    this.createDoughnutChart(ticketTypesData, ticketsData);
                  } else {
                    console.log('Ticket types data is empty!');
                  }
                });
              } else {
                console.log('Tickets data is empty!');
              }
            });
          } else {
            console.log('Art Works data is empty!');
          }
        });

      } else {
        console.log('UserData museumId is null!');
      }
    }
  }

  createBarChart(ticketsData: Ticket[]) {
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
      const ticketsCount = ticketsData.filter(ticket => {
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

  createDoughnutChart(ticketTypesData: TicketType[], ticketsData: Ticket[]) {
    // Destroy existing chart
    if (this.doughnutChart && this.doughnutChart.destroy) {
      this.doughnutChart.destroy();
    }

    const ticketTypesLabels = Array.from({ length: ticketTypesData.length }, (_, i) => {
      return ticketTypesData[i].type;
    }).reverse();

    const ticketsNumberData = Array.from({ length: ticketTypesData.length }, (_, i) => {
      const ticketsCount = ticketsData.filter(ticket => {
        return ticket.ticketTypeId === ticketTypesData[i].id;
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

  public loadImages() {
    this.artWorksData$.pipe(
      map((artworks: Artwork[]) => {
        const artWorksDatalength = artworks.length
        artworks.map((artwork: Artwork) => {
          const imageObservable = this.artWorkService.downloadFile(artwork.pathToImage);
          imageObservable.subscribe(
            imageArray => {
              this.artworkImages.push(imageArray);
            },
            error => {
              console.error(error);
              this.artworkImages = Array(artWorksDatalength).fill('../../assets/imgs/museu1.jpg');
            }
          )
        })
      }),
    ).subscribe();
  }
}
