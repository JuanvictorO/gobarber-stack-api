import { Router } from 'express';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
// Rota: Receber requisição, chamar outro arquivo, devolver uma resposta // Trabalha o dado

const appointmentsRouter = Router();
const appointmentsRepository = new AppointmentsRepository();
/*
    É verificada a autenticação em todas as rotas
    Caso queira aplicar a verificação em rotas específicas, use ex: get('/', ensureAuthenticated, async ...)
*/
appointmentsRouter.use(ensureAuthenticated);

/* appointmentsRouter.get('/', async (request, response) => {
    const appointments = await appointmentsRepository.find();

    return response.json(appointments);
}); */

// POST https://localhost:3333/apointments
appointmentsRouter.post('/', async (request, response) => {
    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date);

    const createAppointment = new CreateAppointmentService(
        appointmentsRepository,
    );

    const appointment = await createAppointment.execute({
        date: parsedDate,
        provider_id,
    });

    return response.json(appointment);
});

export default appointmentsRouter;
