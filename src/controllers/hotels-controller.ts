import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const hotels = await hotelsService.getHotelsService(userId);
    if (hotels.length === 0) return res.status(httpStatus.NOT_FOUND).send([]);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'RequestError') return res.sendStatus(httpStatus.BAD_REQUEST);
    if (error.name === 'PaymentRequired') return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}

export async function getHotelsRooms(req: AuthenticatedRequest, res: Response) {
  try {
    const hotelId = Number(req.params.hotelId);
    const { userId } = req;
    const rooms = await hotelsService.getHotelsRoomsService(hotelId, userId);
    if (rooms.Rooms.length === 0) return res.status(httpStatus.NOT_FOUND).send(rooms);
    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'RequestError') return res.sendStatus(httpStatus.BAD_REQUEST);
    if (error.name === 'PaymentRequired') return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}
