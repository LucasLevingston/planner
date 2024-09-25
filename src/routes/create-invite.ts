import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { dayjs } from '../lib/dayjs';
import { getMailClient } from '../lib/mail';
import nodemailer from 'nodemailer';
import { ClientError } from '../errors/client-error';
import { env } from '../env';

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips/:tripId/invites',
    {
      schema: {
        params: z.object({
          tripId: z.string(),
        }),
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (request) => {
      const { tripId } = request.params;
      const { email } = request.body;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
      });

      if (!trip) {
        throw new ClientError('Trip not found');
      }

      const participant = await prisma.participant.create({
        data: {
          email,
          trip_id: tripId,
        },
      });

      const formattedStartDate = dayjs(trip.starts_at).locale('pt-br').format('LL');
      const formattedEndDate = dayjs(trip.ends_at).locale('pt-br').format('LL');

      const mail = await getMailClient();

      const confirmationLink = `${env.WEB_BASE_URL}/participants/${participant.id}/confirm`;
      const message = await mail.sendMail({
        from: {
          name: 'Equipe plann.er',
          address: 'oi@planner.er',
        },
        to: participant.email,
        subject: `Confirmação de presença na viagem para ${trip.destination} em ${formattedStartDate}`,
        html: `
        <div style="font-family:sans-serif; font-size:16px; line-height:1.6;">
         <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate} a ${formattedEndDate} de agosto de 2024</strong>.</p><br/>
         <p> </p>
         <p>Para confirmar sua presença na viagem, clique no link abaixo: </p>
         <p> 
          <a href="${confirmationLink}">
            Confirmar Viagem
          </a>
         </p>
        </div>
        
        `.trim(),
      });

      console.log(nodemailer.getTestMessageUrl(message));

      return { participantId: participant.id };
    }
  );
}