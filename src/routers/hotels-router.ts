import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotels, getHotelsRooms } from '@/controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken);
hotelsRouter.get('/', getHotels);
hotelsRouter.get('/:hotelId', getHotelsRooms);

export { hotelsRouter };
