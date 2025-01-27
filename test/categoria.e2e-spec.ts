import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Testes do Modulo Categoria (e2e)', () => {
  let categoriaId: any;
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

  it('02 - Deve Listar Todas As Categorias', async () => {
    return request(app.getHttpServer())
    .get('/categorias')
    .send({})
    .expect(200);
  });

  it('03 - Deve Listar apenas Por ID', async () => {
    return request(app.getHttpServer())
      .get('/categorias/1')
      .send({})
      .expect(200);
  });

  it('04 - Deve Listar pelo Nome do Tema', async () => {
    return request(app.getHttpServer())
      .get('/categorias/nome/Root')
      .send({})
      .expect(200);
  });

  it('05 - Deve Atualizar uma categoria', async () => {
    return request(app.getHttpServer())
      .put('/categorias')
      .send({
        id: categoriaId,
        nome: 'Nome Root - Atualizado ',
        descricao: 'descrica Root - Atualizado',
      })
      .expect(200)
      .then((resposta) => {
        expect('Nome Root - Atualizado ').toEqual(resposta.body.nome);
      });
  });

  it('06 - Deve Deletar uma Categoria', async () =>{
    return request(app.getHttpServer())
    .delete('/categorias/1')
    .send({})
    .expect(204)
  })
});
