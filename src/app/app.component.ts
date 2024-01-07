import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'museumExplore';

  // Variável para rastrear se a rota atual é a página de login
  isLoginPage: boolean = false;

  constructor(private router: Router) {
    // Assine eventos de navegação para detectar alterações na rota
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Atualiza a variável com base na rota atual
        this.isLoginPage = event.url.includes('/login'); // Ajuste o caminho conforme necessário
      }
    });
  }
}
