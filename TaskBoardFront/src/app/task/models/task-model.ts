export class Task {
  Id: number = 0;
  Title: string = '';
  Description: string = '';
  Responsable: string = '';
  Status: number = -1;
  Priority: number = 1;
  CreationTime: Date;
}

const taskStatus = {
  Pending: 0,
  Active: 1,
  Closed: 2,
};

Object.freeze(taskStatus);

export const TaskStatus = taskStatus;

const taskPriority = {
  None: 1,
  Low: 2,
  Medium: 3,
  High: 4,
  Urgent: 5,
};

Object.freeze(taskPriority);

export const TaskPriority = taskPriority;
