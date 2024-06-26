import type { Prisma, StoreServices } from "@prisma/client";
import { PrismaClient, Role } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bycript from "bcrypt";
import { addHours, addMinutes, startOfWeek } from "date-fns";

const prisma = new PrismaClient();

const services = ["Male Haircut", "Beard Trim", "Shave", "Haircut & Hair Wash"];

async function userFactory(
  index: number,
  storeId: string,
): Promise<Prisma.UserCreateInput> {
  const hashedPassword = await bycript.hash("password1", 10);
  const service = await serviceFactory();
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: `pelatis${index}@gmail.com`,
    password: hashedPassword,
    mobilePhone: faker.phone.number(),
    emailVerifiedAt: faker.date.past(),
    role: Role.USER,
    bookings: {
      create: bookingsFactory(storeId, service),
    },
  };
}

const serviceFactory = async (): Promise<Prisma.ServiceCreateInput> => {
  const services = await prisma.storeServices.findMany();
  const storeService = getRandomService(services);
  return {
    storeService: {
      connect: {
        id: storeService.id,
      },
    },
  };
};

function getRandomService(services: Array<StoreServices>) {
  return services[Math.floor(Math.random() * services.length)];
}

function bookingsFactory(
  storeId: string,
  service: Prisma.ServiceCreateInput,
): Array<Prisma.BookingCreateWithoutUserInput> {
  const random = Math.floor(Math.random() * 72) + 1;
  const firstDayOfWeek = startOfWeek(new Date());

  const start = addHours(firstDayOfWeek, random);
  if (Math.random() > 0.5) {
    start.setMinutes(start.getMinutes() + 30);
  }
  const end = addMinutes(start, 30);

  return [
    {
      store: {
        connect: {
          id: storeId,
        },
      },
      services: {
        create: {
          ...service,
        },
      },
      start,
      end,
    },
  ];
}

function storeServicesFactory(): Array<Prisma.StoreServicesCreateWithoutStoreInput> {
  return services.map(function mapToService(serviceName) {
    const price = faker.string.numeric(2);
    return {
      name: serviceName,
      price: Number(price),
    };
  });
}

async function main() {
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();
  await prisma.service.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.store.create({
    data: {
      name: "Barber Shop 1963",
      address: "Grammou 12",
      city: "Kastoria",
      country: "Greece",
      postalCode: "52100",
      phone: faker.phone.number(),
      email: faker.internet.email(),
      storeServices: {
        create: storeServicesFactory(),
      },
    },
  });

  const store = await prisma.store.findFirst();

  if (store) {
    for (let i = 0; i < 10; i++) {
      await prisma.user.create({
        data: await userFactory(i + 1, store.id),
      });
    }
  }

  await prisma.user.create({
    data: {
      firstName: "manos",
      lastName: "koukis",
      email: "admin@gmail.com",
      password: "$2a$04$2t9xcOy71K4QqkENc2NWS.c3sVrfrOKC8DSH5n39dDMbTb.HSLWEK",
      mobilePhone: "6971234567",
      emailVerifiedAt: faker.date.past(),
      role: Role.ADMIN,
    },
  });
}

main();
