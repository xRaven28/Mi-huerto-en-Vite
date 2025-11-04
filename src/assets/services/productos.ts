import type { Producto } from "../types";

const KEY = "productos";

export const productosIniciales: Producto[] = [
  { id: 45, name: "Zapallo Italiano", precio: 1200, categoria: "verduras", compania: "", img: "img/zapalloitaliano.jpg", desc: "Suave y versátil, perfecto para salteados, rellenos y pastas.", habilitado: true },
  { id: 9, name: "Duraznos", precio: 2500, categoria: "frutas", compania: "", img: "img/Durazno_1.png", desc: "Duraznos jugosos de temporada.", habilitado: true },
  { id: 65, name: "Avena", precio: 2500, categoria: "Legumbres-Cereales", compania: "", img: "img/Avena_2.png", desc: "Avena natural, ideal para desayunos saludables.", habilitado: true },
  { id: 39, name: "Tomates", precio: 1300, categoria: "verduras", compania: "", img: "img/tomate.jpg", desc: "Jugosos y sabrosos, dan color y frescura a tus comidas.", habilitado: true },
  { id: 3, name: "Frutillas", precio: 1990, categoria: "frutas", compania: "", img: "img/Frutilla_4.png", desc: "Frutillas dulces, ideales para postres.", habilitado: true },
  { id: 73, name: "Yogurt", precio: 450, categoria: "Lacteos", compania: "", img: "img/Yogurt_3.jpg", desc: "Yogurt natural, fresco y nutritivo.", habilitado: true },
  { id: 46, name: "Brócoli", precio: 1690, categoria: "verduras", compania: "", img: "img/Brocoli_1.png", desc: "Brócoli fresco y lleno de nutrientes, ideal para ensaladas, sopas y al vapor.", habilitado: true },
  { id: 25, name: "Chirimoya", precio: 3800, categoria: "frutas", compania: "", img: "img/Chirimoya_1.jpg", desc: "Chirimoya cremosa y muy dulce, conocida como la 'fruta de la paz'.", habilitado: true },
  { id: 74, name: "Manjar", precio: 3990, categoria: "Lacteos", compania: "", img: "img/Manjar_1.png", desc: "Manjar casero cremoso y suave, elaborado lentamente con leche fresca y azúcar.", habilitado: true },
  { id: 67, name: "Arroz", precio: 1900, categoria: "Legumbres-Cereales", compania: "", img: "img/Arroz_1.png", desc: "Arroz blanco de grano largo, versátil en la cocina.", habilitado: true },
  { id: 2, name: "Naranjas", precio: 1500, categoria: "frutas", compania: "", img: "img/Naranja_1.png", desc: "Naranjas jugosas llenas de vitamina C.", habilitado: true },
  { id: 77, name: "Mermelada de Mora", precio: 2800, categoria: "otros", compania: "", img: "img/Mermelada_mora_1.png", desc: "Mermelada casera de mora, preparada de forma artesanal.", habilitado: true },
  { id: 53, name: "Berenjena", precio: 2000, categoria: "verduras", compania: "", img: "img/berenjena.png", desc: "Berenjena morada, ideal para asar, freír o rellenar.", habilitado: true },
  { id: 19, name: "Higos", precio: 3500, categoria: "frutas", compania: "", img: "img/Higo_1.avif", desc: "Higos frescos, dulces y jugosos, ideales para postres o mermeladas.", habilitado: true },
  { id: 68, name: "Leche Entera", precio: 1500, categoria: "Lacteos", compania: "", img: "img/Leche_3.png", desc: "Leche entera fresca, rica en calcio.", habilitado: true },
  { id: 59, name: "Perejil", precio: 700, categoria: "verduras", compania: "", img: "img/Perejil_1.webp", desc: "Perejil fresco, perfecto para salsas, guisos y ensaladas.", habilitado: true },
  { id: 70, name: "Queso Chanco", precio: 8900, categoria: "Lacteos", compania: "", img: "img/quesochanco.png", desc: "Queso chanco tradicional, semimaduro y sabroso.", habilitado: true },
  { id: 27, name: "Nueces", precio: 8500, categoria: "frutas", compania: "", img: "img/Nuez_1.jpg", desc: "Nueces frescas con alto contenido de omega-3 y energía.", habilitado: true },
  { id: 34, name: "Cebolla", precio: 700, categoria: "verduras", compania: "", img: "img/Cebolla_2.png", desc: "Cebolla fresca, ideal para todo tipo de platos.", habilitado: true },
  { id: 60, name: "Apio", precio: 1100, categoria: "verduras", compania: "", img: "img/apio.png", desc: "Crujiente y refrescante, ideal para ensaladas y sopas.", habilitado: true },
  { id: 13, name: "Granada", precio: 1990, categoria: "frutas", compania: "", img: "img/Granada_1.png", desc: "Granadas con granos rojos brillantes y antioxidantes naturales.", habilitado: true },
  { id: 76, name: "Miel Multifloral", precio: 6900, categoria: "otros", compania: "", img: "img/Miel_multi_2.jpg", desc: "Miel natural 100% pura y artesanal.", habilitado: true },
  { id: 31, name: "Lechuga", precio: 900, categoria: "verduras", compania: "", img: "img/Lechuga_2.webp", desc: "Fresca y crujiente, ideal para ensaladas.", habilitado: true },
  { id: 5, name: "Plátanos", precio: 1200, categoria: "frutas", compania: "", img: "img/Platano_3.png", desc: "Plátanos maduros, energéticos.", habilitado: true },
   { id: 56, name: "Alcachofa", precio: 2800, categoria: "verduras", compania: "", img: "img/Alcachofa_1.webp", desc: "Alcachofas tiernas, ricas en fibra y antioxidantes.", habilitado: true },
  { id: 1, name: "Manzanas Rojas", precio: 990, categoria: "frutas", compania: "", img: "img/Manzana_1.png", desc: "Manzanas frescas, crocantes y dulces.", habilitado: true },
  { id: 50, name: "Choclo", precio: 1800, categoria: "verduras", compania: "", img: "img/Choclo_2.jpg", desc: "Choclo fresco, amarillo y jugoso, perfecto para humitas y pastel de choclo.", habilitado: true },
  { id: 78, name: "Mermelada de Frutilla", precio: 2800, categoria: "otros", compania: "", img: "img/Mermelada_frutilla_1.png", desc: "Tradicional mermelada de frutilla casera, dulce y natural.", habilitado: true },
  { id: 15, name: "Melón Calameño", precio: 3490, categoria: "frutas", compania: "", img: "img/MelónCalameño_1.png", desc: "Melón calameño, muy dulce y refrescante en días de calor.", habilitado: true },
  { id: 63, name: "Habas", precio: 2000, categoria: "Legumbres-Cereales", compania: "", img: "img/Habas_3.png", desc: "Habas frescas y tradicionales en la cocina chilena.", habilitado: true },
  { id: 32, name: "Repollo Blanco", precio: 1000, categoria: "verduras", compania: "", img: "img/repolloblanco.png", desc: "Repollo blanco, crocante y versátil en ensaladas o guisos.", habilitado: true },
  { id: 79, name: "Mermelada de Durazno", precio: 2800, categoria: "otros", compania: "", img: "img/Mermelada_durazno_!.png", desc: "Mermelada casera de durazno, hecha con fruta fresca de temporada.", habilitado: true },
  { id: 36, name: "Calabaza", precio: 1600, categoria: "verduras", compania: "", img: "img/Calabaza-1.png", desc: "Pulpa dulce y cremosa, perfecta para sopas y cremas.", habilitado: true },
  { id: 66, name: "Linaza", precio: 2800, categoria: "Legumbres-Cereales", compania: "", img: "img/Linaza_1.png", desc: "Semillas de linaza, ricas en fibra y omega-3.", habilitado: true },
  { id: 75, name: "Huevos", precio: 3800, categoria: "otros", compania: "", img: "img/Huevos.png", desc: "Huevos de gallina frescos, ideales para desayunos y repostería.", habilitado: true },
  { id: 41, name: "Pimiento", precio: 1400, categoria: "verduras", compania: "", img: "img/Pimenton_1.png", desc: "Dulce y aromático, aporta color y sabor a salteados y ensaladas.", habilitado: true },
  { id: 17, name: "Pepinos Dulces", precio: 2990, categoria: "frutas", compania: "", img: "img/PepinoDulce_1.png", desc: "Pepinos dulces, refrescantes y suaves, perfectos para ensaladas.", habilitado: true },
  { id: 69, name: "Mantequilla", precio: 2900, categoria: "Lacteos", compania: "", img: "img/Mantequilla_2.avif", desc: "Mantequilla cremosa, perfecta para untar o cocinar.", habilitado: true },
  { id: 23, name: "Castañas", precio: 7600, categoria: "frutas", compania: "", img: "img/Castaña_1.jpg", desc: "Castañas frescas, ideales para asar o preparar purés.", habilitado: true },
  { id: 4, name: "Cerezas", precio: 2990, categoria: "frutas", compania: "", img: "img/Cereza_2.png", desc: "Cerezas de temporada, muy sabrosas.", habilitado: true },
  { id: 81, name: "Mermelada de Alcayota", precio: 2800, categoria: "otros", compania: "", img: "img/Mermelada_alca_1.png", desc: "Tradicional mermelada de alcayota, típica de la cocina chilena.", habilitado: true },
  { id: 22, name: "Limón", precio: 1500, categoria: "frutas", compania: "", img: "img/Limón_1.avif", desc: "Limones frescos, llenos de jugo ácido y vitamina C.", habilitado: true },
  { id: 49, name: "Betarraga", precio: 1600, categoria: "verduras", compania: "", img: "img/Beterraga_2.webp", desc: "Betarraga dulce y nutritiva, rica en antioxidantes.", habilitado: true },
  { id: 30, name: "Alcayota", precio: 2500, categoria: "frutas", compania: "", img: "img/Alcayota_1.webp", desc: "Alcayota fresca, especial para preparar dulces y mermeladas.", habilitado: true },
  { id: 18, name: "Uvas", precio: 2980, categoria: "frutas", compania: "", img: "img/Uva_4.png", desc: "Uvas frescas y jugosas, excelentes para comer al natural o en postres.", habilitado: true },
  { id: 71, name: "Queso Mantecoso", precio: 9500, categoria: "Lacteos", compania: "", img: "img/QuesoMantecoso_1.webp", desc: "Queso mantecoso, suave y fundente, ideal para sándwiches.", habilitado: true },
  { id: 11, name: "Damascos", precio: 2990, categoria: "frutas", compania: "", img: "img/damasco_3.png", desc: "Damascos jugosos y dulces, ideales para postres o mermeladas.", habilitado: true },
  { id: 44, name: "Zapallo Camote", precio: 1700, categoria: "verduras", compania: "", img: "img/Zapallo_2.png", desc: "Sabor dulce y textura suave, ideal para cremas y hornos.", habilitado: true },
  { id: 26, name: "Tuna", precio: 2200, categoria: "frutas", compania: "", img: "img/Tuna_2.jpg", desc: "Tunas frescas, dulces y refrescantes, típicas de temporada.", habilitado: true },
  { id: 48, name: "Ajo", precio: 1200, categoria: "verduras", compania: "", img: "img/Ajo_1.jpeg", desc: "Ajo aromático, infaltable en la cocina chilena.", habilitado: true },
  { id: 12, name: "Frambuesas", precio: 3500, categoria: "frutas", compania: "", img: "img/Frambuesa_3.png", desc: "Frambuesas frescas, pequeñas y llenas de sabor intenso.", habilitado: true },
  { id: 80, name: "Mermelada de Higo", precio: 2800, categoria: "otros", compania: "", img: "img/MermeladaHigo_1.webp", desc: "Mermelada casera de higo, dulce e intensa.", habilitado: true },
  { id: 35, name: "Espinaca", precio: 1200, categoria: "verduras", compania: "", img: "img/Espinaca_1.jpg", desc: "Hojas verdes tiernas, ricas en hierro y vitaminas.", habilitado: true },
  { id: 16, name: "Membrillo", precio: 2790, categoria: "frutas", compania: "", img: "img/Membrillo_1.png", desc: "Membrillo aromático, ideal para preparar dulces y compotas.", habilitado: true },
  { id: 82, name: "Mermelada de Frambuesa", precio: 2800, categoria: "otros", compania: "", img: "img/MermeladaFrambuesa_1.webp", desc: "Mermelada de frambuesa fresca, intensa y natural.", habilitado: true },
  { id: 42, name: "Tomates Cherry", precio: 1600, categoria: "verduras", compania: "", img: "img/tomatecherry_1.png", desc: "Pequeños y dulces, perfectos para snack o ensaladas.", habilitado: true },
   { id: 40, name: "Pepino", precio: 900, categoria: "verduras", compania: "", img: "img/Pepino_1.png", desc: "Crujiente y refrescante, ideal para ensaladas y aguas saborizadas.", habilitado: true },
  { id: 7, name: "Sandías", precio: 3500, categoria: "frutas", compania: "", img: "img/Sandía_1.png", desc: "Sandía fresca, ideal para verano.", habilitado: true },
  { id: 20, name: "Arándanos", precio: 4200, categoria: "frutas", compania: "", img: "img/Arándano_1.avif", desc: "Arándanos pequeños, azules y llenos de antioxidantes.", habilitado: true },
  { id: 8, name: "Melón Tuna", precio: 3200, categoria: "frutas", compania: "", img: "img/MelónTuna_1.png", desc: "Melón dulce y refrescante.", habilitado: true },
  { id: 72, name: "Queso de Cabra", precio: 10500, categoria: "Lacteos", compania: "", img: "img/QuesoCabra_1.png", desc: "Queso de cabra artesanal, de sabor intenso y textura cremosa, ideal para ensaladas y tablas.", habilitado: true },
  { id: 38, name: "Papas", precio: 1200, categoria: "verduras", compania: "", img: "img/papa_3.png", desc: "Versátiles y rendidoras, perfectas para puré, fritas o al horno.", habilitado: true },
  { id: 6, name: "Peras", precio: 1100, categoria: "frutas", compania: "", img: "img/Pera_2.png", desc: "Peras frescas, textura suave.", habilitado: true },
  { id: 28, name: "Almendras", precio: 8900, categoria: "frutas", compania: "", img: "img/Almendra_1.jpg", desc: "Almendras naturales, crocantes y llenas de nutrientes.", habilitado: true },
  { id: 83, name: "Mermelada de Arándano", precio: 2800, categoria: "otros", compania: "", img: "img/Mermelada_arandano_1.png", desc: "Mermelada artesanal de arándano, llena de sabor.", habilitado: true },
  { id: 29, name: "Pomelo", precio: 2300, categoria: "frutas", compania: "", img: "img/Pomelo_1.webp", desc: "Pomelos jugosos y ácidos, ricos en vitamina C.", habilitado: true },
  { id: 43, name: "Zanahoria", precio: 900, categoria: "verduras", compania: "", img: "img/zanahoria.jpg", desc: "Crujiente y naturalmente dulce, rica en betacarotenos.", habilitado: true },
  { id: 37, name: "Palta Hass", precio: 1600, categoria: "verduras", compania: "", img: "img/PaltaHass_4.png", desc: "Textura cremosa y sabor suave, ideal para ensaladas y tostadas.", habilitado: true },
  { id: 24, name: "Caqui", precio: 2990, categoria: "frutas", compania: "", img: "img/Caqui_2.webp", desc: "Caquis dulces y jugosos, ideales para mermeladas y postres.", habilitado: true },
  { id: 10, name: "Kiwis", precio: 1700, categoria: "frutas", compania: "", img: "img/Kiwi_3.png", desc: "Kiwi lleno de vitamina C.", habilitado: true },
  { id: 47, name: "Coliflor", precio: 1800, categoria: "verduras", compania: "", img: "img/Coliflor_2.avif", desc: "Coliflor fresca, ideal para gratinados, sopas y ensaladas.", habilitado: true },
  { id: 62, name: "Garbanzos", precio: 2300, categoria: "Legumbres-Cereales", compania: "", img: "img/Garbanzo_3.png", desc: "Garbanzos ideales para ensaladas, guisos y hummus.", habilitado: true },
  { id: 21, name: "Piña", precio: 2800, categoria: "frutas", compania: "", img: "img/pina.jpg", desc: "Piña tropical, jugosa y refrescante, perfecta para jugos y postres.", habilitado: true },
  { id: 14, name: "Mandarinas", precio: 1890, categoria: "frutas", compania: "", img: "img/Mandarina_4.png", desc: "Mandarinas dulces y fáciles de pelar, perfectas como snack.", habilitado: true },
  { id: 61, name: "Arvejas", precio: 2200, categoria: "Legumbres-Cereales", compania: "", img: "img/Arveja_1.jpg", desc: "Arvejas verdes, tiernas y llenas de proteína vegetal.", habilitado: true },
  { id: 33, name: "Repollo Morado", precio: 1100, categoria: "verduras", compania: "", img: "img/repollomorado.png", desc: "Repollo morado, de color intenso y sabor fresco.", habilitado: true },
  { id: 57, name: "Espárragos", precio: 3500, categoria: "verduras", compania: "", img: "img/Espárrago_1.jpg", desc: "Espárragos frescos, tiernos y sabrosos.", habilitado: true },
  { id: 64, name: "Lentejas", precio: 2100, categoria: "Legumbres-Cereales", compania: "", img: "img/lentejas.jpg", desc: "Lentejas nutritivas y llenas de fibra, perfectas para guisos.", habilitado: true },
  { id: 58, name: "Cilantro", precio: 800, categoria: "verduras", compania: "", img: "img/Cilantro_2.webp", desc: "Cilantro fresco, aromático e indispensable en la cocina chilena.", habilitado: true },
  { id: 54, name: "Ají", precio: 1500, categoria: "verduras", compania: "", img: "img/aji.jpg", desc: "Ají fresco, aporta picor y sabor intenso a las comidas.", habilitado: true },
];

export async function cargarProductosDesdeLocal(): Promise<Producto[]> {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(productosIniciales));
    return productosIniciales;
  }
  return JSON.parse(raw) as Producto[];
}

export async function guardarProductoEnLocal(nuevo: Producto): Promise<void> {
  const lista = await cargarProductosDesdeLocal();
  lista.push(nuevo);
  localStorage.setItem(KEY, JSON.stringify(lista));
}

export async function actualizarProductos(lista: Producto[]): Promise<void> {
  localStorage.setItem(KEY, JSON.stringify(lista));
}
