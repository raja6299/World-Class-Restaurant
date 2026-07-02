import { UserService } from '@/src/modules/users/service';
import UsersClient from './UsersClient';

export default async function UsersPage() {
  const users = await UserService.getUsers();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-semibold text-aurum-text-heading">Staff Management</h1>
        <p className="text-aurum-text-body/60 mt-1">Manage restaurant staff, roles, and access credentials.</p>
      </div>

      <UsersClient initialData={users as unknown as import('@/src/modules/users/dto').UserDto[]} />
    </div>
  );
}
