import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TaskApiService } from '../task-service/task-api.service';
import { Task } from '../models/task-model';
import { ToasterService } from 'angular2-toaster';

import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
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

  constructor(
    apiService: TaskApiService,
    private _modalService: NgbModal,
    private toasterService: ToasterService
  ) {
    this.ApiService = apiService;
  }

  private RefreshTasks() {
    this.PendingTasks = this.GetTasksWithStatus(0);
    this.ActiveTasks = this.GetTasksWithStatus(1);
    this.ClosedTasks = this.GetTasksWithStatus(2);
  }

  ngOnInit() {
    this.ApiService.GetTasks().subscribe((tasks) => {
      this._tasks = tasks;
      this.RefreshTasks();
    });
  }

  private GetTasksWithStatus = (status: number): Task[] => {
    var tasks = this._tasks.filter((x) => x.Status == status);
    return tasks;
  };

  ChangeColumnEvent($event: CdkDragDrop<Task[], Task[], any>) {
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

  ChangeStatusFromCombo($event: any) {
    var task = this._tasks.find((x) => x.Id == $event.TaskId) as Task;
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

    var oldStatus = task.Status;
    task.Status = $event.NewStatus;

    this.ApiService.UpdateTask(task)
      .then(() => {
        var taskToArray =
          task.Status == 0
            ? this.PendingTasks
            : task.Status == 1
            ? this.ActiveTasks
            : this.ClosedTasks;

        transferArrayItem(taskFromArray, taskToArray, taskPreviousIndex, 0);
      })
      .catch((er) => {
        task.Status = oldStatus;
        alert(er);
      });
  }

  ChangePriorityFromCombo($event: any) {
    var task = this._tasks.find((x) => x.Id == $event.TaskId) as Task;
    if (task == null) return;
    var newPriority = Number($event.NewPriority);

    this.ApiService.UpdateTask(task)
      .then(() => {
        task.Priority = newPriority;
      })
      .catch((er) => {
        alert(er);
      });
  }

  taskToRemove: Task;
  modalTaskDelete: NgbModalRef;
  @ViewChild('contentDeletionTask') deletionTaskContent: ElementRef;
  OpenDeleteTaskConfirmation(task: Task) {
    this.taskToRemove = task;
    this.modalTaskDelete = this._modalService.open(this.deletionTaskContent);
  }

  DeleteTask(task: Task) {
    this.modalTaskDelete.close();

    this.ApiService.DeleteTask(task.Id)
      .then(() => {
        this._tasks = this._tasks.filter((x) => x != task);
        this.RefreshTasks();
        this.toasterService.pop({
          type: 'success',
          title: 'Tarefa excluída com sucesso',
        });
      })
      .catch(() => {
        this.toasterService.pop({
          type: 'error',
          title: 'Erro ao tentar excluir a tarefa',
        });
      });
  }
}
