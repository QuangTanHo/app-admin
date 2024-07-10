import { Component, OnInit } from '@angular/core';
import { MenuModel, Menus } from '../../../menu';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuPipe } from '../../../common/pipes/menu.pipe';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-main-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, MenuPipe],
  templateUrl: './main-sidebar.component.html',
  styleUrl: './main-sidebar.component.css'
})
export class MainSidebarComponent  implements OnInit {
  search: string = "";
  menus = Menus;
  filteredMenu :MenuModel[] = [];

  constructor(
    public auth: AuthService
  ){}
  ngOnInit(): void {
    this.filteredMenu = this.filterMenu(this.menus);
    console.log(this.filteredMenu);
    
  }

  filterMenu(menu: MenuModel[]): MenuModel[] {
    return menu
      .filter(item => this.hasAccess(item.roles))
      .map(item => {
        const filteredItem = { ...item };
        if (item.subMenus.length > 0) {
          filteredItem.subMenus = this.filterMenu(item.subMenus);
        }
        return filteredItem;
      });
  }

  hasAccess(roles: string[]): boolean {
    return roles.some(role => this.auth.hasRole(role));
  }
}
