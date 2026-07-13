import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-sidebar-footer',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  templateUrl: './sidebar-footer.html',
  styleUrls: ['./sidebar-footer.css']
})
export class SidebarFooterComponent implements OnInit {

  darkMode = false;

  version = '1.0.0';
  systemName = 'Nexus Inventory';

  ngOnInit(): void {

    const theme = localStorage.getItem('theme');

    if (theme === 'dark') {
      this.darkMode = true;
      document.body.classList.add('dark-theme');
    }

  }

  toggleTheme(isDark: boolean): void {

  console.log('Switch:', isDark);

  this.darkMode = isDark;

  if (isDark) {

    document.body.classList.add('dark-theme');

    console.log(document.body.className);

    setTimeout(() => {
      console.log('1 segundo después:', document.body.className);
    },1000);

  } else {

    document.body.classList.remove('dark-theme');

    console.log(document.body.className);

  }

}

}