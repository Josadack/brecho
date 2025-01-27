import { InjectRepository } from "@nestjs/typeorm";
import { Produto } from "../entities/produto.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DeleteResult, ILike, Repository } from "typeorm";
import { CategoriaService } from "../../categoria/services/categoria.service";

@Injectable()
export class ProdutoService{
    constructor(
        @InjectRepository(Produto)
        private produtoRespository: Repository<Produto>,
        private categoriaService: CategoriaService
    ){}

    async findAll(): Promise<Produto[]>{
        return this.produtoRespository.find({
            relations: {categoria: true}
        })
    }

    async findById(id: number): Promise<Produto>{
        const produto = await this.produtoRespository.findOne({
            where:{id},
            relations: {categoria: true}
        })
        if(!produto)
            throw new HttpException('⚠️ Produto não Encontrado! ⛓️‍💥', HttpStatus.NOT_FOUND)

        return produto;
    }

    async findByDescricao(descricao: string): Promise<{mensagem: string, produto: Produto[]}>{
        const produto = await this.produtoRespository.find({
            where: {
                descricao: ILike(`%${descricao}%`)
            }, relations :{ categoria: true}
        });

        const mensagem = produto.length > 0
        ? `🆗 Encontramos ${produto.length} produto(s) com '${descricao}'.`
        : `⛔ Nenhum produto encontrado com a descrição ${descricao}`

        return {mensagem, produto}
    }

    async create(produto: Produto): Promise<Produto>{
        
        //Verifica se o Id da categoria existe para poder cadastrar o Produto que está associado 
        await this.categoriaService.findById(produto.categoria.id)

        return await this.produtoRespository.save(produto)
    }


    async update(produto: Produto): Promise<Produto>{

        //Verifica se o Id não existe ou é maior que 0
        if(!produto.id || produto.id < 0)
            throw new HttpException('⚠️ ID não localizado', HttpStatus.BAD_REQUEST)
      
        //Verifica se o Id da categoria existe para poder fazer a atualização
        await this.categoriaService.findById(produto.categoria.id)

        return await this.produtoRespository.save(produto)
    }

    async delete(id: number): Promise<DeleteResult>{

        //Verifica se o ID existe 
        await this.findById(id)

        const del = await this.produtoRespository.delete(id);

        if(id)
            throw new HttpException("Produto Deletado com Sucesso!🆗", HttpStatus.OK)
         return del
         }

         //Métodos Especial
         async produtoPorCategoria(produto: string): Promise<any>{
            const results = await this.produtoRespository.createQueryBuilder('produto')
            .innerJoin('produto.categoria', 'categoria')
            .where('categoria.nome LIKE  :nome', {nome: `%${produto}%`})
            .select(['categoria.nome As Categoria', 'produto.nome As Nome', 'produto.preco As Preço', 'produto.faixaEtaria As Faixa_Etaria' ])
            .getRawMany(); 
            if (!results || results.length === 0) {  
                throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);  
              }  
            
              return {  
                  mensagem: "Tabela de Produto 📝:",  
                  results:  results
                }; 
            }
    }
