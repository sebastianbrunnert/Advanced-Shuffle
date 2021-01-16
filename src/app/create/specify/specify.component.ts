import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-specify',
  templateUrl: './specify.component.html',
  styleUrls: ['./specify.component.css']
})
export class SpecifyComponent implements OnInit {

  public possibleSongs;
  public choosedSongs;

  constructor(
    public app: AppComponent
  ) { }

  ngOnInit(): void {
    if(this.app.playlists.length == 0) {
      this.app.router.navigateByUrl("/create");
    }

    this.possibleSongs = [...this.app.playlists.reduce((possibleSongs,{songs}) => 
      possibleSongs = new Set([...songs, ...possibleSongs]),new Set())].length;

    this.choosedSongs = this.possibleSongs;
  }

  changeValue(id,value) {
    this.app.playlists[id].percent = parseInt(value);
  
    var sum = this.app.playlists.reduce((n,{percent}) => n + percent, 0);
    
    this.app.playlists.forEach(playlist => {
      playlist.realPercent = Math.round(playlist.percent / sum * 100);
    });
  }

  changeValueSongs(value) {
    this.choosedSongs = value;
  }


  listSongs() {
    var songs = [];

    // Add minimum required amount of each playlist to the songs that will play
    this.app.playlists.forEach(playlist => {
      for(var z = 0; z < playlist.realPercent/100 * this.choosedSongs; z++) {
        if(playlist.songs.length > 0) {

          var randomSong = playlist.songs[Math.floor(Math.random() * playlist.songs.length)];

          songs.push(randomSong);
        

          // Remove a song from other playlists (and the playlist itself too)
          this.app.playlists.forEach(otherPlaylist => {
            if(otherPlaylist.songs.includes(randomSong)) {
              otherPlaylist.songs.splice(otherPlaylist.songs.indexOf(randomSong), 1);
              otherPlaylist.used += 1;
            }
          });

        }
      }
    });   

    // Shuffle the array
    for (var i = songs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }

    // Fill last places if required
    this.app.playlists.forEach(playlist => {
      playlist.songs.forEach(song => {
        if(songs.length < this.choosedSongs && !songs.includes(song)) {
          songs.push(song);
        }
      });
    })

    return songs
  }

  addToQueue() {
    this.app.recursAddSongToQueue(this.listSongs(),0).catch();
    this.app.router.navigateByUrl("/create/load")
  }

  addToPlaylist() {
    this.app.addSongsToPlaylist(this.listSongs());
    this.app.router.navigateByUrl("/create/load")
  }

}
