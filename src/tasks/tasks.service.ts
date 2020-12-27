import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';

import { CreateTaskDTO } from './dtos/CreateTaskDTO';
import { GetTasksFilterDTO } from './dtos/GetTasksFilterDTO';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './TaskStatusEnum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  async getTasks(filters: GetTasksFilterDTO, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filters, user);
  }

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async createTask(
    { title, description }: CreateTaskDTO,
    user: User,
  ): Promise<Task> {
    return this.taskRepository.createTask({ title, description }, user);
  }

  async getById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!task) {
      throw new NotFoundException(`Task not found!`);
    }

    return task;
  }
  async deleteById(id: string, user: User): Promise<void> {
    // const task = await this.getById(id);

    // await task.remove();

    const result = await this.taskRepository.delete({ id, userId: user.id });

    if (!result.affected) {
      throw new NotFoundException(`Task not found!`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getById(id, user);
    task.status = status;

    await task.save();

    return task;
  }
}
