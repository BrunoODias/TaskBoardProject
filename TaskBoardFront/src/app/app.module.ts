import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskApiService } from './task/task-service/task-api.service';
import { TaskListComponent } from './task/task-list/task-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TaskResumeComponent } from './task/task-resume/task-resume.component';
import { BrowserModule } from '@angular/platform-browser';
import { ToasterModule } from 'angular2-toaster';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, TaskListComponent, TaskResumeComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DragDropModule,
    ToasterModule.forRoot(),
    FormsModule,
    BrowserAnimationsModule,
  ],
  providers: [TaskApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
