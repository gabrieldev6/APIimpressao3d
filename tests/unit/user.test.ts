import { describe, it, expect } from 'vitest';
import User from '../../src/models/User'
import { UserRole } from '../../src/types/enums';

describe('User Model', () => {
  it('deve identificar um usuário administrador', () => {
    const user = User.build({
      name: 'Administrador',
      email: 'admin@example.com',
      password: '123456',
      role: UserRole.ADMIN,
    });

    expect(user.isAdmin()).toBe(true);
  });

  it('deve desativar um usuário', () => {
    const user = User.build({
      name: 'Usuário',
      email: 'user@example.com',
      password: '123456',
      role: UserRole.USER,
    });

    user.deactivate();

    expect(user.isActivate).toBe(false);
  });
});