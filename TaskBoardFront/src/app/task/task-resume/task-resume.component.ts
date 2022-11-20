import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Task } from '../models/task-model';
import { TaskListComponent } from '../task-list/task-list.component';

@Component({
  selector: 'app-task-resume',
  templateUrl: './task-resume.component.html',
  styleUrls: ['./task-resume.component.css'],
})
export class TaskResumeComponent {
  @Input() Task: Task = new Task();
  @Input() BorderColor: string = '';

  @Output()
  OnTaskChangePriority = new EventEmitter();
  ChangePriority($event: any) {
    this.Task.Priority = $event.target.value;
    this.OnTaskChangePriority.emit({
      TaskId: this.Task.Id,
      NewPriority: this.Task.Priority,
    });
  }

  @Output()
  OnTaskChangeStatus = new EventEmitter();
  ChangeStatus($event: any) {
    this.OnTaskChangeStatus.emit({
      TaskId: this.Task.Id,
      NewStatus: $event.target.value,
    });
    this.Task.Status = $event.target.value;
  }
}
