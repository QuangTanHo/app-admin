import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../../../common/translation.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(
    private router: Router,
    private translationService: TranslationService
  ) { }

  switchLanguage(event: Event): void {
    const target = event.target as HTMLSelectElement; // Cast event.target to HTMLSelectElement
    const lang = target.value; // Now you can safely access 'value'
    this.translationService.switchLanguage(lang);
  }
  logout() {
    localStorage.clear();
    this.router.navigateByUrl("/login");
  }
}
