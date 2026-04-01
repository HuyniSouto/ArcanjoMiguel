/**
 * Utilitários de API
 * Funções auxiliares para fazer requisições ao servidor
 */

export class API {
  static token = localStorage.getItem('token');

  static setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  static getToken() {
    return this.token || localStorage.getItem('token');
  }

  static getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.getToken() && { 'Authorization': `Bearer ${this.getToken()}` }),
    };
  }

  static async request(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return response.json();
  }

  static async get(url) {
    return this.request(url, { method: 'GET' });
  }

  static async post(url, data) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async put(url, data) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async delete(url) {
    return this.request(url, { method: 'DELETE' });
  }

  // Auth
  static async login(openId, name, email) {
    const data = await this.post('/api/auth/login', { openId, name, email });
    this.setToken(data.token);
    return data;
  }

  static async logout() {
    return this.post('/api/auth/logout', {});
  }

  static async verifyToken() {
    return this.get('/api/auth/verify');
  }

  // Users
  static async getMe() {
    return this.get('/api/users/me');
  }

  static async getUser(id) {
    return this.get(`/api/users/${id}`);
  }

  static async getAllUsers() {
    return this.get('/api/users');
  }

  // Campaigns
  static async getCampaigns() {
    return this.get('/api/campaigns');
  }

  static async getCampaign(id) {
    return this.get(`/api/campaigns/${id}`);
  }

  // Contributions
  static async getContributions() {
    return this.get('/api/contributions');
  }

  static async getAllContributions() {
    return this.get('/api/contributions/all');
  }

  // Prayers
  static async getPrayers() {
    return this.get('/api/prayers');
  }

  static async getAllPrayers() {
    return this.get('/api/prayers/all');
  }

  static async getPrayer(id) {
    return this.get(`/api/prayers/${id}`);
  }

  static async getPrayerMessages(id) {
    return this.get(`/api/prayers/${id}/messages`);
  }

  // Testimonies
  static async getTestimonies() {
    return this.get('/api/testimonies');
  }

  static async getUserTestimonies() {
    return this.get('/api/testimonies/user');
  }

  static async getAllTestimonies() {
    return this.get('/api/testimonies/all');
  }

  // Visits
  static async getVisits() {
    return this.get('/api/visits');
  }

  static async getAllVisits() {
    return this.get('/api/visits/all');
  }

  static async getPendingVisits() {
    return this.get('/api/visits/pending');
  }

  // Store
  static async getStoreProducts() {
    return this.get('/api/store/products');
  }

  static async getStoreProduct(id) {
    return this.get(`/api/store/products/${id}`);
  }

  static async getStorePurchases() {
    return this.get('/api/store/purchases');
  }

  static async getAllStorePurchases() {
    return this.get('/api/store/purchases/all');
  }

  // Expenses
  static async getExpenses() {
    return this.get('/api/expenses');
  }

  // Announcements
  static async getAnnouncements() {
    return this.get('/api/announcements');
  }
}
