"use client";

import { useData } from '@/components/Providers';
import MenuItemCard from '@/components/shared/MenuItemCard';
import Loading from './loading';
import { useMemo } from 'react';

export default function HomePage() {
  const { menuItems, isLoading } = useData();

  const categorizedMenu = useMemo(() => {
    return menuItems.reduce((acc, item) => {
      (acc[item.category] = acc[item.category] || []).push(item);
      return acc;
    }, {} as Record<string, typeof menuItems>);
  }, [menuItems]);

  const categoryOrder = ['Minuman', 'Makanan', 'Snack'];

  const sortedCategories = useMemo(() => {
    return Object.keys(categorizedMenu).sort((a, b) => {
        const indexA = categoryOrder.indexOf(a);
        const indexB = categoryOrder.indexOf(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });
  }, [categorizedMenu]);
  
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <h1 className="mb-8 text-center font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
        Our Menu
      </h1>
      <div className="space-y-12">
        {sortedCategories.map((category) => (
          <div key={category}>
            <h2 className="mb-6 font-headline text-3xl font-semibold text-gray-800 dark:text-gray-200">
              {category}
            </h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categorizedMenu[category].map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
