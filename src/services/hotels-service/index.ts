import { notFoundError, paymentReq } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelsRepository from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function verifyTicketAndEnrollment(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();
  // tem inscricao? (404 - not found) - OK
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id); // já vem o ticket type junto
  if (!ticket) throw notFoundError();
  // tem ticket? (404 - not found) - OK
  // tem hotel? (404 - not found)
  if (ticket.status !== 'PAID') throw paymentReq();
  if (!ticket.TicketType.isRemote) throw paymentReq();
  if (ticket.TicketType.includesHotel === false) throw paymentReq();
  //ticket foi pago? é remoto? não inclui hotel? (402 - payment required) - OK
}

async function getHotelsService(userId: number) {
  await verifyTicketAndEnrollment(userId);
  const hotels = await hotelsRepository.getHotelsDB();
  if (!hotels || hotels.length === 0) throw notFoundError();
  return hotels;
}

async function getHotelsRoomsService(hotelId: number, userId: number) {
  await verifyTicketAndEnrollment(userId);
  const hotelRooms = await hotelsRepository.getHotelByIdDB(hotelId);
  if (!hotelRooms || hotelRooms.Rooms.length === 0) throw notFoundError();
  return hotelRooms;
}

export default { getHotelsService, getHotelsRoomsService };
