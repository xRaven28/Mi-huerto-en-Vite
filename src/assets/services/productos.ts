import { Producto } from '../types';

const KEY = 'catalogo';

export const cargarProductosDesdeLocal = async (): Promise<Producto[]> => {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const inicial: Producto[] = [
      {
        id: Date.now(),
        name: 'Tomate',
        precio: 1200,
        desc: 'Tomate fresco',
        categoria: 'verdura',
        compania: 'Chilexpress',
        img: '/img/placeholder.jpg',
        habilitado: true,
      },
    ];
    localStorage.setItem(KEY, JSON.stringify(inicial));
    return inicial;
  }
  return JSON.parse(raw) as Producto[];
};

export const guardarProductoEnLocal = async (producto: Omit<Producto, 'id'>): Promise<Producto> => {
  const list = await cargarProductosDesdeLocal();
  const nuevo: Producto = { ...producto, id: Date.now() };
  list.push(nuevo);
  localStorage.setItem(KEY, JSON.stringify(list));
  return nuevo;
};

export const actualizarProductoEnLocal = async (id: number, updates: Partial<Producto>): Promise<Producto | null> => {
  const list = await cargarProductosDesdeLocal();
  const i = list.findIndex(p => p.id === id);
  if (i === -1) return null;
  list[i] = { ...list[i], ...updates };
  localStorage.setItem(KEY, JSON.stringify(list));
  return list[i];
};

export const eliminarProductoDeLocal = async (id: number): Promise<boolean> => {
  const list = await cargarProductosDesdeLocal();
  const newList = list.filter(p => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(newList));
  return newList.length !== list.length;
};
