import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

// TODO SERVICE TEM UM ÚNICO MÉTODO
// Não tem acesso aos dados da requisitação e resposta
/**
 * Recebimento das informações
 * Tratativa de erros/excessões
 * Acesso ao repositório
 */

interface Request {
    provider_id: string;
    date: Date;
}

class CreateAppointmentService {
    public async execute({ date, provider_id }: Request): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(
            AppointmentsRepository,
        );
        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentInSameDate) {
            throw Error('this appointment is already booked');
        }

        const appointment = appointmentsRepository.create({
            date: appointmentDate,
            provider_id,
        });

        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;
