import { Component, OnInit } from '@angular/core';
import { TaskApiService } from '../task-service/task-api.service';
import { Task, TaskStatus } from '../models/task-model'
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})

export class TaskListComponent implements OnInit {
  ApiService: TaskApiService;
  private _tasks:Task[] = [];
  PendingTasks: Task[] = [];
  ActiveTasks: Task[] = [];
  ClosedTasks: Task[] = [];

  constructor(apiService:TaskApiService) { 
    this.ApiService = apiService;
  }

  async ngOnInit(): Promise<void> {
    this._tasks = await this.ApiService.GetTasks();
    this.PendingTasks = this.GetTasksWithStatus(0);
    this.ActiveTasks = this.GetTasksWithStatus(1);
    this.ClosedTasks = this.GetTasksWithStatus(2);
  }

  private GetTasksWithStatus = (status:number):Task[]=>{
    return this._tasks.filter(x=>x.Status == status);
  }

  ChangeColumnEvent($event:CdkDragDrop<Task[]>){
    if ($event.previousContainer === $event.container) {
      moveItemInArray($event.container.data, $event.previousIndex, $event.currentIndex);
    } else {
      transferArrayItem(
        $event.previousContainer.data,
        $event.container.data,
        $event.previousIndex,
        $event.currentIndex,
      );
    }
  }
}
