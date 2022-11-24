import { Injectable } from '@angular/core';
import { Task, TaskStatus } from '../models/task-model';
import { HttpClient } from '@angular/common/http';
import Config from 'src/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskApiService {
  private _http: HttpClient;

  constructor(http: HttpClient) {
    this._http = http;
  }

  tasks: Task[] = [];

  GetTasks(): Observable<Task[]> {
    return this._http.get<Task[]>(Config.BaseApiURI + '/api/task/tasks');
  }

  UpdateTask(task: Task): Promise<Task> {
    return new Promise((resolve, reject) => {
      try {
        this._http
          .put(Config.BaseApiURI + '/api/task/edit', task)
          .subscribe(() => {
            resolve(task);
          });
      } catch (ex) {
        reject(ex);
      }
    });
  }

  DeleteTask(Id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this._http
          .delete(Config.BaseApiURI + `/api/task/delete?Id=${Id}`)
          .subscribe(() => {
            resolve(true);
          });
      } catch (ex) {
        reject(ex);
      }
    });
  }

  Save(task: Task): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        var req: Observable<Object>;
        if (task.Id != 0) {
          this.UpdateTask(task)
            .then((t) => resolve(t.Id))
            .catch((er) => reject(er));
          return;
        }

        req = this._http.post<Task>(Config.BaseApiURI + `/api/task/new`, task);

        req.subscribe((ot) => {
          var t = ot as Task;
          resolve(t.Id);
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }
}
