import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  const hotelData = {
    name: faker.name.findName(),
    image: faker.image.imageUrl(),
  };
  const hotel = await prisma.hotel.create({
    data: hotelData,
  });
  const roomData = [
    {
      capacity: 2,
      hotelId: hotel.id,
      name: '2 hospedes',
    },
    {
      capacity: 4,
      hotelId: hotel.id,
      name: '4 hospedes',
    },
  ];
  await prisma.room.createMany({
    data: roomData,
  });
  return await prisma.hotel.findFirst({ include: { Rooms: true } });
}
