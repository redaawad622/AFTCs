import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
})
prisma.$on('query', (event) => console.log(event.query, event.params))
export default prisma
