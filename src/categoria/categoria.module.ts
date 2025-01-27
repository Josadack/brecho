
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { CategoriaController } from './controller/categoria.controller';
import { CategoriaService } from './services/categoria.service';

@Module({
    imports:[TypeOrmModule.forFeature([Categoria])], 
    controllers: [CategoriaController],
    providers: [CategoriaService],
    exports: [TypeOrmModule, CategoriaService]
})
export class CategoriaModule {};