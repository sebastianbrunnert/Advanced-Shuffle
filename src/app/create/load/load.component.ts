import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.css']
})
export class LoadComponent implements OnInit {

  constructor(
    private app: AppComponent
  ) { }

  ngOnInit(): void {
    if(!this.app.loading) {
      this.app.router.navigateByUrl("/");
    }
  }

}
