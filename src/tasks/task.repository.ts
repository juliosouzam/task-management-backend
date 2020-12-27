import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './dtos/CreateTaskDTO';
import { GetTasksFilterDTO } from './dtos/GetTasksFilterDTO';
import { Task } from './task.entity';
import { TaskStatus } from './TaskStatusEnum';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private readonly logger = new Logger('TaskRepository');

  async getTasks(
    { status, search }: GetTasksFilterDTO,
    user: User,
  ): Promise<Task[]> {
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();

      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user ${
          user.username
        }. FILTERS: ${JSON.stringify({
          status,
          search,
        })}`,
        error.stack,
      );

      throw new InternalServerErrorException('');
    }
  }

  async createTask(
    { title, description }: CreateTaskDTO,
    user: User,
  ): Promise<Task> {
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    try {
      await this.save(task);
    } catch (error) {
      this.logger.error(
        `Failurd to create a task for user ${
          user.username
        }. Data: ${JSON.stringify({ title, description })}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    delete task.user;

    return task;
  }
}
