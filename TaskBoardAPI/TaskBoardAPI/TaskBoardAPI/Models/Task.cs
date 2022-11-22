using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TaskBoardAPI.Models
{
    public class Task
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Responsable { get; set; }
        public TaskPriority Priority { get; set; }
        public TaskStatus Status { get; set; }
        public bool Deleted { get; set; }
        public DateTime? DeletionTime { get; set; }

        internal void CheckValidity(bool IsUpdate)
        {
            if(Status == TaskStatus.Closed && IsUpdate)
                throw new Exception("Não é possível atualizar uma tarefa concluída");

            if (IsUpdate && Id == 0)
                throw new Exception("Não foi possível identificar a tarefa para a atualização");

            if(string.IsNullOrWhiteSpace(Title))
                throw new Exception("Dê um título para a tarefa");

            if(string.IsNullOrWhiteSpace(Description))
                throw new Exception("Dê uma descrição para a tarefa");

            if(string.IsNullOrWhiteSpace(Responsable))
                throw new Exception("Infrme o responsável para a tarefa");
        }
    }

    public enum TaskStatus
    {
        Pending = 0,
        Active = 1,
        Closed = 2
    }
    public enum TaskPriority
    {
        None = 1,
        low = 2,
        Medium = 3,
        Height = 4,
        Urgent = 5
    }
}
