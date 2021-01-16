import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private app: AppComponent
  ) { }

  ngOnInit(): void {
    window.location.href = "https://accounts.spotify.com/authorize" +
      "?response_type=code" +
      "&client_id=" + this.app.spotifyAppCredentials.client_id + 
      "&scope=user-library-read playlist-read-private user-modify-playback-state playlist-modify-private playlist-read-collaborative" +
      "&redirect_uri=" + this.app.spotifyAppCredentials.redirect_uri +
      "&state=" + this.generateRandomString(16)
  }

  generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
  

}
