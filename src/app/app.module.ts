import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ForgeViewerComponent } from './forge-viewer/forge-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    ForgeViewerComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
