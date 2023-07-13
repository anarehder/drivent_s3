async function getHotelsService(userId: number) {
  const resposta = [userId];
  return resposta;
  // pegar o usuario -> conferir se
  // tem inscricao? (404 - not found)
  // tem ticket? (404 - not found)
  // tem hotel? (404 - not found)
  // ticket foi pago? (402 - payment required)
  // ticket é remoto? (402 - payment required)
  // ticket não inclui hotel? (402 - payment required)
  // outros error (400 bad request)
  // const ticket = await ticketsRepository.findTickeyById(ticketId);
  // if (!ticket) throw notFoundError();
  // const enrollment = await enrollmentRepository.findById(ticket.enrollmentId);
  // if (!enrollment) throw notFoundError();
  // if (enrollment.userId !== userId) throw unauthorizedError();
}

async function getHotelsRoomsService(hotelId: number, userId: number) {
  const resposta = [hotelId, userId];
  return resposta;
}

export default { getHotelsService, getHotelsRoomsService };
