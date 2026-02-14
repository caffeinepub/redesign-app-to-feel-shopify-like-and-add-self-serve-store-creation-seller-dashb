import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Product {
    id: ProductId;
    stockQuantity: bigint;
    name: string;
    description: string;
    price: bigint;
    supplierId: SupplierId;
    images: Array<ExternalBlob>;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface OrderItem {
    productId: ProductId;
    quantity: bigint;
    price: bigint;
}
export interface Order {
    id: string;
    paymentStatus: string;
    createdAt: bigint;
    totalAmount: bigint;
    customerId: CustomerId;
    items: Array<OrderItem>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface SupplierProfile {
    id: SupplierId;
    contactInfo: string;
    name: string;
    description: string;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export type CustomerId = Principal;
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type SupplierId = Principal;
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export type ProductId = string;
export interface UserProfile {
    name: string;
    email: string;
    isSupplier: boolean;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(name: string, description: string, price: bigint, stockQuantity: bigint): Promise<ProductId>;
    addToCart(productId: ProductId, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createOrder(items: Array<OrderItem>, totalAmount: bigint): Promise<string>;
    deleteProduct(productId: ProductId): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getAllSuppliers(): Promise<Array<SupplierProfile>>;
    getCallerSupplierProducts(): Promise<Array<Product>>;
    getCallerSupplierProfile(): Promise<SupplierProfile | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomerOrders(): Promise<Array<Order>>;
    getOrder(id: string): Promise<Order | null>;
    getProduct(id: ProductId): Promise<Product | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getSupplier(id: SupplierId): Promise<SupplierProfile | null>;
    getSupplierProducts(supplierId: SupplierId): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    registerSupplier(name: string, description: string, contactInfo: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateExistingSupplier(name: string, description: string, contactInfo: string): Promise<SupplierProfile>;
    updateOrderStatus(orderId: string, paymentStatus: string): Promise<void>;
    updateProduct(productId: ProductId, name: string, description: string, price: bigint, stockQuantity: bigint): Promise<void>;
    updateProductStock(productId: ProductId, newQuantity: bigint): Promise<void>;
    updateSupplier(name: string, description: string, contactInfo: string): Promise<void>;
}
