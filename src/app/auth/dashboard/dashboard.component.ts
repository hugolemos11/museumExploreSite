import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Observable, filter, forkJoin, map, switchMap, take } from 'rxjs';
import { Artwork } from '../../collection/artwork';
import { ArtworkService } from '../../collection/artwork.service';
import { Ticket, TicketType } from '../../ticket-type/ticket-type';
import { TicketTypeService } from '../../ticket-type/ticket-type.service';
import { Museum } from '../../museums/museum';
import { MuseumService } from '../../museums/museum.service';
import { User } from '../user';
import { CategoryService } from '../../category/category.service';
import { Category } from '../../category/category';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  title = 'MuseumExplore';
  barChart: any = [];
  doughnutChart: any = [];
  responsiveOptions: any = [];

  totalGained: number = 0;
  totalTicketsBought: number = 0;
  totalArtWorks: number = 0;

  totalMuseums: number = 0;

  ticketsData$: Observable<Array<Ticket>> = new Observable<Array<Ticket>>;
  ticketTypesData$: Observable<Array<TicketType>> = new Observable<Array<TicketType>>;
  artWorksData$: Observable<Array<Artwork>> = new Observable<Array<Artwork>>;

  categoriesData$: Observable<Array<Category>> = new Observable<Array<Category>>;
  categoriesData: Array<Category> = [];
  museumsData$: Observable<Array<Museum>> = new Observable<Array<Museum>>;
  museumsData: Array<Museum> = [];

  userData: User;

  constructor(private ticketTypeService: TicketTypeService, private artWorkService: ArtworkService, private museumService: MuseumService, private categoryService: CategoryService) {
    this.responsiveOptions = [
      {
        breakpoint: '1420px',
        numVisible: 4,
        numScroll: 2
      },
      {
        breakpoint: '1080px',
        numVisible: 3,
        numScroll: 2
      },
      {
        breakpoint: '750px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '525px',
        numVisible: 1,
        numScroll: 1
      }
    ];
    this.userData = { uid: '', email: '' };
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    const userDataJSON = localStorage.getItem('user');
    if (userDataJSON != null) {
      this.userData = JSON.parse(userDataJSON);
      if (this.userData.admin == true) {
        if (this.userData.museumId != null) {
          this.artWorksData$ = this.artWorkService.getAllArtWorksFromMuseum(this.userData.museumId).pipe(
            switchMap((artWorksData: Artwork[]) => {
              if (artWorksData != null) {

                const imageObservables = artWorksData.map((artwork: Artwork) =>
                  this.artWorkService.downloadFile(artwork.pathToImage)
                );

                return forkJoin(imageObservables).pipe(
                  map((imageArrays: string[]) => {
                    artWorksData.forEach((artwork, index) => {
                      artwork.image = imageArrays[index];
                    });
                    return artWorksData;
                  })
                );
              } else {
                console.log('Art Works data is empty!');
                return [];
              }
            })
          );

          this.artWorksData$.subscribe((artWorksData) => {
            this.totalArtWorks = artWorksData.length;
          })

          this.ticketsData$ = this.ticketTypeService.getAllTicketsFromMuseumFiltered(this.userData.museumId);
          this.ticketTypesData$ = this.ticketTypeService.getAllTicketsTypesFromMuseum(this.userData.museumId);

          this.ticketsData$.subscribe(ticketsData => {
            if (ticketsData != null) {
              this.countTotalTicketsBought(ticketsData)
              this.createBarChartMuseum(ticketsData);
              this.ticketTypesData$.subscribe(ticketTypesData => {
                if (ticketTypesData != null) {
                  this.countTotalGained(ticketTypesData, ticketsData);
                  this.createDoughnutChartMuseum(ticketTypesData, ticketsData);
                } else {
                  console.log('Ticket types data is empty!');
                }
              });
            } else {
              console.log('Tickets data is empty!');
            }
          });
        } else {
          this.museumsData$ = this.museumService.getAllMuseums().pipe(
            switchMap((museumsData: Museum[]) => {
              if (museumsData != null) {

                const imageObservables = museumsData.map((museum: Museum) =>
                  this.museumService.downloadFile(museum.pathToImage)
                );

                return forkJoin(imageObservables).pipe(
                  map((imageArrays: string[]) => {
                    museumsData.forEach((museum, index) => {
                      museum.image = imageArrays[index];
                    });
                    this.museumsData = museumsData
                    return museumsData;
                  })
                );
              } else {
                console.log('Museums data is empty!');
                return [];
              }
            })
          );

          this.museumsData$.subscribe((museumsData) => {
            this.totalMuseums = museumsData.length;
          });

          this.artWorksData$ = this.artWorkService.getAllArtWorks().pipe(
            switchMap((artWorksData: Artwork[]) => {
              if (artWorksData != null) {

                const imageObservables = artWorksData.map((artwork: Artwork) =>
                  this.artWorkService.downloadFile(artwork.pathToImage)
                );

                return forkJoin(imageObservables).pipe(
                  map((imageArrays: string[]) => {
                    artWorksData.forEach((artwork, index) => {
                      artwork.image = imageArrays[index];
                    });
                    return artWorksData;
                  })
                );
              } else {
                console.log('Art Works data is empty!');
                return [];
              }
            })
          );

          this.artWorksData$.subscribe((artWorksData) => {
            this.totalArtWorks = artWorksData.length;
          })

          this.categoriesData$ = this.categoryService.getAllCategories();
          this.categoriesData$.subscribe((categoriesData) => {
            this.categoriesData = categoriesData;
          });

          this.ticketsData$ = this.ticketTypeService.getAllTickets();
          this.ticketTypesData$ = this.ticketTypeService.getAllTicketsTypes();

          // just run this code when the museumData is fetch
          this.museumsData$.pipe(
            filter(museumsData => museumsData.length > 0),  // Filter out empty arrays
            take(1),  // Take only the first emission
            switchMap(() => this.ticketsData$)
          ).subscribe(ticketsData => {
            if (ticketsData != null) {
              this.countTotalTicketsBought(ticketsData);
              this.createBarChart(ticketsData);

              this.ticketTypesData$.subscribe(ticketTypesData => {
                if (ticketTypesData != null) {
                  this.countTotalGained(ticketTypesData, ticketsData);
                  this.createDoughnutChart(ticketsData);
                } else {
                  console.log('Ticket types data is empty!');
                }
              });
            } else {
              console.log('Tickets data is empty!');
            }
          });
        }
      } else {
        console.log('UserData admin is false!');
      }
    }
  }

  getCategoryDescription(categoryId: string): string {
    if (this.categoriesData) {
      const matchingCategory = this.categoriesData.find(category => category.id === categoryId);

      if (matchingCategory) {
        return matchingCategory.description;
      }
    }

    return '';
  }

  createBarChartMuseum(ticketsData: Ticket[]) {
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

      const totalAmount = ticketsData
        .filter((ticket) => {
          const ticketDate = new Date(ticket.purchaseDate);
          return ticketDate.toISOString().split('T')[0] === day.toISOString().split('T')[0];
        })
        .reduce((sum, ticket) => sum + (ticket.amount || 0), 0);

      return totalAmount;
    }).reverse();

    this.barChart = new Chart('barCanvas', {
      type: 'bar',
      data: {
        labels: daysLabels,
        datasets: [{
          label: 'Bilhetes Comprados',
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

  createDoughnutChartMuseum(ticketTypesData: TicketType[], ticketsData: Ticket[]) {
    // Destroy existing chart
    if (this.doughnutChart && this.doughnutChart.destroy) {
      this.doughnutChart.destroy();
    }

    const ticketTypesLabels = Array.from({ length: ticketTypesData.length }, (_, i) => {
      return ticketTypesData[i].type;
    }).reverse();
    const ticketsNumberData = ticketTypesData.map((ticketType) => {
      const totalAmount = ticketsData
        .filter((ticket) => ticket.typeId === ticketType.id)
        .reduce((sum, ticket) => sum + (ticket.amount || 0), 0);

      return totalAmount;
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
        }
      }
    })
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

      const totalAmount = ticketsData
        .filter((ticket) => {
          const ticketDate = new Date(ticket.purchaseDate);
          return ticketDate.toISOString().split('T')[0] === day.toISOString().split('T')[0];
        })
        .reduce((sum, ticket) => sum + (ticket.amount || 0), 0);

      return totalAmount;
    }).reverse();

    this.barChart = new Chart('barCanvas', {
      type: 'bar',
      data: {
        labels: daysLabels,
        datasets: [{
          label: 'Bilhetes Comprados',
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

  createDoughnutChart(ticketsData: Ticket[]) {
    // Destroy existing chart
    if (this.doughnutChart && this.doughnutChart.destroy) {
      this.doughnutChart.destroy();
    }

    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    // Filter tickets bought in the past 7 days
    const recentTicketsData = ticketsData.filter(ticket => new Date(ticket.purchaseDate) >= sevenDaysAgo);

    // Group tickets by museum
    const ticketsByMuseum: { [key: string]: number } = {};
    recentTicketsData.forEach(ticket => {
      const museumId = ticket.museumId; // Assuming there's a museumId property in Ticket
      if (!ticketsByMuseum[museumId]) {
        ticketsByMuseum[museumId] = 0;
      }
      ticketsByMuseum[museumId] += ticket.amount || 0;
    });

    // Get museum labels (names) based on museum IDs
    const museumIds = Object.keys(ticketsByMuseum);
    const museumLabels = museumIds.map(museumId => {
      console.log(this.museumsData)
      const museum = this.museumsData.find(museum => museum.id === museumId);
      return museum ? museum.name : 'Unknown Museum';
    });
    const ticketsNumberData = Object.values(ticketsByMuseum);

    this.doughnutChart = new Chart('doughnutCanvas', {
      type: 'doughnut',
      data: {
        labels: museumLabels,
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
        }
      }
    });
  }

  countTotalTicketsBought(ticketsData: Ticket[]) {
    this.totalTicketsBought = ticketsData.reduce((total, ticket) => total + ticket.amount, 0);
  }

  countTotalGained(ticketTypesData: TicketType[], ticketsData: Ticket[]) {
    this.totalGained = ticketsData.reduce((total, ticketData) => {
      const ticketTypeData = ticketTypesData.find(type => type.id === ticketData.typeId);
      if (ticketTypeData) {
        return total + ticketData.amount * ticketTypeData.price;
      } else {
        return total; // Handle the case where the ticket type is not found
      }
    }, 0);
  }
}
