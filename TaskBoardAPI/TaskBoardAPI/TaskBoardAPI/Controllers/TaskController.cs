using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using TaskBoardAPI.Models;

namespace TaskBoardAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [EnableCors("MyPolicy")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        public TaskController(Context ctx)
        {
            Context = ctx;
        }

        public Context Context { get; }

        [HttpGet]
        public async Task<JsonResult> Tasks()
        {
            return new JsonResult(await Context.Tasks.ToListAsync(),
                new JsonSerializerOptions ());
        }

        [HttpGet]
        public async Task<Models.Task> Task(int id)
        {
            return await Context.Tasks.FindAsync(id);
        }

        [HttpPost]
        public async Task<Models.Task> New(Models.Task task)
        {
            task.Deleted = false;
            task.Status = Models.TaskStatus.Pending;
            task.DeletionTime = null;
            task.Id = 0;
            task.CheckValidity(false);
            await Context.Tasks.AddAsync(task);
            await Context.SaveChangesAsync();
            return task;
        }

        [HttpPut]
        public async Task<JsonResult> Edit(Models.Task task)
        {
            task.Deleted = false;
            task.DeletionTime = null;
            task.CheckValidity(true);
            Context.Update(task);
            await Context.SaveChangesAsync();
            return new JsonResult(task,
                new JsonSerializerOptions()); ;
        }

        [HttpDelete]
        public async Task<Models.Task> Delete(int id)
        {
            var task = await Context.Tasks.FindAsync(id);
            task.Deleted = true;
            task.DeletionTime = DateTime.Now;
            Context.Update(task);
            await Context.SaveChangesAsync();
            return task;
        }

        [HttpPut]
        public async Task<Models.Task> ChangeStatus(int id, Models.TaskStatus status)
        {
            var task = await Context.Tasks.FindAsync(id);
            task.Status = status;
            Context.Update(task);
            await Context.SaveChangesAsync();
            return task;
        }
    }
}
