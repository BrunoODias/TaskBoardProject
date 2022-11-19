import { Component, Input } from '@angular/core';
import { Task } from '../models/task-model';

@Component({
  selector: 'app-task-resume',
  templateUrl: './task-resume.component.html',
  styleUrls: ['./task-resume.component.css']
})
export class TaskResumeComponent {
  @Input() Task:Task = new Task();

  ChangePriority($event:any){
    this.Task.Priority = $event.target.value;
  }
}
