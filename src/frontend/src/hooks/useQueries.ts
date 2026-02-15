import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@icp-sdk/core/principal';
import type { ShoppingItem, UserProfile, Product, SupplierProfile, Order, OrderItem, Category, ExternalBlob } from '../backend';

export type CheckoutSession = {
  id: string;
  url: string;
};

// User Profile Management
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
      
      if (profile.isSupplier) {
        await actor.registerSupplier(profile.name, '', profile.email);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['callerSupplierProfile'] });
    },
  });
}

// Stripe Configuration
export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['stripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: { secretKey: string; allowedCountries: string[] }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stripeConfigured'] });
    },
  });
}

// Checkout
export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (items: ShoppingItem[]): Promise<CheckoutSession> => {
      if (!actor) throw new Error('Actor not available');
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;
      const result = await actor.createCheckoutSession(items, successUrl, cancelUrl);
      const session = JSON.parse(result) as CheckoutSession;
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      return session;
    },
  });
}

// Supplier Management
export function useGetCallerSupplierProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<SupplierProfile | null>({
    queryKey: ['callerSupplierProfile'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerSupplierProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSupplier(supplierId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<SupplierProfile | null>({
    queryKey: ['supplier', supplierId],
    queryFn: async () => {
      if (!actor) return null;
      const principal = Principal.fromText(supplierId);
      return actor.getSupplier(principal);
    },
    enabled: !!actor && !isFetching && !!supplierId,
  });
}

export function useGetAllSuppliers() {
  const { actor, isFetching } = useActor();

  return useQuery<SupplierProfile[]>({
    queryKey: ['suppliers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSuppliers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterSupplier() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; description: string; contactInfo: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.registerSupplier(data.name, data.description, data.contactInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['callerSupplierProfile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUpdateExistingSupplier() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; description: string; contactInfo: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateExistingSupplier(data.name, data.description, data.contactInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['callerSupplierProfile'] });
    },
  });
}

// Category Management
export function useGetAllCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductsByCategory(categoryId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'category', categoryId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsByCategory(categoryId);
    },
    enabled: !!actor && !isFetching && !!categoryId,
  });
}

// Product Management
export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerSupplierProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['callerSupplierProducts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerSupplierProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSupplierProducts(supplierId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['supplierProducts', supplierId],
    queryFn: async () => {
      if (!actor) return [];
      const principal = Principal.fromText(supplierId);
      return actor.getSupplierProducts(principal);
    },
    enabled: !!actor && !isFetching && !!supplierId,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { 
      categoryId: string;
      name: string; 
      description: string; 
      price: bigint; 
      stockQuantity: bigint;
      images?: ExternalBlob[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProduct(
        data.categoryId,
        data.name, 
        data.description, 
        data.price, 
        data.stockQuantity
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['callerSupplierProducts'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { 
      productId: string; 
      categoryId: string;
      name: string; 
      description: string; 
      price: bigint; 
      stockQuantity: bigint;
      images?: ExternalBlob[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateProduct(
        data.productId, 
        data.name, 
        data.description, 
        data.categoryId,
        data.price, 
        data.stockQuantity
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['callerSupplierProducts'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['callerSupplierProducts'] });
    },
  });
}

export function useUpdateProductStock() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { productId: string; newQuantity: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateProductStock(data.productId, data.newQuantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['callerSupplierProducts'] });
    },
  });
}
