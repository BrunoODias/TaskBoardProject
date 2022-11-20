import { Component, OnInit } from '@angular/core';
import { TaskApiService } from '../task-service/task-api.service';
import { Task, TaskStatus } from '../models/task-model';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  Instance: TaskListComponent = this;
  ApiService: TaskApiService;
  private _tasks: Task[] = [];
  PendingTasks: Task[] = [];
  ActiveTasks: Task[] = [];
  ClosedTasks: Task[] = [];

  constructor(apiService: TaskApiService) {
    this.ApiService = apiService;
  }

  private RefreshTasks() {
    this.PendingTasks = this.GetTasksWithStatus(0);
    this.ActiveTasks = this.GetTasksWithStatus(1);
    this.ClosedTasks = this.GetTasksWithStatus(2);
  }

  async ngOnInit(): Promise<void> {
    this._tasks = await this.ApiService.GetTasks();
    this.RefreshTasks();
  }

  private GetTasksWithStatus = (status: number): Task[] => {
    return this._tasks.filter((x) => x.Status == status);
  };

  async ChangeColumnEvent($event: CdkDragDrop<Task[]>) {
    var taskId = $event.container.data[$event.previousIndex];
    if ($event.previousContainer === $event.container) {
      moveItemInArray(
        $event.container.data,
        $event.previousIndex,
        $event.currentIndex
      );
    } else {
      transferArrayItem(
        $event.previousContainer.data,
        $event.container.data,
        $event.previousIndex,
        $event.currentIndex
      );
    }
  }

  ChangeStatusTaskFromCombo($event: any) {
    var task = this._tasks.find((x) => x.Id == $event.TaskId);
    if (task == null) return;

    var taskFromArray =
      task.Status == 0
        ? this.PendingTasks
        : task.Status == 1
        ? this.ActiveTasks
        : this.ClosedTasks;

    var taskPreviousIndex = taskFromArray.findIndex(
      (x) => x.Id == $event.TaskId
    );

    task.Status = $event.NewStatus;

    var taskToArray =
      task.Status == 0
        ? this.PendingTasks
        : task.Status == 1
        ? this.ActiveTasks
        : this.ClosedTasks;

    transferArrayItem(taskFromArray, taskToArray, taskPreviousIndex, 0);
  }

  ChangePriorityTaskFromCombo($event: any) {
    var task = this._tasks.find((x) => x.Id == $event.TaskId);
    if (task != null) task.Priority = $event.NewPriority;
  }
}
