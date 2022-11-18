import { Injectable } from '@angular/core';
import { Task, TaskStatus } from '../models/task-model'

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {

  constructor() { }

  tasks:Task[] = [];

  async GetTasks(){
    for(var i = 0; i<9; i++){
      var task = new Task();
      task.Id = i;
      task.Description = `Descrição Task ${i}`;
      task.Title = `Título Task ${i}`;
      task.Responsable = `Responsável ${i}`;
      task.Status = i % 3 == 0? TaskStatus.Closed : i % 2 == 0? TaskStatus.Active : TaskStatus.Pending;
      this.tasks.push(task);
    }

    return this.tasks;
  }
}
