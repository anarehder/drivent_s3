import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createHotel,
  createHotelTicketType,
  createNoHotelTicketType,
  createRemoteTicketType,
  createRoomHotel,
  createTicket,
  createTicketType,
  createUser,
} from '../factories';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user has no enrollment ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      // tenho token e não tenho enrollment
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    it('should respond with status 404 when given ticket doesnt exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      // tenho token e enrollment e não tenho ticket
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    it('should respond with status 402 when given ticket is not paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      // tenho token e enrollment e ticket, mas o ticket não foi pago
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    it('should respond with status 402 when given ticket is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createRemoteTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      // tenho token e enrollment e ticket pago, mas o ticket é remoto
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    it('should respond with status 402 when ticket doesnt includes hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createNoHotelTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      // tenho token e enrollment e ticket presencial pago, mas o ticket nao inclui hotel
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    it('should respond with status 404 when hotels list is empty', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createHotelTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      // tenho token e enrollment e ticket presencial com hotel pago, mas não existe nada na lista de hoteis
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('should respond with status 200 and the list of hotels', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createHotelTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createHotel();
      await createHotel();
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);

      expect(response.body).toEqual(
        expect.arrayContaining([
          {
            id: expect.any(Number),
            name: expect.any(String),
            image: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ]),
      );
    });
  });
});

describe('GET /hotels/:hotelId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user has no enrollment ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      // tenho token e não tenho enrollment
      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    it('should respond with status 404 when given ticket doesnt exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      // tenho token e enrollment e não tenho ticket
      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    it('should respond with status 402 when given ticket is not paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      // tenho token e enrollment e ticket, mas o ticket não foi pago
      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    it('should respond with status 402 when given ticket is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createRemoteTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      // tenho token e enrollment e ticket pago, mas o ticket é remoto
      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    it('should respond with status 402 when ticket doesnt includes hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createNoHotelTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      // tenho token e enrollment e ticket presencial pago, mas o ticket nao inclui hotel
      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    it('should respond with status 404 when hotels list is empty', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createHotelTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      // tenho token e enrollment e ticket presencial com hotel pago, mas não existe nada na lista de hoteis
      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('should respond with status 200 and the list of hotel rooms', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createHotelTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      await createRoomHotel(hotel.id);
      const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.OK);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: hotel.id,
          image: expect.any(String),
          name: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          Rooms: expect.arrayContaining([
            {
              id: expect.any(Number),
              name: expect.any(String),
              capacity: expect.any(Number),
              hotelId: hotel.id,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          ]),
        }),
      );
    });
  });
});
