import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NumericTransformer } from "../../util/numericTransformer";
import { Transform, TransformFnParams } from "class-transformer";
import { Categoria } from "../../categoria/entities/categoria.entity";


@Entity({name: 'tb_produtos'})
export class Produto{

    @PrimaryGeneratedColumn()
    id: number;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    @Column({length: 255, nullable:false})
    nome: string;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    @Column({length: 255, nullable:false})
    descricao: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    @IsPositive()
    @Column({ type: "decimal", precision: 10, scale: 2, transformer: new NumericTransformer() })
    preco: number;

    @IsNotEmpty()
    @IsPositive()
    estoque: number;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    @Column({length: 255, nullable:false})
    faixaEtaria: string;

    @IsNotEmpty()
    @Column({length: 5000, nullable:false})
    foto: string;

    @ManyToOne(() => Categoria,(categoria) => categoria.produto, {
        onDelete: "CASCADE"
    })
    categoria: Categoria;
}