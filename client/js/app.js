/**
 * ARCANJO MIGUEL - Frontend Application
 * Versão Final Definitiva: Listagens, Históricos, Permissões e Eventos
 */

class App {
  constructor() {
    this.user = null;
    this.token = localStorage.getItem('token');
    this.apiUrl = '/api';
    this.currentView = 'dashboard';
    
    this.init();
  }

  async init() {
    console.log('Inicializando aplicação...');
    
    if (this.token) {
      const isValid = await this.verifyToken();
      if (isValid) {
        this.showMainApp();
      } else {
        this.showLogin();
      }
    } else {
      this.showLogin();
    }

    this.setupEventListeners();
  }

  async verifyToken() {
    try {
      const response = await fetch(`${this.apiUrl}/auth/verify`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        this.user = data.user;
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-view]');
      if (link) {
        e.preventDefault();
        const view = link.getAttribute('data-view');
        this.navigateTo(view);
      }

      if (e.target.id === 'logout-btn') {
        this.logout();
      }
    });

    document.addEventListener('submit', async (e) => {
      if (e.target.id === 'login-form') {
        e.preventDefault();
        const email = document.getElementById('openId').value;
        const senha = document.getElementById('senha').value;
        await this.login(email, senha);
      }
      
      if (e.target.id === 'register-form') {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const endereco = document.getElementById('endereco').value;
        const senha = document.getElementById('reg-senha').value;
        const confirmaSenha = document.getElementById('reg-confirmaSenha').value;
        await this.register(nome, email, telefone, endereco, senha, confirmaSenha);
      }
    });
  }

  async login(email, senha) {
    try {
      const response = await fetch(`${this.apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('token', this.token);
        this.showMainApp();
      } else {
        const error = await response.json();
        alert('Erro ao fazer login: ' + (error.error || 'Verifique as credenciais.'));
      }
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro de conexão com o servidor.');
    }
  }

  async register(nome, email, telefone, endereco, senha, confirmaSenha) {
    try {
      const response = await fetch(`${this.apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, telefone, endereco, senha, confirmaSenha })
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('token', this.token);
        alert('Cadastro realizado com sucesso!');
        this.showMainApp();
      } else {
        const error = await response.json();
        alert('Erro ao registrar: ' + (error.error || 'Tente novamente.'));
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      alert('Erro de conexão com o servidor.');
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    this.showLogin();
  }

  navigateTo(view) {
    this.currentView = view;
    this.render();
  }

  showLogin() {
    const appElement = document.getElementById('app');
    if (!appElement) return;
    appElement.innerHTML = `
      <div class="login-container">
        <div class="login-box">
          <h1>🙏 Arcanjo Miguel</h1>
          <p>Sistema de Gerenciamento</p>
          
          <div id="login-tab" class="tab-content">
            <h3>Entrar</h3>
            <form id="login-form">
              <div class="form-group">
                <label for="openId">Email</label>
                <input type="email" id="openId" placeholder="Digite seu email" required>
              </div>
              <div class="form-group">
                <label for="senha">Senha</label>
                <input type="password" id="senha" placeholder="Digite sua senha" required>
              </div>
              <button type="submit" class="btn-primary">Entrar</button>
            </form>
            <p class="hint">Não tem conta? <a href="#" onclick="document.getElementById('register-tab').style.display='block'; document.getElementById('login-tab').style.display='none';">Cadastre-se aqui</a></p>
          </div>

          <div id="register-tab" class="tab-content" style="display:none;">
            <h3>Cadastro</h3>
            <form id="register-form">
              <div class="form-group">
                <label for="nome">Nome Completo</label>
                <input type="text" id="nome" placeholder="Digite seu nome" required>
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="Digite seu email" required>
              </div>
              <div class="form-group">
                <label for="telefone">Telefone (opcional)</label>
                <input type="tel" id="telefone" placeholder="(XX) XXXXX-XXXX">
              </div>
              <div class="form-group">
                <label for="endereco">Endereço (opcional)</label>
                <input type="text" id="endereco" placeholder="Digite seu endereço">
              </div>
              <div class="form-group">
                <label for="reg-senha">Senha</label>
                <input type="password" id="reg-senha" placeholder="Mínimo 6 caracteres" required>
              </div>
              <div class="form-group">
                <label for="reg-confirmaSenha">Confirmar Senha</label>
                <input type="password" id="reg-confirmaSenha" placeholder="Confirme sua senha" required>
              </div>
              <button type="submit" class="btn-primary">Cadastrar</button>
            </form>
            <p class="hint">Já tem conta? <a href="#" onclick="document.getElementById('register-tab').style.display='none'; document.getElementById('login-tab').style.display='block';">Faça login aqui</a></p>
          </div>
        </div>
      </div>
    `;
  }

  showMainApp() {
    this.render();
  }

  render() {
    const appElement = document.getElementById('app');
    if (!appElement) return;
    
    appElement.innerHTML = `
      <div class="main-layout">
        <nav class="sidebar">
          <div class="sidebar-header">
            <h2>Arcanjo Miguel</h2>
          </div>
          <ul class="nav-links">
            <li><a href="#" data-view="dashboard" class="${this.currentView === 'dashboard' ? 'active' : ''}">🏠 Dashboard</a></li>
            <li><a href="#" data-view="campaigns" class="${this.currentView === 'campaigns' ? 'active' : ''}">📢 Campanhas</a></li>
            <li><a href="#" data-view="events" class="${this.currentView === 'events' ? 'active' : ''}">📅 Eventos</a></li>
            ${this.user.role === 'usuario' ? `
              <li><a href="#" data-view="prayers" class="${this.currentView === 'prayers' ? 'active' : ''}">🙏 Orações</a></li>
              <li><a href="#" data-view="testimonies" class="${this.currentView === 'testimonies' ? 'active' : ''}">✨ Testemunhos</a></li>
              <li><a href="#" data-view="visits" class="${this.currentView === 'visits' ? 'active' : ''}">🏠 Visitas</a></li>
            ` : ''}
            <li><a href="#" data-view="store" class="${this.currentView === 'store' ? 'active' : ''}">🛒 Lojinha</a></li>
            ${this.user.role === 'admin' ? `
              <li class="nav-divider">Administração</li>
              <li><a href="#" data-view="admin-prayers" class="${this.currentView === 'admin-prayers' ? 'active' : ''}">🙏 Orações</a></li>
              <li><a href="#" data-view="admin-testimonies" class="${this.currentView === 'admin-testimonies' ? 'active' : ''}">✨ Testemunhos</a></li>
              <li><a href="#" data-view="admin-visits" class="${this.currentView === 'admin-visits' ? 'active' : ''}">🏠 Visitas</a></li>
              <li><a href="#" data-view="admin-users" class="${this.currentView === 'admin-users' ? 'active' : ''}">👥 Usuários</a></li>
              <li><a href="#" data-view="admin-announcements" class="${this.currentView === 'admin-announcements' ? 'active' : ''}">📣 Anúncios</a></li>
              <li><a href="#" data-view="admin-finance" class="${this.currentView === 'admin-finance' ? 'active' : ''}">💰 Financeiro</a></li>
            ` : ''}
          </ul>
          <div class="sidebar-footer">
            <p>Olá, ${this.user.name}</p>
            <button id="logout-btn" class="btn-text">Sair</button>
          </div>
        </nav>
        <main class="content" id="main-content">
          <div class="loading">Carregando...</div>
        </main>
      </div>
    `;

    this.loadViewData();
  }

  async loadViewData() {
    const content = document.getElementById('main-content');
    if (!content) return;
    
    try {
      switch (this.currentView) {
        case 'dashboard': await this.renderDashboard(content); break;
        case 'campaigns': await this.renderCampaigns(content); break;
        case 'events': await this.renderEvents(content); break;
        case 'prayers': await this.renderPrayers(content); break;
        case 'testimonies': await this.renderTestimonies(content); break;
        case 'visits': await this.renderVisits(content); break;
        case 'admin-prayers': await this.renderAdminPrayers(content); break;
        case 'admin-testimonies': await this.renderAdminTestimonies(content); break;
        case 'admin-visits': await this.renderAdminVisits(content); break;
        case 'store': await this.renderStore(content); break;
        case 'admin-users': await this.renderAdminUsers(content); break;
        case 'admin-announcements': await this.renderAdminAnnouncements(content); break;
        case 'admin-finance': await this.renderAdminFinance(content); break;
      }
    } catch (error) {
      console.error('Erro ao carregar view:', error);
      content.innerHTML = `<div class="error">Erro ao carregar dados: ${error.message}</div>`;
    }
  }

  formatPrice(price) {
    const num = Number(price);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  }

  async fetchApi(endpoint, options = {}) {
    const res = await fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        ...options.headers
      }
    });
    if (!res.ok) throw new Error('Falha na requisição');
    return res.json();
  }

  async renderDashboard(container) {
    const announcements = await this.fetchApi('/announcements');
    container.innerHTML = `
      <header class="view-header"><h1>Bem-vindo, ${this.user.name}</h1></header>
      <section class="dashboard-grid">
        <div class="card verse-card">
          <h3>📖 Versículo do Dia</h3>
          <p class="verse-text">"Tudo posso naquele que me fortalece."</p>
          <p class="verse-ref">Filipenses 4:13</p>
        </div>
        <div class="card announcements-card">
          <h3>📣 Mural de Anúncios</h3>
          <div class="announcements-list">
            ${announcements.length ? announcements.map(a => `
              <div class="announcement-item ${a.prioridade}">
                <h4>${a.titulo}</h4>
                <p>${a.conteudo}</p>
                <small>${new Date(a.criadoEm).toLocaleDateString()}</small>
              </div>
            `).join('') : '<p>Nenhum anúncio no momento.</p>'}
          </div>
        </div>
      </section>
    `;
  }

  async renderCampaigns(container) {
    const campaigns = await this.fetchApi(this.user.role === 'admin' ? '/campaigns/all' : '/campaigns');
    container.innerHTML = `
      <header class="view-header">
        <h1>📢 Campanhas e Votos</h1>
        ${this.user.role === 'admin' ? '<button class="btn-primary" onclick="app.showCampaignForm()">Nova Campanha</button>' : ''}
      </header>
      <div class="campaigns-grid">
        ${campaigns.map(c => `
          <div class="card campaign-card">
            ${c.banner ? `<img src="${c.banner}" class="card-img">` : ''}
            <div class="card-body">
              <h3>${c.nome}</h3>
              <p>${c.descricao}</p>
              <div class="campaign-meta">
                <span class="badge">${c.tipo}</span>
                ${c.valorAlvo ? `<span>Alvo: R$ ${this.formatPrice(c.valorAlvo)}</span>` : ''}
              </div>
              <div class="card-actions">
                <button class="btn-secondary" onclick="app.showContributionForm(${c.id}, '${c.tipo}', ${c.valorAlvo || 0})">Contribuir / Votar</button>
                ${this.user.role === 'admin' ? `
                  <button class="btn-icon" onclick="app.showCampaignForm(${JSON.stringify(c).replace(/"/g, '&quot;')})">✏️</button>
                  <button class="btn-icon red" onclick="app.deleteItem('campaigns', ${c.id})">🗑️</button>
                ` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  async renderEvents(container) {
    const events = await this.fetchApi(this.user.role === 'admin' ? '/events/all' : '/events');
    container.innerHTML = `
      <header class="view-header">
        <h1>📅 Eventos da Igreja</h1>
        ${this.user.role === 'admin' ? '<button class="btn-primary" onclick="app.showEventForm()">Novo Evento</button>' : ''}
      </header>
      <div class="events-grid">
        ${events.map(e => `
          <div class="card event-card">
            ${e.banner ? `<img src="${e.banner}" class="card-img">` : ''}
            <div class="card-body">
              <h3>${e.titulo}</h3>
              <p>${e.descricao}</p>
              <p>📍 ${e.local || 'Igreja'}</p>
              <p>📅 ${new Date(e.dataEvento).toLocaleDateString()} às ${new Date(e.dataEvento).toLocaleTimeString()}</p>
              ${this.user.role === 'admin' ? `
                <div class="card-actions">
                  <button class="btn-icon" onclick="app.showEventForm(${JSON.stringify(e).replace(/"/g, '&quot;')})">✏️</button>
                  <button class="btn-icon red" onclick="app.deleteItem('events', ${e.id})">🗑️</button>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  async renderPrayers(container) {
    const prayers = await this.fetchApi('/prayers');
    container.innerHTML = `
      <header class="view-header">
        <h1>🙏 Meus Pedidos de Oração</h1>
        <button class="btn-primary" onclick="app.showPrayerForm()">Novo Pedido</button>
      </header>
      <div class="prayers-list">
        ${prayers.map(p => `
          <div class="card prayer-card">
            <div class="card-body">
              <h3>${p.titulo}</h3>
              <p>${p.descricao}</p>
              <small>Criado em: ${new Date(p.criadoEm).toLocaleDateString()}</small>
              <div class="card-actions">
                <button class="btn-icon red" onclick="app.deleteItem('prayers', ${p.id})">🗑️</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  async renderTestimonies(container) {
    const testimonies = await this.fetchApi('/testimonies/user');
    container.innerHTML = `
      <header class="view-header">
        <h1>✨ Meus Testemunhos</h1>
        <button class="btn-primary" onclick="app.showTestimonyForm()">Novo Testemunho</button>
      </header>
      <div class="testimonies-list">
        ${testimonies.map(t => `
          <div class="card testimony-card">
            <div class="card-body">
              <h3>${t.titulo}</h3>
              <p>${t.conteudo}</p>
              <span class="badge ${t.status}">${t.status}</span>
              <small>Criado em: ${new Date(t.criadoEm).toLocaleDateString()}</small>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  async renderVisits(container) {
    const visits = await this.fetchApi('/visits');
    container.innerHTML = `
      <header class="view-header">
        <h1>🏠 Minhas Solicitações de Visita</h1>
        <button class="btn-primary" onclick="app.showVisitForm()">Solicitar Visita</button>
      </header>
      <div class="visits-list">
        ${visits.map(v => `
          <div class="card visit-card">
            <div class="card-body">
              <h3>Visita em ${new Date(v.dataRequisitada).toLocaleDateString()} às ${v.horaRequisitada}</h3>
              <p>Motivo: ${v.motivo}</p>
              <span class="badge ${v.status}">${v.status}</span>
              <small>Solicitado em: ${new Date(v.criadoEm).toLocaleDateString()}</small>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  async renderAdminPrayers(container) {
    const prayers = await this.fetchApi('/prayers/all');
    container.innerHTML = `
      <header class="view-header">
        <h1>🙏 Todos os Pedidos de Oração</h1>
      </header>
      <div class="prayers-list">
        ${prayers.map(p => `
          <div class="card prayer-card">
            <div class="card-body">
              <h3>${p.titulo}</h3>
              <p>${p.descricao}</p>
              <small>Usuário: ID ${p.usuarioId} | Criado em: ${new Date(p.criadoEm).toLocaleDateString()}</small>
              <div class="card-actions">
                <button class="btn-icon red" onclick="app.deleteItem('prayers', ${p.id})">🗑️</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  async renderAdminTestimonies(container) {
    const testimonies = await this.fetchApi('/testimonies/pending');
    container.innerHTML = `
      <header class="view-header">
        <h1>✨ Testemunhos Pendentes de Aprovação</h1>
      </header>
      <div class="testimonies-list">
        ${testimonies.map(t => `
          <div class="card testimony-card">
            <div class="card-body">
              <h3>${t.titulo}</h3>
              <p>${t.conteudo}</p>
              <small>Usuário: ID ${t.usuarioId} | Criado em: ${new Date(t.criadoEm).toLocaleDateString()}</small>
              <div class="card-actions">
                <button class="btn-success" onclick="app.updateTestimonyStatus(${t.id}, 'aprovado')">✓ Aprovar</button>
                <button class="btn-danger" onclick="app.updateTestimonyStatus(${t.id}, 'rejeitado')">✗ Rejeitar</button>
                <button class="btn-icon red" onclick="app.deleteItem('testimonies', ${t.id})">🗑️</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  async renderAdminVisits(container) {
    const visits = await this.fetchApi('/visits/pending');
    container.innerHTML = `
      <header class="view-header">
        <h1>🏠 Solicitações de Visita Pendentes</h1>
      </header>
      <div class="visits-list">
        ${visits.map(v => `
          <div class="card visit-card">
            <div class="card-body">
              <h3>Visita em ${new Date(v.dataRequisitada).toLocaleDateString()} às ${v.horaRequisitada}</h3>
              <p>Motivo: ${v.motivo}</p>
              <small>Usuário: ID ${v.usuarioId} | Solicitado em: ${new Date(v.criadoEm).toLocaleDateString()}</small>
              <div class="card-actions">
                <button class="btn-success" onclick="app.updateVisitStatus(${v.id}, 'aprovado')">✓ Aprovar</button>
                <button class="btn-danger" onclick="app.updateVisitStatus(${v.id}, 'rejeitado')">✗ Rejeitar</button>
                <button class="btn-icon red" onclick="app.deleteItem('visits', ${v.id})">🗑️</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  async renderStore(container) {
    const products = await this.fetchApi('/store/products');
    container.innerHTML = `
      <header class="view-header">
        <h1>🛒 Lojinha</h1>
        ${this.user.role === 'admin' ? '<button class="btn-primary" onclick="app.showProductForm()">Novo Produto</button>' : ''}
      </header>
      <div class="store-grid">
        ${products.map(p => `
          <div class="card product-card">
            ${p.imagem ? `<img src="${p.imagem}" class="card-img">` : ''}
            <div class="card-body">
              <h3>${p.nome}</h3>
              <p>${p.descricao}</p>
              <p class="price">R$ ${this.formatPrice(p.preco)}</p>
              <div class="card-actions">
                <button class="btn-secondary" onclick="app.buyProduct(${p.id}, ${p.preco})">Comprar</button>
                ${this.user.role === 'admin' ? `
                  <button class="btn-icon" onclick="app.showProductForm(${JSON.stringify(p).replace(/"/g, '&quot;')})">✏️</button>
                  <button class="btn-icon red" onclick="app.deleteItem('store/products', ${p.id})">🗑️</button>
                ` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  async renderAdminUsers(container) {
    const users = await this.fetchApi('/users');
    container.innerHTML = `
      <header class="view-header"><h1>👥 Usuários</h1></header>
      <div class="users-list">
        <table class="users-table">
          <thead>
            <tr><th>ID</th><th>Nome</th><th>Email</th><th>Função</th><th>Ações</th></tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td>${u.id}</td>
                <td>${u.nome}</td>
                <td>${u.email}</td>
                <td>
                  <select onchange="app.changeUserRole(${u.id}, this.value)">
                    <option value="usuario" ${u.funcao === 'usuario' ? 'selected' : ''}>Usuário</option>
                    <option value="admin" ${u.funcao === 'admin' ? 'selected' : ''}>Admin</option>
                  </select>
                </td>
                <td>Editar</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  async renderAdminAnnouncements(container) {
    const announcements = await this.fetchApi('/announcements');
    container.innerHTML = `
      <header class="view-header">
        <h1>📣 Anúncios</h1>
        <button class="btn-primary" onclick="app.showAnnouncementForm()">Novo Anúncio</button>
      </header>
      <div class="announcements-list">
        ${announcements.map(a => `
          <div class="card announcement-card">
            <div class="card-body">
              <h3>${a.titulo}</h3>
              <p>${a.conteudo}</p>
              <span class="badge">${a.tipo}</span>
              <div class="card-actions">
                <button class="btn-icon" onclick="app.showAnnouncementForm(${JSON.stringify(a).replace(/"/g, '&quot;')})">✏️</button>
                <button class="btn-icon red" onclick="app.deleteItem('announcements', ${a.id})">🗑️</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  async renderAdminFinance(container) {
    const stats = await this.fetchApi('/users/stats');
    container.innerHTML = `
      <header class="view-header"><h1>💰 Financeiro</h1></header>
      <div class="finance-cards">
        <div class="card">
          <h3>Total de Entradas</h3>
          <p class="big-number">R$ ${this.formatPrice(stats.totalEntradas)}</p>
        </div>
        <div class="card">
          <h3>Total de Saídas</h3>
          <p class="big-number">R$ ${this.formatPrice(stats.totalSaidas)}</p>
        </div>
        <div class="card">
          <h3>Saldo</h3>
          <p class="big-number">R$ ${this.formatPrice(stats.saldo)}</p>
        </div>
      </div>
    `;
  }

  buyProduct(id, preco) {
    try {
      this.fetchApi('/store/purchases', {
        method: 'POST',
        body: JSON.stringify({ produtoId: id, quantidade: 1, precoTotal: preco, metodoPagamento: 'PIX' })
      }).then(() => {
        alert('Compra realizada com sucesso!');
        this.loadViewData();
      });
    } catch (error) { alert('Erro ao realizar compra.'); }
  }

  showCampaignForm(data = null) {
    const nome = prompt('Nome da Campanha:', data?.nome || '');
    const descricao = prompt('Descrição da Campanha:', data?.descricao || '');
    const tipo = prompt('Tipo (dizimo/oferta/votacao/especial):', data?.tipo || 'especial');
    const valorAlvo = prompt('Valor Alvo (opcional):', data?.valorAlvo || '');
    if (nome && tipo) {
      const method = data ? 'PUT' : 'POST';
      const url = data ? `/campaigns/${data.id}` : '/campaigns';
      this.fetchApi(url, { method, body: JSON.stringify({ nome, descricao: descricao || null, tipo, valorAlvo: valorAlvo || null, ativa: true }) }).then(() => this.loadViewData());
    }
  }

  showEventForm(data = null) {
    const titulo = prompt('Título do Evento:', data?.titulo || '');
    const dataEvento = prompt('Data e Hora (AAAA-MM-DD HH:MM):', data?.dataEvento ? new Date(data.dataEvento).toISOString().slice(0, 16).replace('T', ' ') : '');
    const local = prompt('Local:', data?.local || 'Igreja');
    const descricao = prompt('Descrição:', data?.descricao || '');
    if (titulo && dataEvento) {
      const method = data ? 'PUT' : 'POST';
      const url = data ? `/events/${data.id}` : '/events';
      this.fetchApi(url, { method, body: JSON.stringify({ titulo, dataEvento, local, descricao, ativo: true }) }).then(() => this.loadViewData());
    }
  }

  showProductForm(data = null) {
    const nome = prompt('Nome do Produto:', data?.nome || '');
    const preco = prompt('Preço:', data?.preco || '');
    const imagem = prompt('URL da Imagem (opcional):', data?.imagem || '');
    if (nome && preco) {
      const method = data ? 'PUT' : 'POST';
      const url = data ? `/store/products/${data.id}` : '/store/products';
      this.fetchApi(url, { method, body: JSON.stringify({ nome, preco, imagem, quantidade: 10 }) }).then(() => this.loadViewData());
    }
  }

  showContributionForm(id, tipo, minValor) {
    const valor = prompt(`Valor da contribuição (${tipo}):`, minValor || '');
    if (valor) {
      if (minValor > 0 && parseFloat(valor) < minValor) {
        alert(`O valor mínimo para esta campanha é R$ ${this.formatPrice(minValor)}`);
        return;
      }
      this.fetchApi('/contributions', {
        method: 'POST',
        body: JSON.stringify({ campanhaId: id, tipo, valor: parseFloat(valor), metodoPagamento: 'pix' })
      }).then(() => alert('Contribuição realizada com sucesso!'));
    }
  }

  showVisitForm() {
    const data = prompt('Data (AAAA-MM-DD):');
    const hora = prompt('Hora (HH:MM):');
    const motivo = prompt('Motivo:');
    if (data && hora && motivo) {
      this.fetchApi('/visits', { method: 'POST', body: JSON.stringify({ dataRequisitada: data, horaRequisitada: hora, motivo }) })
      .then(() => { alert('Solicitação enviada!'); this.loadViewData(); });
    }
  }

  showPrayerForm() {
    const titulo = prompt('Título do Pedido:');
    const descricao = prompt('Descrição:');
    if (titulo && descricao) {
      this.fetchApi('/prayers', { method: 'POST', body: JSON.stringify({ titulo, descricao }) })
      .then(() => { alert('Pedido enviado!'); this.loadViewData(); });
    }
  }

  showTestimonyForm() {
    const titulo = prompt('Título do Testemunho:');
    const conteudo = prompt('Conteúdo:');
    if (titulo && conteudo) {
      this.fetchApi('/testimonies', { method: 'POST', body: JSON.stringify({ titulo, conteudo }) })
      .then(() => { alert('Testemunho enviado para aprovação!'); this.loadViewData(); });
    }
  }

  showAnnouncementForm(data = null) {
    const titulo = prompt('Título do Anúncio:', data?.titulo || '');
    const conteudo = prompt('Conteúdo:', data?.conteudo || '');
    if (titulo && conteudo) {
      const method = data ? 'PUT' : 'POST';
      const url = data ? `/announcements/${data.id}` : '/announcements';
      this.fetchApi(url, { method, body: JSON.stringify({ titulo, conteudo, tipo: 'aviso', prioridade: 'media' }) }).then(() => this.loadViewData());
    }
  }

  async deleteItem(endpoint, id) {
    if (confirm('Tem certeza que deseja deletar?')) {
      try {
        await this.fetchApi(`/${endpoint}/${id}`, { method: 'DELETE' });
        alert('Item deletado com sucesso!');
        this.loadViewData();
      } catch (error) {
        alert('Erro ao deletar item.');
      }
    }
  }

  async updateVisitStatus(id, status) { 
    await this.fetchApi(`/visits/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }); 
    this.loadViewData(); 
  }

  async updateTestimonyStatus(id, status) { 
    await this.fetchApi(`/testimonies/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }); 
    this.loadViewData(); 
  }

  async changeUserRole(id, role) { 
    await this.fetchApi(`/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }); 
    this.loadViewData(); 
  }
}

const app = new App();
window.app = app;
