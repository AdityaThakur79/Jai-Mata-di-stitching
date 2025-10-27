import NodeCache from 'node-cache';

class CacheService {
  constructor() {
    // Create cache instances for different data types
    this.orderCache = new NodeCache({ 
      stdTTL: 300, // 5 minutes
      checkperiod: 60, // Check for expired keys every minute
      useClones: false // Better performance
    });
    
    this.clientCache = new NodeCache({ 
      stdTTL: 600, // 10 minutes
      checkperiod: 120,
      useClones: false
    });
    
    this.itemCache = new NodeCache({ 
      stdTTL: 1800, // 30 minutes
      checkperiod: 300,
      useClones: false
    });
    
    this.fabricCache = new NodeCache({ 
      stdTTL: 1800, // 30 minutes
      checkperiod: 300,
      useClones: false
    });
    
    this.branchCache = new NodeCache({ 
      stdTTL: 3600, // 1 hour
      checkperiod: 600,
      useClones: false
    });
  }

  /**
   * Get cached data
   */
  get(cacheType, key) {
    const cache = this.getCacheInstance(cacheType);
    return cache.get(key);
  }

  /**
   * Set cached data
   */
  set(cacheType, key, data, ttl = null) {
    const cache = this.getCacheInstance(cacheType);
    if (ttl) {
      cache.set(key, data, ttl);
    } else {
      cache.set(key, data);
    }
  }

  /**
   * Delete cached data
   */
  del(cacheType, key) {
    const cache = this.getCacheInstance(cacheType);
    cache.del(key);
  }

  /**
   * Clear all cache for a type
   */
  flush(cacheType) {
    const cache = this.getCacheInstance(cacheType);
    cache.flushAll();
  }

  /**
   * Get cache statistics
   */
  getStats(cacheType) {
    const cache = this.getCacheInstance(cacheType);
    return cache.getStats();
  }

  /**
   * Get all cache statistics
   */
  getAllStats() {
    return {
      orders: this.orderCache.getStats(),
      clients: this.clientCache.getStats(),
      items: this.itemCache.getStats(),
      fabrics: this.fabricCache.getStats(),
      branches: this.branchCache.getStats()
    };
  }

  /**
   * Get cache instance by type
   */
  getCacheInstance(cacheType) {
    switch (cacheType) {
      case 'orders':
        return this.orderCache;
      case 'clients':
        return this.clientCache;
      case 'items':
        return this.itemCache;
      case 'fabrics':
        return this.fabricCache;
      case 'branches':
        return this.branchCache;
      default:
        throw new Error(`Unknown cache type: ${cacheType}`);
    }
  }

  /**
   * Cache order data
   */
  cacheOrder(orderId, orderData) {
    this.set('orders', `order_${orderId}`, orderData);
  }

  /**
   * Get cached order
   */
  getCachedOrder(orderId) {
    return this.get('orders', `order_${orderId}`);
  }

  /**
   * Cache client data
   */
  cacheClients(clientsData) {
    this.set('clients', 'all_clients', clientsData);
  }

  /**
   * Get cached clients
   */
  getCachedClients() {
    return this.get('clients', 'all_clients');
  }

  /**
   * Cache item masters
   */
  cacheItems(itemsData) {
    this.set('items', 'all_items', itemsData);
  }

  /**
   * Get cached items
   */
  getCachedItems() {
    return this.get('items', 'all_items');
  }

  /**
   * Cache fabrics
   */
  cacheFabrics(fabricsData) {
    this.set('fabrics', 'all_fabrics', fabricsData);
  }

  /**
   * Get cached fabrics
   */
  getCachedFabrics() {
    return this.get('fabrics', 'all_fabrics');
  }

  /**
   * Cache branches
   */
  cacheBranches(branchesData) {
    this.set('branches', 'all_branches', branchesData);
  }

  /**
   * Get cached branches
   */
  getCachedBranches() {
    return this.get('branches', 'all_branches');
  }

  /**
   * Invalidate order cache when order is updated
   */
  invalidateOrder(orderId) {
    this.del('orders', `order_${orderId}`);
  }

  /**
   * Invalidate all caches (useful for admin operations)
   */
  invalidateAll() {
    this.orderCache.flushAll();
    this.clientCache.flushAll();
    this.itemCache.flushAll();
    this.fabricCache.flushAll();
    this.branchCache.flushAll();
    console.log('All caches invalidated');
  }
}

export default new CacheService();
