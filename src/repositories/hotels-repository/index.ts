import { prisma } from '@/config';

async function getHotelsDB() {
  return prisma.hotel.findMany();
}

async function getHotelsRoomsDB(hotelId: number) {
  return prisma.room.findFirst({
    where: {
      hotelId,
    },
  });
}

async function getHotelByIdDB(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

export default { getHotelsDB, getHotelsRoomsDB, getHotelByIdDB };
