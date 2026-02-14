import { useState } from 'react';
import { Button } from './ui/button';
import { useIsCallerAdmin, useAddProduct } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Database } from 'lucide-react';

export default function AdminSeedButton() {
  const { data: isAdmin } = useIsCallerAdmin();
  const [isSeeding, setIsSeeding] = useState(false);
  const addProduct = useAddProduct();

  if (!isAdmin) return null;

  const seedDemoData = async () => {
    setIsSeeding(true);
    try {
      const demoProducts = [
        {
          categoryId: '',
          name: 'Wireless Bluetooth Headphones',
          description: 'Premium noise-cancelling headphones with 30-hour battery life and superior sound quality',
          price: BigInt(7999),
          stockQuantity: BigInt(45),
        },
        {
          categoryId: '',
          name: 'Smart Fitness Watch',
          description: 'Track your health and fitness with advanced sensors, heart rate monitoring, and GPS',
          price: BigInt(12999),
          stockQuantity: BigInt(23),
        },
        {
          categoryId: '',
          name: 'Portable Bluetooth Speaker',
          description: 'Waterproof speaker with 360-degree sound and 20-hour battery life',
          price: BigInt(5999),
          stockQuantity: BigInt(67),
        },
        {
          categoryId: '',
          name: 'USB-C Fast Charger',
          description: '65W fast charging adapter compatible with laptops, tablets, and smartphones',
          price: BigInt(3499),
          stockQuantity: BigInt(120),
        },
        {
          categoryId: '',
          name: 'Wireless Gaming Mouse',
          description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons',
          price: BigInt(6999),
          stockQuantity: BigInt(34),
        },
      ];

      for (const product of demoProducts) {
        await addProduct.mutateAsync(product);
      }

      toast.success('Demo products added successfully!');
    } catch (error) {
      console.error('Seeding error:', error);
      toast.error('Failed to seed demo data');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Button
      onClick={seedDemoData}
      disabled={isSeeding}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Database className="h-4 w-4" />
      {isSeeding ? 'Seeding...' : 'Seed Demo Products'}
    </Button>
  );
}
