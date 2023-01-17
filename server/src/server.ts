import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';

const app = Fastify();
const prisma = new PrismaClient();

app.register(cors);

app.get('/', (req, res) => {
  return res.code(200).send({
    name: 'Gustavo',
  });
});

app.listen(
  {
    port: 3333,
  },
  (err, address) => {
    console.log(`HTTPS server running at ${address}`);
  }
);
