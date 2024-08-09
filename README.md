# Plann.er

**Plann.er** é um sistema de backend para a organização de viagens.</br>
Este projeto tem como objetivo facilitar a criação e o gerenciamento de viagens, permitindo que os usuários adicionem destinos, datas, participantes e outras informações importantes.

## Tecnologias Utilizadas

![Node.JS](https://img.shields.io/badge/-Node.JS-0D1117?style=for-the-badge&logo=node.js&labelColor=0D1117&textColor=0D1117)&nbsp;
![TypeScript](https://img.shields.io/badge/-TypeScript-0D1117?style=for-the-badge&logo=typescript&labelColor=0D1117)&nbsp;
![Fastify](https://img.shields.io/badge/-Fastify-0D1117?style=for-the-badge&logo=fastify&labelColor=0D1117)&nbsp;
![Prisma](https://img.shields.io/badge/-Prisma-0D1117?style=for-the-badge&logo=prisma&labelColor=0D1117)&nbsp;
![SQLite](https://img.shields.io/badge/-SQLite-0D1117?style=for-the-badge&logo=sqlite&labelColor=0D1117)&nbsp;
![Swagger](https://img.shields.io/badge/-Swagger-0D1117?style=for-the-badge&logo=Swagger&labelColor=0D1117)&nbsp;
![zod](https://img.shields.io/badge/-Zod-0D1117?style=for-the-badge&logo=Zod&labelColor=0D1117)&nbsp;

## Funcionalidades

- **Gerenciamento de Viagens**: Criação, edição e remoção de viagens, com detalhes como destino, datas de início e fim, e confirmação.
- **Gerenciamento de Participantes**: Adição de participantes a uma viagem, com informações como nome, email, e status de confirmação. Um participante pode ser marcado como proprietário da viagem.
- **Validação de Dados**: Utilização do Zod para validação rigorosa dos dados que entram e saem do sistema, garantindo a integridade das informações.
- **Documentação da API**: A API é documentada automaticamente com Swagger, tornando-a fácil de usar e entender.

### Instalação

1. Faça o clone do projeto
2. Na pasta `plann.er api`, crie um arquivo para armazenar as variáveis de ambiente do projeto com o nome `.env`
3. Configure as variáveis de ambiente de acordo com o Firebase e utilizando o arquivo `.env.exemplo` como exemplo
4. Após a configuração das variáveis de ambiente, execute:

```
$ npm install
$ npm run dev
```
