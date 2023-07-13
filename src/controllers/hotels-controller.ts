import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const hotels = await hotelsService.getHotelsService(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function getHotelsRooms(req: AuthenticatedRequest, res: Response) {
  try {
    const hotelId = Number(req.params.hotelId);
    const { userId } = req;
    const rooms = await hotelsService.getHotelsRoomsService(hotelId, userId);
    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}
