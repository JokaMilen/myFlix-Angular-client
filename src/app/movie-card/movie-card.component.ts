import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'
import { ToolbarComponent } from '../toolbar/toolbar.component'
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

import { GenreViewComponent } from '../genre-view/genre-view.component';
import { DirectorViewComponent } from '../director-view/director-view.component';
import { SynopsisViewComponent } from '../synopsis-view/synopsis-view.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];
  showOnlyFavorites: boolean = false;
  constructor(public fetchApiData: FetchApiDataService, public dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.showOnlyFavorites = params.showFavorites || false;
      if (this.showOnlyFavorites) {
        this.loadMovies(true);
      } else {
        this.loadMovies(false);
      }
    });

  }

  loadMovies(favoritesOnly: boolean): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any[]) => {
      var username = localStorage.getItem('username') || "";
      this.fetchApiData.getUser(username).subscribe((userInfo: any) => {
        console.log(userInfo);
        resp.forEach(movie => {
          let isFavorite = userInfo.FavoriteMovies.find((fmId: string) => movie._id === fmId) ? true : false;
          movie.isFavorite = isFavorite;

          if (favoritesOnly) {
            this.movies = resp.filter(movie => movie.isFavorite);
          } else {
            this.movies = resp;
          }
        });
      });
    });
  }

  openGenreDialog(genreName: string): void {
    this.fetchApiData.getGenre(genreName).subscribe((resp: any) => {
      this.dialog.open(GenreViewComponent, {
        width: '280px',
        data: {
          genre: resp
        }
      });
    });
  }

  openDirectorDialog(directorName: string): void {
    this.fetchApiData.getDirector(directorName).subscribe((resp: any) => {
      this.dialog.open(DirectorViewComponent, {
        width: '280px',
        data: {
          director: resp
        }
      });
    });
  }

  openSynopsisDialog(description: string): void {
    this.dialog.open(SynopsisViewComponent, {
      width: '280px',
      data: {
        synopsis: description
      }
    });
  }

  toggleFavorite(movie: any) {
    var username = localStorage.getItem('username') || "";
    if (!movie.isFavorite) {
      this.fetchApiData.addToFavorites(username, movie._id).subscribe((resp: any) => {
        movie.isFavorite = true;
      });
    } else {
      this.fetchApiData.removeFromFavorites(username, movie._id).subscribe((resp: any) => {
        movie.isFavorite = false;
        if (this.showOnlyFavorites) {
          this.movies = this.movies.filter(m => m._id !== movie._id)
        }
      });
    }
  }

  onWheel(event: WheelEvent): void {
    // var parent = (<Element>event.target).parentElement;
    // if (parent != null) {
    //   parent.scrollLeft += event.deltaY;
    //   event.preventDefault();
    // }
  }
}
