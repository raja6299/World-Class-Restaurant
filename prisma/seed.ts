import { Role } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('🌱 Starting comprehensive seed process...');

  // 1. Create Demo Restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { domain: 'demo.aurum.com' },
    update: {},
    create: {
      name: 'AURUM Luxury Dining (Demo)',
      domain: 'demo.aurum.com',
      logoUrl: 'https://aurum-restaurant.vercel.app/images/logo.png',
      createdBy: 'system',
    },
  });
  console.log(`✅ Restaurant Created: ${restaurant.name}`);

  // 2. Create Main Branch
  const branch = await prisma.branch.create({
    data: {
      restaurantId: restaurant.id,
      name: 'AURUM New Delhi',
      location: 'Connaught Place, New Delhi',
      phone: '+91-9876543210',
      createdBy: 'system',
      settings: {
        create: {
          currency: 'INR',
          timezone: 'Asia/Kolkata',
          locale: 'en-IN',
        }
      }
    },
  });
  console.log(`✅ Branch Created: ${branch.name}`);

  // 3. Create Users (Admin, Waiter, Kitchen, Customer)
  await prisma.user.upsert({
    where: { email: 'admin@aurum.com' },
    update: {},
    create: {
      email: 'admin@aurum.com',
      name: 'Admin User',
      role: Role.ADMIN,
      restaurantId: restaurant.id,
      createdBy: 'system',
    },
  });

  const waiter = await prisma.user.upsert({
    where: { email: 'waiter@aurum.com' },
    update: {},
    create: {
      email: 'waiter@aurum.com',
      name: 'Rahul (Waiter)',
      role: Role.WAITER,
      restaurantId: restaurant.id,
      createdBy: 'system',
    },
  });

  await prisma.user.upsert({
    where: { email: 'chef@aurum.com' },
    update: {},
    create: {
      email: 'chef@aurum.com',
      name: 'Chef Kapoor',
      role: Role.CHEF,
      restaurantId: restaurant.id,
      createdBy: 'system',
    },
  });
  console.log(`✅ Roles Generated (Admin, Waiter, Kitchen)`);

  // 4. Create Tables (1-5)
  const tables = [];
  for (let i = 1; i <= 5; i++) {
    const table = await prisma.table.create({
      data: {
        branchId: branch.id,
        tableNumber: `T${i.toString().padStart(2, '0')}`,
        capacity: i % 2 === 0 ? 4 : 2,
        createdBy: 'system',
      },
    });
    tables.push(table);
  }
  console.log(`✅ 5 Demo Tables Created`);

  // 5. Create Menu Categories
  const categoryStarters = await prisma.category.create({
    data: { branchId: branch.id, name: 'Starters', sortOrder: 1, createdBy: 'system' }
  });
  const categoryMains = await prisma.category.create({
    data: { branchId: branch.id, name: 'Main Course', sortOrder: 2, createdBy: 'system' }
  });

  // 6. Create Ingredients
  await prisma.ingredient.create({
    data: {
      branchId: branch.id,
      name: 'Premium Mutton',
      currentQuantity: 50,
      minimumThreshold: 10,
      unit: 'kg',
    }
  });
  await prisma.ingredient.create({
    data: {
      branchId: branch.id,
      name: 'Saffron',
      currentQuantity: 200,
      minimumThreshold: 50,
      unit: 'grams',
    }
  });
  console.log(`✅ Ingredients Populated`);
  
  // 7. Create Menu Items
  const menuItem1 = await prisma.menuItem.create({
    data: {
      branchId: branch.id,
      categoryId: categoryStarters.id,
      name: 'Galouti Kebab',
      description: 'Melt-in-mouth lamb kebabs infused with 16 secret spices.',
      price: 850,
      isAvailable: true,
      preparationTime: 20,
      isVeg: false,
      isHalal: true,
      spiceLevel: 2,
      createdBy: 'system',
    }
  });

  await prisma.menuItem.create({
    data: {
      branchId: branch.id,
      categoryId: categoryMains.id,
      name: 'Raan-e-Sikandari',
      description: 'Slow-cooked whole leg of lamb.',
      price: 1800,
      isAvailable: true,
      preparationTime: 45,
      isVeg: false,
      isHalal: true,
      spiceLevel: 1,
      createdBy: 'system',
    }
  });
  console.log(`✅ Demo Menu Populated`);

  // 8. Create a Demo Dining Session and Order
  const session = await prisma.diningSession.create({
    data: {
      branchId: branch.id,
      tableId: tables[0].id,
      waiterId: waiter.id,
      guestCount: 2,
      status: 'ACTIVE',
    }
  });

  await prisma.order.create({
    data: {
      branchId: branch.id,
      diningSessionId: session.id,
      status: 'NEW',
      totalAmount: 850,
      items: {
        create: [
          {
            menuItemId: menuItem1.id,
            snapshotName: menuItem1.name,
            snapshotPrice: menuItem1.price,
            quantity: 1,
            price: 850,
            notes: 'Extra spicy',
          }
        ]
      }
    }
  });
  console.log(`✅ Demo Order Created on Table T01`);

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
