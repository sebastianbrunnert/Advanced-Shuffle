import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CallbackComponent } from './callback/callback.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CreateComponent } from './create/create.component';
import { SpecifyComponent } from './create/specify/specify.component';
import { LoadComponent } from './create/load/load.component';
import { ReadyComponent } from './create/ready/ready.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CallbackComponent,
    HomeComponent,
    CreateComponent,
    SpecifyComponent,
    LoadComponent,
    ReadyComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: "login", component: LoginComponent },
      { path: "callback", component: CallbackComponent },
      { path: "create", component: CreateComponent },
      { path: "create/specify", component: SpecifyComponent },
      { path: "create/load", component: LoadComponent },
      { path: "create/ready", component: ReadyComponent },
      { path: "**", component: HomeComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
