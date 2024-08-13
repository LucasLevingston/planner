import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import dayjs from 'dayjs';
import { prisma } from '../lib/prisma';
import { getMailClient } from '../lib/mail';
import nodemailer from 'nodemailer';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/pt-br';

dayjs.extend(localizedFormat);
dayjs.locale('pt-br');
export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips',
    {
      schema: {
        body: z.object({
          destination: z.string().min(4),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
          owner_name: z.string(),
          owner_email: z.string().email(),
          emails_to_invite: z.array(z.string().email()),
        }),
      },
    },
    async (request) => {
      const {
        destination,
        starts_at,
        ends_at,
        owner_name,
        owner_email,
        emails_to_invite,
      } = request.body;

      if (dayjs(starts_at).isBefore(new Date())) {
        throw new Error('Invalid trip start date');
      }

      if (dayjs(ends_at).isBefore(starts_at)) {
        throw new Error('Invalid trip end date.');
      }

      const trip = await prisma.trip.create({
        data: {
          destination,
          starts_at,
          ends_at,
          participants: {
            createMany: {
              data: [
                {
                  name: owner_name,
                  email: owner_email,
                  is_confirmed: true,
                  is_owner: true,
                },
                ...emails_to_invite.map((email) => {
                  return { email };
                }),
              ],
            },
          },
        },
      });

      const formattedStartDate = dayjs(starts_at).locale('pt-br').format('LL');
      const formattedEndDate = dayjs(ends_at).locale('pt-br').format('LL');

      const confirmationLink = `http://localhost:3333/trips/${trip.id}/confirm`;

      const mail = await getMailClient();

      const message = await mail.sendMail({
        from: {
          name: 'Equipe plann.er',
          address: 'oi@planner.er',
        },
        to: {
          name: owner_email,
          address: owner_email,
        },
        subject: `Confirmação de viagem para ${destination} em ${formattedStartDate}`,
        html: `
        <div style="font-family:sans-serif; font-size:16px; line-height:1.6;">
         <p>Você solicutou a criação de uma viagem para <strong>${destination}</strong> nas datas de <strong>${formattedStartDate} a ${formattedEndDate} de agosto de 2024</strong>.</p><br/>
         <p> 
          <a href="${confirmationLink}">
            Confirmar Viagem
          </a>
         </p>
        </div>
        
        `.trim(),
      });

      console.log(nodemailer.getTestMessageUrl(message));

      return { tripId: trip.id };
    }
  );
}
