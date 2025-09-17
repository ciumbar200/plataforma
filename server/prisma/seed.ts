import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creando usuarios y propiedades de prueba...');

  // Contraseña común para todos los usuarios de prueba
  const password = 'test123';
  const hashedPassword = await bcrypt.hash(password, 10);

  // Usuario ADMIN
  const admin = await prisma.user.upsert({
    where: { email: 'admin@moonpro.com' },
    update: {},
    create: {
      email: 'admin@moonpro.com',
      name: 'Admin Usuario',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      passwordHash: hashedPassword,
      role: Role.ADMIN,
      city: 'Madrid',
      about: 'Administrador del sistema Moon Pro con experiencia en gestión de propiedades y tecnología inmobiliaria.',
      plan: 'premium',
      tags: ['admin', 'gestión', 'tecnología']
    },
  });

  // 5 Usuarios PROPIETARIOS con perfiles completos
  const propietario1 = await prisma.user.upsert({
    where: { email: 'carlos.martinez@moonpro.com' },
    update: {},
    create: {
      email: 'carlos.martinez@moonpro.com',
      name: 'Carlos Martínez',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      passwordHash: hashedPassword,
      role: Role.PROPIETARIO,
      city: 'Barcelona',
      about: 'Inversor inmobiliario con más de 10 años de experiencia. Especializado en propiedades de lujo en el centro de Barcelona.',
      plan: 'premium',
      tags: ['inversor', 'lujo', 'centro ciudad']
    },
  });

  const propietario2 = await prisma.user.upsert({
    where: { email: 'maria.garcia@moonpro.com' },
    update: {},
    create: {
      email: 'maria.garcia@moonpro.com',
      name: 'María García',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      passwordHash: hashedPassword,
      role: Role.PROPIETARIO,
      city: 'Madrid',
      about: 'Arquitecta y propietaria de varios inmuebles modernos. Me enfoco en espacios funcionales y sostenibles.',
      plan: 'standard',
      tags: ['arquitecta', 'moderno', 'sostenible']
    },
  });

  const propietario3 = await prisma.user.upsert({
    where: { email: 'david.lopez@moonpro.com' },
    update: {},
    create: {
      email: 'david.lopez@moonpro.com',
      name: 'David López',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      passwordHash: hashedPassword,
      role: Role.PROPIETARIO,
      city: 'Valencia',
      about: 'Emprendedor tecnológico que invierte en propiedades cerca de universidades y centros de innovación.',
      plan: 'premium',
      tags: ['tech', 'universitario', 'innovación']
    },
  });

  const propietario4 = await prisma.user.upsert({
    where: { email: 'ana.rodriguez@moonpro.com' },
    update: {},
    create: {
      email: 'ana.rodriguez@moonpro.com',
      name: 'Ana Rodríguez',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      passwordHash: hashedPassword,
      role: Role.PROPIETARIO,
      city: 'Sevilla',
      about: 'Diseñadora de interiores especializada en espacios compartidos. Mis propiedades combinan estilo y funcionalidad.',
      plan: 'standard',
      tags: ['diseño', 'interiores', 'compartido']
    },
  });

  const propietario5 = await prisma.user.upsert({
    where: { email: 'miguel.fernandez@moonpro.com' },
    update: {},
    create: {
      email: 'miguel.fernandez@moonpro.com',
      name: 'Miguel Fernández',
      image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face',
      passwordHash: hashedPassword,
      role: Role.PROPIETARIO,
      city: 'Bilbao',
      about: 'Consultor financiero que gestiona una cartera diversificada de propiedades residenciales y comerciales.',
      plan: 'premium',
      tags: ['finanzas', 'diversificado', 'comercial']
    },
  });

  // 2 Usuarios INQUILINOS adicionales
  const inquilino1 = await prisma.user.upsert({
    where: { email: 'sofia.martin@moonpro.com' },
    update: {},
    create: {
      email: 'sofia.martin@moonpro.com',
      name: 'Sofía Martín',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
      passwordHash: hashedPassword,
      role: Role.INQUILINO,
      city: 'Barcelona',
      noiseLevel: 2,
      maxDistanceKm: 10,
      about: 'Estudiante de máster en ingeniería. Busco un ambiente tranquilo para estudiar, preferiblemente cerca del campus.',
      tags: ['estudiante', 'tranquilo', 'campus'],
      plan: 'standard'
    },
  });

  const inquilino2 = await prisma.user.upsert({
    where: { email: 'alex.torres@moonpro.com' },
    update: {},
    create: {
      email: 'alex.torres@moonpro.com',
      name: 'Alex Torres',
      image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face',
      passwordHash: hashedPassword,
      role: Role.INQUILINO,
      city: 'Madrid',
      noiseLevel: 4,
      maxDistanceKm: 20,
      about: 'Desarrollador de software que trabaja remotamente. Me gusta la vida social y busco compañeros de piso activos.',
      tags: ['developer', 'remoto', 'social'],
      plan: 'premium'
    },
  });

  // Crear 5 propiedades asignadas a los propietarios
  const propiedad1 = await prisma.property.upsert({
    where: { id: 'prop-barcelona-luxury' },
    update: {},
    create: {
      id: 'prop-barcelona-luxury',
      ownerId: propietario1.id,
      title: 'Ático de Lujo en Passeig de Gràcia',
      description: 'Espectacular ático de 4 habitaciones con terraza privada de 50m² en la zona más exclusiva de Barcelona. Completamente reformado con materiales de primera calidad.',
      city: 'Barcelona',
      priceMonthly: 2800,
      photos: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
      ]
    },
  });

  const propiedad2 = await prisma.property.upsert({
    where: { id: 'prop-madrid-modern' },
    update: {},
    create: {
      id: 'prop-madrid-modern',
      ownerId: propietario2.id,
      title: 'Loft Moderno en Malasaña',
      description: 'Loft de diseño contemporáneo con 3 habitaciones, cocina americana y grandes ventanales. Perfecto para profesionales jóvenes.',
      city: 'Madrid',
      priceMonthly: 2200,
      photos: [
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=800&h=600&fit=crop'
      ]
    },
  });

  const propiedad3 = await prisma.property.upsert({
    where: { id: 'prop-valencia-tech' },
    update: {},
    create: {
      id: 'prop-valencia-tech',
      ownerId: propietario3.id,
      title: 'Piso Tech-Friendly cerca de la UPV',
      description: 'Moderno piso de 3 habitaciones con fibra óptica, espacios de coworking y a 5 minutos de la Universidad Politécnica de Valencia.',
      city: 'Valencia',
      priceMonthly: 1600,
      photos: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&h=600&fit=crop'
      ]
    },
  });

  const propiedad4 = await prisma.property.upsert({
    where: { id: 'prop-sevilla-design' },
    update: {},
    create: {
      id: 'prop-sevilla-design',
      ownerId: propietario4.id,
      title: 'Casa Andaluza Renovada en Triana',
      description: 'Hermosa casa tradicional andaluza completamente renovada con 4 habitaciones, patio interior y diseño contemporáneo que respeta la arquitectura original.',
      city: 'Sevilla',
      priceMonthly: 1800,
      photos: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop'
      ]
    },
  });

  const propiedad5 = await prisma.property.upsert({
    where: { id: 'prop-bilbao-premium' },
    update: {},
    create: {
      id: 'prop-bilbao-premium',
      ownerId: propietario5.id,
      title: 'Duplex Premium en Casco Viejo',
      description: 'Exclusivo duplex de 3 habitaciones en el corazón del Casco Viejo de Bilbao. Combina el encanto histórico con todas las comodidades modernas.',
      city: 'Bilbao',
      priceMonthly: 2000,
      photos: [
        'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop'
      ]
    },
  });

  console.log('✅ Usuarios y propiedades creados exitosamente!');
  console.log('👑 Admin:', admin.email);
  console.log('🏠 Propietarios: 5 usuarios creados');
  console.log('🏃 Inquilinos: 2 usuarios creados');
  console.log('🏢 Propiedades: 5 propiedades creadas');
  console.log('🔑 Contraseña para todos los usuarios:', password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });