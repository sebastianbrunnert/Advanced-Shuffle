import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import spotifyAppCredentials from "../assets/credentials.json";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    public httpClient: HttpClient,
    public router: Router
  ) {}

  title = 'Advanced Shuffle';

  spotifyAppCredentials = spotifyAppCredentials;

  spotifyAccessToken = localStorage.getItem("access_token");

  playlists = [];

  loading = false;

  readyState = "";

  advancedShufflePlaylists = 0

  getApi(url) {
    var headers = new HttpHeaders({
      "Authorization": "Bearer " + this.spotifyAccessToken
    });  

    return new Promise((resolve,reject) => {
      this.httpClient.get(url, { headers: headers }).subscribe(res => {
        resolve(res);
      }, err => {
        if(err.status == 401) {
          this.router.navigateByUrl("/login");
          reject();
        }
      })
    })
  }

  postApi(url) {
    return this.postApiWithBody(url, null);
  }

  postApiWithBody(url, body) {
    var headers = new HttpHeaders({
      "Authorization": "Bearer " + this.spotifyAccessToken
    });  

    return new Promise((resolve,reject) => {
      this.httpClient.post(url, body, { headers: headers }).subscribe(res => {
        resolve(res);
      }, err => {
        if(err.status == 401) {
          this.router.navigateByUrl("/login");
          reject(err);
        } else {
          reject(err);
        }
      })
    })
  }


  loadPlaylists(clicked, likedSongs) {
    this.loading = true;

    var thens = clicked.length; // this is the number of "collections" we have to call

    // Just Liked songs:
    if(thens == 0) {
      this.recursListLikedSongs([],0).then(res => {
        clicked.push({
          name: "Liked Songs",
          songs: Object.keys(res).map(function(song) {
            if(res[song]["track"] && res[song]["track"]["id"]) {
              return res[song]["track"]["id"]
            }
          })
        })

        this.readCheckout(clicked);
      });
    } else {
      clicked.forEach(playlist => {
        this.recursListSongsInPlaylist(playlist.id,[],0).then(res => {  
          Object.keys(res).map(function(song) {
            if(res[song]["track"] && res[song]["track"]["id"] && !playlist.songs.includes(res[song]["track"]["id"])) {
              playlist.songs.push(res[song]["track"]["id"])
            }
          });
  
          thens--; // if one collection is processed, then can be reduced by one
  
          // So if every collection has been processed, we can continue:
          if(thens == 0) {
            if(likedSongs) {
              this.recursListLikedSongs([],0).then(res => {
  
                clicked.unshift({
                  name: "Liked Songs",
                  songs: Object.keys(res).map(function(song) {
                    if(res[song]["track"] && res[song]["track"]["id"]) {
                      return res[song]["track"]["id"]
                    }
                  })
                })
                
                this.readCheckout(clicked);
                
              })
            } else {
              this.readCheckout(clicked);
            }
  
          }
        });
      })
    }
  } 

  readCheckout(clicked) {
    clicked.forEach((playlist,i) => {
      delete playlist.clicked;
      delete playlist.id;
      playlist.id = i
      playlist.percent = 100
      playlist.realPercent = Math.round(1/(clicked.length) * 100)
    })

    this.loading = false;
    this.playlists = clicked;
    this.router.navigateByUrl("create/specify");
  }

  addSongsToPlaylist(songs) {
    this.loading = true;

    songs = songs.map(song => "spotify:track:" + song);
    var chunks = [];
    for(var z = 0; z < songs.length; z += 100) {
      chunks.push(songs.slice(z,z+100));
    }

    this.getApi("https://api.spotify.com/v1/me").then(res => {
      this.postApiWithBody("https://api.spotify.com/v1/users/" + res["id"] + "/playlists", {name: "Advanced Shuffle #" + (this.advancedShufflePlaylists+1), public: false}).then(res => {
        this.recursAddSongsToPlaylist(chunks,0,res["id"]);    
      });
    })
  }

  recursAddSongsToPlaylist(chunks,index,id) {
    if(chunks.length <= index) {
      this.loading = false;
      this.readyState = "PLAYLIST";
      this.router.navigateByUrl("/create/ready");
      return;
    }

    return new Promise((resolve) => {
      this.postApi("https://api.spotify.com/v1/playlists/" + id + "/tracks?uris=" + chunks[index].join(",")).then(() => {
        resolve(this.recursAddSongsToPlaylist(chunks,index+1,id));
      });
    });
  }
  
  recursAddSongToQueue(songs,index) {
    this.loading = true;

    if(songs.length <= index) {
      this.loading = false;
      this.readyState = "QUEUE";
      this.router.navigateByUrl("/create/ready")
      return;
    }

    return new Promise((resolve) => {
      this.postApi("https://api.spotify.com/v1/me/player/queue?uri=spotify:track:" + songs[index]).then(() => {
        resolve(this.recursAddSongToQueue(songs,index+1));
      }).catch(() => {
        this.router.navigateByUrl("/create/specify")
        alert("Du hörst gerade auf keinem Gerät Musik und hast keine Warteschlange.")
      });
    });
  }

  recursListSongsInPlaylist(playlistId,songs,offset) {
    return new Promise((resolve) => {
      this.getApi("https://api.spotify.com/v1/playlists/" + playlistId + "/tracks?fields=total,items(track(id))&offset=" + offset).then(res => {
        songs.push(...res["items"]);
        if(res["total"] > songs.length) {
          resolve(this.recursListSongsInPlaylist(playlistId,songs,offset+100));
        } else {
          resolve(songs);
        }
      })
    });
  }

  recursListLikedSongs(songs,offset) {
    return new Promise((resolve) => {
      this.getApi("https://api.spotify.com/v1/me/tracks?fields=total,items(track(id))&offset=" + offset).then(res => {
        songs.push(...res["items"]);
        if(res["total"] > songs.length) {
          resolve(this.recursListLikedSongs(songs,offset+50));
        } else {
          resolve(songs);
        }
      })
    });
  }

  recursListUserPlaylists(playlists,offset) {
    return new Promise((resolve) => {
      this.getApi("https://api.spotify.com/v1/me/playlists?limit=50&offset=" + offset).then(res => {

        res["items"].forEach(playlist => {
          if(playlist["name"].startsWith("Advanced Shuffle #")) {
            this.advancedShufflePlaylists++;
          }
          playlists.push({
            id: playlist["id"],
            name: playlist["name"],
            songs: [],
            clicked: false
          })
        });
  
        if(res["total"] > offset) {
          resolve(this.recursListUserPlaylists(playlists,offset+50))
        } else {
          resolve(playlists)          
        }
  
      });
    });
  }

}
