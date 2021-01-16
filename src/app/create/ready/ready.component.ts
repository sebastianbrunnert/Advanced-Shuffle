import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-ready',
  templateUrl: './ready.component.html',
  styleUrls: ['./ready.component.css']
})
export class ReadyComponent implements OnInit {

  constructor(
    public app: AppComponent
  ) { }

  ngOnInit(): void {
    if(this.app.readyState == "") {
      this.app.router.navigateByUrl("/");
    }
  }

}
