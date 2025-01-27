import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Testes do Modulo Categoria (e2e)', () => {
  let categoriaId: any;
  let produtoId: any;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + './../src/**/entities/*.entity.ts'],
          synchronize: true,
          dropSchema: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('01 - Deve Cadastrar uma nova Categoria', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/categorias')
      .send({
        nome: 'Tema Root',
        descricao: 'descricao Root',
      })
      .expect(201);

    categoriaId = resposta.body.id;
  });

  it('02 - Deve Cadastrar Um Novo Produto', async () => {
    const resposta = await request(app.getHttpServer())
    .post('/produtos')
    .send({
      nome: 'Root',
      descricao: 'Descricao Root',
      preco: 12.00,
      estoque: 10,
      faxaEtaria: '0-5',
      foto:'-',
      categoria: categoriaId,
    })
    .expect(201)

    produtoId = resposta.body.id;
  
  })

  it('03 - Deve Listar Todos os Produtos', async () =>{
    return request(app.getHttpServer())
    .get('/produtos')
    .send({})
    .expect(200)
  }); 

  it('04 - Deve Listar o Produto Pelo ID', async () =>{
    return request(app.getHttpServer())
    .get('/produtos/1')
    .send({})
    .expect(200)
  });

  it('05 - Deve Buscar o Produto Pela Descrição', async () =>{
    return request(app.getHttpServer())
    .get('/produtos/descricao/Root')
    .send({})
    .expect(200)
  });


  it('06 - Deve atualizar o Produto', async () =>{
    return request(app.getHttpServer())
    .put('/produtos')
    .send({
      id: produtoId,
      nome: 'Root Atualizado',
      descricao: 'Descricao Root',
      preco: 12.00,
      estoque: 10,
      faxaEtaria: '0-5',
      foto:'-',
      categoria: categoriaId,
    })
    .expect(200)
    .then((resposta) => {
      expect('Root Atualizado').toEqual(resposta.body.nome)
    })
  });


  it('07 - Deve Apagar o Produto', async () => {
    return request(app.getHttpServer())
    .delete('/produtos/1')
    .send({})
    .expect(204)
  });
});
