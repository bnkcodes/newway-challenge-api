import 'tsconfig-paths/register';

import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { UserEntity } from '@/users/domain/user.entity';
import { PrismaService } from '@/shared/infra/prisma/prisma.service';

const prisma = new PrismaService();

async function createAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@newway.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin User';

    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = new UserEntity({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    await prisma.user.create({
      data: adminUser.toJSON(),
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

void createAdminUser();
