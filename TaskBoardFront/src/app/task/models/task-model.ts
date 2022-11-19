export class Task{
    Id:number = 0;
    Title:string = '';
    Description:string = '';
    Responsable:string = '';
    Status:number = -1;
    Priority: number = 1;
}

const taskStatus = {
    Pending: 0,
    Active: 1,
    Closed: 2
}

Object.freeze(taskStatus);

export const TaskStatus = taskStatus;