import { Injectable, NotFoundException } from '@nestjs/common';
import { Like, Repository } from "typeorm";
import { TodoEntity } from './Entity/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateTodoDto } from './update-todo.dto';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { SearchTodoDto } from './dto/search-todo.dto';

@Injectable()
export class TodoService {

  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
  ) { }
  addTodo(todo: Partial<TodoEntity>): Promise<TodoEntity> {
    return this.todoRepository.save(todo);
  }

  async updateTodo(
    updateTodoDto: UpdateTodoDto,
    id: string,
  ): Promise<TodoEntity> {
    const newTodo = await this.todoRepository.preload({ id, ...updateTodoDto });
    if (newTodo) {
      return this.todoRepository.save(newTodo);
    } else {
      throw new NotFoundException(`Le todo d'id ${id} n'existe pas `);
    }
  }

  async deleteTodo(id: string): Promise<DeleteResult> {
    const result = await this.todoRepository.delete(id);
    if (result.affected) {
      return result;
    }
    throw new NotFoundException(`Le todo d'id ${id} n'existe pas `);
  }
  async softDeleteTodo(id: string): Promise<UpdateResult> {
    const result = await this.todoRepository.softDelete(id);
    if (result.affected) {
      return result;
    }
    throw new NotFoundException(`Le todo d'id ${id} n'existe pas `);
  }

  async softRestoreTodo(id: string) {
    const result = await this.todoRepository.restore(id);
    if (result.affected) {
      return result;
    }
    throw new NotFoundException(`Le todo d'id ${id} n'existe pas `);
  }

  findAll(searchTodoDto: SearchTodoDto, t: number, s: number): Promise<TodoEntity[]> {
    const take = t || 0;
    const skip = s || 0;
    const queryBuilder = this.todoRepository.createQueryBuilder();
    if (searchTodoDto.status && searchTodoDto.criteria) {
      return queryBuilder.where("name LIKE :criteria", { criteria: '%' + searchTodoDto.criteria + '%' }).orWhere("description LIKE :criteria", { criteria: '%' + searchTodoDto.criteria + '%' }).andWhere("status = :status", { status: searchTodoDto.status }).take(take).skip(skip).getMany();
    }
    if (searchTodoDto.criteria) {
      return queryBuilder.where("name LIKE :criteria", { criteria: '%' + searchTodoDto.criteria + '%' }).orWhere("description LIKE :criteria", { criteria: '%' + searchTodoDto.criteria + '%' }).take(take).skip(skip).getMany();
    }
    if (searchTodoDto.status) {
      return queryBuilder.where("status = :status", { status: searchTodoDto.status }).take(take).skip(skip).getMany();
    }
  }


  getStats(dateDebut: Date, dateFin: Date) {
    const queryBuilder = this.todoRepository.createQueryBuilder();
    console.log(dateDebut);
    console.log(dateFin);
    if (dateDebut && dateFin) {
      return queryBuilder.select("status, count(createdAt) as count").where("createdAt BETWEEN :dateDebut AND :dateFin", { dateDebut: dateDebut, dateFin: dateFin }).groupBy("status").getRawMany();

    }
    return queryBuilder.select("status, count(createdAt) as count").groupBy("status").getRawMany();

  }
}
