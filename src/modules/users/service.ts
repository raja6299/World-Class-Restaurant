import { prisma } from '@/src/lib/prisma';
import { createAdminClient } from '@/src/lib/supabase/admin';
import { UserFormData } from './validation';
import { NotFoundError, ValidationError } from '@/src/lib/errors';
import { Logger } from '@/src/lib/logger';

export class UserService {
  static async getUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        restaurant: {
          select: { name: true }
        }
      }
    });
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  static async createUser(data: UserFormData) {
    try {
      // 1. Create in Supabase Auth (requires Admin Client)
      const adminAuth = createAdminClient().auth;
      const { data: authData, error: authError } = await adminAuth.admin.createUser({
        email: data.email,
        password: data.password || 'Aurum@1234', // Default password if none provided
        email_confirm: true,
        user_metadata: {
          name: data.name,
          role: data.role,
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      const authId = authData.user.id;

      // 2. Create in Prisma
      const user = await prisma.user.create({
        data: {
          id: authId, // Link Prisma User ID directly to Supabase Auth ID
          email: data.email,
          name: data.name,
          phone: data.phone,
          role: data.role,
        }
      });

      return user;
    } catch (error: unknown) {
      Logger.error('Failed to create user', { error: (error as Error).message });
      throw new ValidationError((error as Error).message);
    }
  }

  static async updateUser(id: string, data: UserFormData) {
    try {
      // 1. Update in Supabase Auth
      const adminAuth = createAdminClient().auth;
      const updatePayload: Record<string, unknown> = {
        email: data.email,
        user_metadata: {
          name: data.name,
          role: data.role,
        }
      };
      
      if (data.password) {
        updatePayload.password = data.password;
      }

      const { error: authError } = await adminAuth.admin.updateUserById(id, updatePayload);

      if (authError) {
        throw new Error(authError.message);
      }

      // 2. Update in Prisma
      const user = await prisma.user.update({
        where: { id },
        data: {
          email: data.email,
          name: data.name,
          phone: data.phone,
          role: data.role,
        }
      });

      return user;
    } catch (error: unknown) {
      Logger.error('Failed to update user', { error: (error as Error).message, id });
      throw new ValidationError((error as Error).message);
    }
  }

  static async deleteUser(id: string) {
    try {
      // 1. Delete in Supabase Auth
      const adminAuth = createAdminClient().auth;
      const { error: authError } = await adminAuth.admin.deleteUser(id);

      if (authError) {
        throw new Error(authError.message);
      }

      // 2. Delete in Prisma (Soft delete or hard delete based on preference, using hard delete here for cleanliness)
      await prisma.user.delete({
        where: { id }
      });
      
      return true;
    } catch (error: unknown) {
      Logger.error('Failed to delete user', { error: (error as Error).message, id });
      throw new ValidationError((error as Error).message);
    }
  }
}
