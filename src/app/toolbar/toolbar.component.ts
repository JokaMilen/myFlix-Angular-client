import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


// custom components
// import { ProfileViewComponent } from '../profile-view/profile-view.component';

// material modules
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar'
import { ProfileViewComponent } from '../profile-view/profile-view.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  username = localStorage.getItem('username');
  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
  ) { }

  ngOnInit(): void {
    if (!this.username || this.username === 'undefined') {
      this.router.navigate(['welcome']);
    }

  }

  /**
   * opens modal with user details
   */
  openUserProfile(): void {
    this.dialog.open(ProfileViewComponent, {
      width: '280px'
    });
  }

  /**
   * navigates to "all movies"
   */
  openAllMovies(): void {
    this.router.navigate(['movies']);
  }

  /**
   * navigates to "favoritemovies"
   */
  openFavorites(): void {
    console.log("here")
    this.router.navigate(['movies'], { queryParams: { showFavorites: true } });
  }

  /**
   * logs out the user by clearing the localstorage (username, token) and reloads the page
   * then -> redirect to welcome page
   */
  logOut(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    this.router.navigate(['welcome']);
    this.snackBar.open('Logout successful!', 'OK', {
      duration: 3000
    });
  }

}
