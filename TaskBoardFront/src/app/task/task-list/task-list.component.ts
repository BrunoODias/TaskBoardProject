import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TaskApiService } from '../task-service/task-api.service';
import { Task, TaskPriority, TaskStatus } from '../models/task-model';
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

  CreateNewTask() {
    this.OpenCreateOrEditModal(new Task());
  }

  taskToUpdateOrInsert: Task;
  taskToUpdateOrInsertBeforeChanges: Task;
  modalCreateOrEdit: NgbModalRef;
  @ViewChild('createOrEditModal') createOrEditContent: ElementRef;
  OpenCreateOrEditModal(task: Task) {
    if (task == null) {
      task = new Task();
      task.Priority = TaskPriority.None;
      task.Status = TaskStatus.Pending;
    }

    this.taskToUpdateOrInsert = task;
    this.taskToUpdateOrInsertBeforeChanges = JSON.parse(JSON.stringify(task));
    this.modalCreateOrEdit = this._modalService.open(this.createOrEditContent);
  }

  CancelTaskChanges() {
    this.taskToUpdateOrInsert.CreationTime =
      this.taskToUpdateOrInsertBeforeChanges.CreationTime;
    this.taskToUpdateOrInsert.Description =
      this.taskToUpdateOrInsertBeforeChanges.Description;
    this.taskToUpdateOrInsert.Priority =
      this.taskToUpdateOrInsertBeforeChanges.Priority;
    this.taskToUpdateOrInsert.Responsable =
      this.taskToUpdateOrInsertBeforeChanges.Responsable;
    this.taskToUpdateOrInsert.Status =
      this.taskToUpdateOrInsertBeforeChanges.Status;
    this.taskToUpdateOrInsert.Title =
      this.taskToUpdateOrInsertBeforeChanges.Title;
    this.CloseCreateOrEditModal();
  }

  CloseCreateOrEditModal() {
    this.modalCreateOrEdit.close();
  }

  SaveTask(task: Task) {
    task.Priority = Number(task.Priority);
    task.Status = Number(task.Status);
    this.ApiService.Save(task)
      .then((taskId) => {
        if (task.Id == 0) {
          task.Status = 0;
          task.Id = taskId;
          this._tasks.push(task);
        }

        this.RefreshTasks();
        this.CloseCreateOrEditModal();
        this.toasterService.pop({
          type: 'success',
          title: `Tarefa ${
            task.Id == 0 ? 'adicionada' : 'editada'
          } com sucesso`,
        });
        console.log('tarefa salva: ', task);
      })
      .catch(() => {
        this.toasterService.pop({
          type: 'error',
          title: `Erro ao tentar ${
            task.Id == 0 ? 'adicionar' : 'editar'
          } a tarefa`,
        });
      });
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
