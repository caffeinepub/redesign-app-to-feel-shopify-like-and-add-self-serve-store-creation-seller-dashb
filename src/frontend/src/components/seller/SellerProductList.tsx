import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Input } from '../ui/input';
import { Edit, Trash2, Package, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useDeleteProduct, useUpdateProductStock } from '../../hooks/useQueries';
import type { Product } from '../../backend';
import ProductFormDialog from './ProductFormDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface SellerProductListProps {
  products: Product[];
  isLoading: boolean;
}

export default function SellerProductList({ products, isLoading }: SellerProductListProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [stockValue, setStockValue] = useState<string>('');
  const deleteProduct = useDeleteProduct();
  const updateStock = useUpdateProductStock();

  const handleDelete = async () => {
    if (!deletingProductId) return;

    try {
      await deleteProduct.mutateAsync(deletingProductId);
      toast.success('Product deleted successfully');
      setDeletingProductId(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete product');
    }
  };

  const startEditingStock = (product: Product) => {
    setEditingStockId(product.id);
    setStockValue(Number(product.stockQuantity).toString());
  };

  const cancelEditingStock = () => {
    setEditingStockId(null);
    setStockValue('');
  };

  const saveStock = async (productId: string) => {
    const newQuantity = parseInt(stockValue);
    if (isNaN(newQuantity) || newQuantity < 0) {
      toast.error('Please enter a valid stock quantity');
      return;
    }

    try {
      await updateStock.mutateAsync({
        productId,
        newQuantity: BigInt(newQuantity),
      });
      toast.success('Stock updated successfully');
      setEditingStockId(null);
      setStockValue('');
    } catch (error) {
      console.error('Stock update error:', error);
      toast.error('Failed to update stock');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-1">No Products Yet</h3>
        <p className="text-sm text-muted-foreground">
          Add your first product to start selling
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {product.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  ${(Number(product.price) / 100).toFixed(2)}
                </TableCell>
                <TableCell>
                  {editingStockId === product.id ? (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0"
                        value={stockValue}
                        onChange={(e) => setStockValue(e.target.value)}
                        className="w-20 h-8"
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => saveStock(product.id)}
                        disabled={updateStock.isPending}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={cancelEditingStock}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditingStock(product)}
                      className="hover:underline"
                    >
                      {Number(product.stockQuantity)}
                    </button>
                  )}
                </TableCell>
                <TableCell>
                  {Number(product.stockQuantity) === 0 ? (
                    <Badge variant="destructive">Out of Stock</Badge>
                  ) : Number(product.stockQuantity) < 20 ? (
                    <Badge variant="destructive">Low Stock</Badge>
                  ) : (
                    <Badge variant="secondary">In Stock</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingProductId(product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductFormDialog
        open={!!editingProduct}
        onOpenChange={(open) => !open && setEditingProduct(null)}
        product={editingProduct || undefined}
      />

      <AlertDialog open={!!deletingProductId} onOpenChange={(open) => !open && setDeletingProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
