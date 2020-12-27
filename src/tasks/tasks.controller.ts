import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDTO } from './dtos/CreateTaskDTO';
import { GetTasksFilterDTO } from './dtos/GetTasksFilterDTO';
import { TaskStatusValidationPipe } from './pipes/TaskStatusValidationPipe';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { TaskStatus } from './TaskStatusEnum';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private readonly logger = new Logger('TasksController');

  constructor(private readonly tasksService: TasksService) {}

  @Get()
  index(
    @Query(ValidationPipe) filters: GetTasksFilterDTO,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User ${user.username} retrieving all tasks. Filters ${JSON.stringify(
        filters,
      )}`,
    );
    return this.tasksService.getTasks(filters, user);
  }

  // @Body() body
  // @Body('title') title: string,
  // @Body('description') description: string,

  @Post()
  @UsePipes(ValidationPipe)
  store(
    @Body() { title, description }: CreateTaskDTO,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} creating a new task. Data: ${JSON.stringify({
        title,
        description,
      })}`,
    );
    return this.tasksService.createTask({ title, description }, user);
  }

  @Get('/:id')
  show(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getById(id, user);
  }

  @Delete('/:id')
  destroy(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteById(id, user);
  }

  @Patch('/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
