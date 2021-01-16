import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private app: AppComponent,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      var code = params["code"];

      var url = "https://accounts.spotify.com/api/token" +
        "?grant_type=authorization_code" + 
        "&code=" + code +
        "&redirect_uri=" + this.app.spotifyAppCredentials.redirect_uri +
        "&client_id=" + this.app.spotifyAppCredentials.client_id +
        "&client_secret=" + this.app.spotifyAppCredentials.client_secret;

      var headers = new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      });  

      this.app.httpClient.post(url, null, { headers: headers }).subscribe(res => {
        localStorage.setItem("access_token", res["access_token"]);
        this.app.spotifyAccessToken = res["access_token"];
        this.app.router.navigateByUrl("create")
      })

    });
  }

}
