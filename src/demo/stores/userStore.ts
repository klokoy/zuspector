import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type User = { id: number; name: string; email: string; role: 'admin' | 'user' };

type UserState = {
  users: User[];
  activeUserId: number | null;
  theme: 'light' | 'dark';
  setActiveUser: (id: number) => void;
  addUser: (user: User) => void;
  toggleTheme: () => void;
};

export const useUserStore = create<UserState>()(
  devtools(
    set => ({
      users: [
        { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
        { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
        { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'user' },
        { id: 4, name: 'David Brown', email: 'david@example.com', role: 'user' },
        { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'admin' },
      ],
      activeUserId: 1,
      theme: 'dark',
      setActiveUser: id => set({ activeUserId: id }, false, 'setActiveUser'),
      addUser: user => set(s => ({ users: [...s.users, user] }), false, 'addUser'),
      toggleTheme: () => set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' }), false, 'toggleTheme'),
    }),
    { name: 'UserStore' }
  )
);
