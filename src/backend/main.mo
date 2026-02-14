import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";



actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type SupplierId = Principal;
  type ProductId = Text;
  type CategoryId = Text;
  type CustomerId = Principal;

  public type UserProfile = {
    name : Text;
    email : Text;
    isSupplier : Bool;
  };

  public type SupplierProfile = {
    id : SupplierId;
    name : Text;
    description : Text;
    contactInfo : Text;
  };

  public type Product = {
    id : ProductId;
    supplierId : SupplierId;
    categoryId : CategoryId;
    name : Text;
    description : Text;
    price : Nat;
    images : [Storage.ExternalBlob];
    stockQuantity : Nat;
  };

  public type Category = {
    id : CategoryId;
    name : Text;
    description : Text;
    createdBy : SupplierId;
  };

  public type OrderItem = {
    productId : ProductId;
    quantity : Nat;
    price : Nat;
  };

  public type Order = {
    id : Text;
    customerId : CustomerId;
    items : [OrderItem];
    totalAmount : Nat;
    paymentStatus : Text;
    createdAt : Int;
  };

  public type CartItem = {
    productId : ProductId;
    quantity : Nat;
  };

  public type CheckoutRequest = {
    items : [Stripe.ShoppingItem];
    successUrl : Text;
    cancelUrl : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let suppliers = Map.empty<SupplierId, SupplierProfile>();
  let products = Map.empty<ProductId, Product>();
  let categories = Map.empty<CategoryId, Category>();
  let orders = Map.empty<Text, Order>();
  let carts = Map.empty<CustomerId, List.List<CartItem>>();

  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  // User Profile Management (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Stripe Integration Functions
  public query ({ caller }) func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Error: Stripe needs to be first configured") };
      case (?config) { config };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };

    await Stripe.createCheckoutSession(
      getStripeConfiguration(),
      caller,
      items,
      successUrl,
      cancelUrl,
      transform
    );
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Supplier Management
  public shared ({ caller }) func registerSupplier(name : Text, description : Text, contactInfo : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register as suppliers");
    };

    let profile : SupplierProfile = {
      id = caller;
      name;
      description;
      contactInfo;
    };

    suppliers.add(caller, profile);

    // Update isSupplier flag in user profile
    switch (userProfiles.get(caller)) {
      case (null) {
        // If no user profile exists, create one with minimal info
        let newUserProfile : UserProfile = {
          name = name; // Store name as user name
          email = "";
          isSupplier = true;
        };
        userProfiles.add(caller, newUserProfile);
      };
      case (?existing) {
        let updatedProfile : UserProfile = {
          name = existing.name;
          email = existing.email;
          isSupplier = true;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public query func getSupplier(id : SupplierId) : async ?SupplierProfile {
    suppliers.get(id);
  };

  public query func getAllSuppliers() : async [SupplierProfile] {
    suppliers.values().toArray();
  };

  public shared ({ caller }) func updateSupplier(name : Text, description : Text, contactInfo : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update supplier profiles");
    };

    switch (suppliers.get(caller)) {
      case (null) { Runtime.trap("Error: Supplier profile not found") };
      case (?existing) {
        let updated : SupplierProfile = {
          id = caller;
          name;
          description;
          contactInfo;
        };
        suppliers.add(caller, updated);
      };
    };
  };

  // New function to update supplier only if they already have a profile
  public shared ({ caller }) func updateExistingSupplier(name : Text, description : Text, contactInfo : Text) : async SupplierProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update supplier profiles");
    };

    switch (suppliers.get(caller)) {
      case (null) { Runtime.trap("Error: Supplier profile not found") };
      case (?existing) {
        let updated : SupplierProfile = {
          id = caller;
          name;
          description;
          contactInfo;
        };
        suppliers.add(caller, updated);

        // Update isSupplier flag in user profile
        switch (userProfiles.get(caller)) {
          case (null) {
            // If no user profile exists, create one with minimal info
            let newUserProfile : UserProfile = {
              name = name; // Store name as user name
              email = "";
              isSupplier = true;
            };
            userProfiles.add(caller, newUserProfile);
          };
          case (?existingUser) {
            let updatedProfile : UserProfile = {
              name = existingUser.name;
              email = existingUser.email;
              isSupplier = true;
            };
            userProfiles.add(caller, updatedProfile);
          };
        };

        updated;
      };
    };
  };

  // Category Management
  public shared ({ caller }) func addCategory(name : Text, description : Text) : async CategoryId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add categories");
    };

    let categoryId = name.concat("-").concat(Int.toText(Time.now()));
    let category : Category = {
      id = categoryId;
      name;
      description;
      createdBy = caller;
    };

    categories.add(categoryId, category);
    categoryId;
  };

  public query func getCategory(id : CategoryId) : async ?Category {
    categories.get(id);
  };

  public query func getAllCategories() : async [Category] {
    categories.values().toArray();
  };

  // Inventory Management
  public shared ({ caller }) func addProduct(categoryId : CategoryId, name : Text, description : Text, price : Nat, stockQuantity : Nat) : async ProductId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add products");
    };

    // Verify caller is a registered supplier
    switch (suppliers.get(caller)) {
      case (null) { Runtime.trap("Error: Only registered suppliers can add products") };
      case (?supplier) {
        let productId = caller.toText().concat("-").concat(name).concat("-").concat(Int.toText(Time.now()));
        let product : Product = {
          id = productId;
          supplierId = caller;
          categoryId;
          name;
          description;
          price;
          images = [];
          stockQuantity;
        };

        products.add(productId, product);
        productId;
      };
    };
  };

  public shared ({ caller }) func updateProduct(productId : ProductId, name : Text, description : Text, categoryId : CategoryId, price : Nat, stockQuantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update products");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Error: Product not found") };
      case (?existing) {
        // Verify caller owns this product
        if (existing.supplierId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the product owner or admin can update this product");
        };

        let updated : Product = {
          id = productId;
          supplierId = existing.supplierId;
          categoryId;
          name;
          description;
          price;
          images = existing.images;
          stockQuantity;
        };
        products.add(productId, updated);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(productId : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete products");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Error: Product not found") };
      case (?existing) {
        // Verify caller owns this product
        if (existing.supplierId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the product owner or admin can delete this product");
        };

        products.remove(productId);
      };
    };
  };

  public shared ({ caller }) func updateProductStock(productId : ProductId, newQuantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update stock");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Error: Product not found") };
      case (?existing) {
        // Verify caller owns this product
        if (existing.supplierId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the product owner or admin can update stock");
        };

        let updated : Product = {
          id = existing.id;
          supplierId = existing.supplierId;
          categoryId = existing.categoryId;
          name = existing.name;
          description = existing.description;
          price = existing.price;
          images = existing.images;
          stockQuantity = newQuantity;
        };
        products.add(productId, updated);
      };
    };
  };

  public query func getProduct(id : ProductId) : async ?Product {
    products.get(id);
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getSupplierProducts(supplierId : SupplierId) : async [Product] {
    products.values().filter(func(p : Product) : Bool { p.supplierId == supplierId }).toArray();
  };

  // Filter Products by Category - Available to all users including guests for browsing
  public query func getProductsByCategory(categoryId : CategoryId) : async [Product] {
    products.values().filter(func(p : Product) : Bool { p.categoryId == categoryId }).toArray();
  };

  // Cart/Shopping Cart Operations
  public shared ({ caller }) func addToCart(productId : ProductId, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add to cart");
    };

    let newList = List.singleton<{ productId : ProductId; quantity : Nat }>({ productId; quantity });
    switch (carts.get(caller)) {
      case (null) {
        carts.add(caller, newList);
      };
      case (?existing) {
        existing.add({ productId; quantity });
      };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can clear cart");
    };

    carts.remove(caller);
  };

  // Order Management
  public shared ({ caller }) func createOrder(items : [OrderItem], totalAmount : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create orders");
    };

    // Verify stock availability and reduce inventory
    for (item in items.vals()) {
      switch (products.get(item.productId)) {
        case (null) { Runtime.trap("Error: Product not found: " # item.productId) };
        case (?product) {
          if (product.stockQuantity < item.quantity) {
            Runtime.trap("Error: Insufficient stock for product: " # product.name);
          };

          // Reduce stock
          let updatedProduct : Product = {
            id = product.id;
            supplierId = product.supplierId;
            categoryId = product.categoryId;
            name = product.name;
            description = product.description;
            price = product.price;
            images = product.images;
            stockQuantity = product.stockQuantity - item.quantity;
          };
          products.add(item.productId, updatedProduct);
        };
      };
    };

    let orderId = caller.toText().concat("-order-").concat(Int.toText(Time.now()));
    let order : Order = {
      id = orderId;
      customerId = caller;
      items;
      totalAmount;
      paymentStatus = "pending";
      createdAt = Time.now();
    };

    orders.add(orderId, order);
    carts.remove(caller); // Clear the cart after the order is created
    orderId;
  };

  public query ({ caller }) func getOrder(id : Text) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view orders");
    };

    switch (orders.get(id)) {
      case (null) { null };
      case (?order) {
        // Users can only view their own orders, admins can view all
        if (order.customerId == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?order;
        } else {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
      };
    };
  };

  public query ({ caller }) func getCustomerOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view orders");
    };

    orders.values().filter(func(o : Order) : Bool { o.customerId == caller }).toArray();
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };

    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, paymentStatus : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Error: Order not found") };
      case (?existing) {
        let updated : Order = {
          id = existing.id;
          customerId = existing.customerId;
          items = existing.items;
          totalAmount = existing.totalAmount;
          paymentStatus;
          createdAt = existing.createdAt;
        };
        orders.add(orderId, updated);
      };
    };
  };

  // Helper Functions for Seller Dashboard

  // Fetch the caller's supplier profile, verifies existence before returning
  public query ({ caller }) func getCallerSupplierProfile() : async ?SupplierProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access dashboard");
    };

    // Verify caller is actually a supplier
    switch (suppliers.get(caller)) {
      case (null) { Runtime.trap("Unauthorized: Only registered suppliers can access supplier dashboard") };
      case (?profile) { ?profile };
    };
  };

  // Fetch all products belonging to the caller (seller)
  public query ({ caller }) func getCallerSupplierProducts() : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access dashboard");
    };

    // Verify caller is actually a supplier
    switch (suppliers.get(caller)) {
      case (null) { Runtime.trap("Unauthorized: Only registered suppliers can access supplier dashboard") };
      case (?profile) {
        products.values().filter(func(p : Product) : Bool { p.supplierId == caller }).toArray();
      };
    };
  };
};
