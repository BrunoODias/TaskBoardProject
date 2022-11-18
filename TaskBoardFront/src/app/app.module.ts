import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskApiService } from './task/task-service/task-api.service';
import { TaskListComponent } from './task/task-list/task-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop'

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule
  ],
  providers: [
    TaskApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
