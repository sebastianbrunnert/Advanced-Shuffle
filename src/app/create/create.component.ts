import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  public playlists;

  public likedSongs = false;

  constructor(
    private app: AppComponent,
  ) { }

  ngOnInit(): void {
    this.app.recursListUserPlaylists([],0).then(res => {
      this.playlists = res;
    });
  }

  read() {
    var clicked = this.playlists.filter(playlist => playlist.clicked);
    if(clicked.length == 0 && !this.likedSongs) {
      document.getElementById("alert").innerHTML = "Du hast nichts für deinen Shuffle ausgewählt.";
      document.getElementById("alert").style.display = "block";
      return;
    }
    document.getElementById("alert").style.display = "none";

    this.app.loadPlaylists(clicked, this.likedSongs);
    this.app.router.navigateByUrl("/create/load")
  }


}
