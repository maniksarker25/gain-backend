import { UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import { prisma } from '../src/app/utils/prisma';

const seedSuperAdmin = async () => {
  try {
    const isExistsSuperAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
      },
    });
    if (isExistsSuperAdmin) {
      console.log('Super admin is already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('superadmin', 12);
    const createSuperAdmin = await prisma.user.create({
      data: {
        email: 'superadmin@gmail.com',
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        profileId: '',
        superAdmin: {
          create: {
            name: 'Super Admin',
            email: 'super@gmail.com',
            phone: '01700000000',
          },
        },
      },
    });
    console.log('super admin created successfully', createSuperAdmin);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdmin();
