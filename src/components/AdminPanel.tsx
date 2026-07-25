import React, { useState } from 'react';

const ADMIN_EMAIL = 'romariog3.fis@gmail.com';
const ADMIN_PASSWORD = 'Teachy@ExpoEduc26';

interface Registration {
  id: string;
  name: string;
  school: string;
  city: string;
  role: string;
  contact: string;
  email?: string;
  registeredAt: string;
}

type AdminView = 'login' | 'dashboard';

export const AdminPanel: React.FC = () => {
  const [view, setView] = useState<AdminView>('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (
      loginForm.email.trim().toLowerCase() === ADMIN_EMAIL &&
      loginForm.password === ADMIN_PASSWORD
    ) {
      setView('dashboard');
      fetchRegistrations();
    } else {
      setLoginError('E-mail ou senha incorretos.');
    }
  };

  const fetchRegistrations = async () => {
    setIsLoadingData(true);
    try {
      const res = await fetch('/api/admin/registrations', {
        headers: { 'X-Admin-Key': 'Teachy@ExpoEduc26' },
      });
      if (!res.ok) throw new Error('Unauthorized');
      const data = await res.json();
      setRegistrations(data.registrations || []);
    } catch (err) {
      console.error('Erro ao carregar cadastros:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Nome', 'Escola', 'Cidade', 'Perfil', 'Contato', 'E-mail', 'Data de Cadastro'];
    const rows = registrations.map(r => [
      r.id,
      r.name,
      r.school,
      r.city,
      r.role,
      r.contact,
      r.email || '',
      new Date(r.registeredAt).toLocaleString('pt-BR'),
    ]);
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `larinha-cadastros-expoeduc2026-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = registrations.filter(r => {
    const q = searchTerm.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.school.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.role.toLowerCase().includes(q)
    );
  });

  const ROLE_COLORS: Record<string, string> = {
    Professor: 'bg-sky-100 text-sky-700',
    Coordenador: 'bg-indigo-100 text-indigo-700',
    Diretor: 'bg-purple-100 text-purple-700',
    Gestor: 'bg-emerald-100 text-emerald-700',
    Outro: 'bg-slate-100 text-slate-700',
  };

  /* ── Login ─────────────────────────────────────────────────────── */
  if (view === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0c1a35 100%)' }}
      >
        <div
          className="w-full max-w-sm rounded-3xl p-8"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 48px 0 rgba(14,165,233,0.18)',
          }}
        >
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🦜</div>
            <h1 className="text-white font-bold text-xl">Painel Administrativo</h1>
            <p className="text-slate-400 text-sm mt-1">Larinha ExpoEduc 2026</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">E-mail</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                placeholder="seu@email.com"
                className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Senha</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 transition-all"
                required
              />
            </div>
            {loginError && (
              <p className="text-rose-400 text-xs text-center font-medium">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl text-white font-bold text-sm transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', boxShadow: '0 4px 20px rgba(14,165,233,0.35)' }}
            >
              Acessar Painel
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ── Dashboard ──────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen font-sans"
      style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)' }}
    >
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: 'linear-gradient(135deg, #e0f2fe, #ede9fe)' }}>
            🦜
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base">Painel de Cadastros</h1>
            <p className="text-xs text-slate-500">ExpoEduc 2026 — Larinha Teachy</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchRegistrations}
            className="text-xs text-slate-500 hover:text-sky-600 flex items-center gap-1.5 border border-slate-200 px-3 py-2 rounded-xl hover:border-sky-300 transition-all"
          >
            🔄 Atualizar
          </button>
          <button
            onClick={exportCSV}
            disabled={registrations.length === 0}
            className="text-xs font-bold text-white px-4 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}
          >
            ⬇️ Exportar CSV
          </button>
          <button
            onClick={() => setView('login')}
            className="text-xs text-slate-400 hover:text-slate-700 border border-slate-200 px-3 py-2 rounded-xl transition-all"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total de Cadastros', value: registrations.length, icon: '👥', color: 'text-sky-600' },
            { label: 'Professores', value: registrations.filter(r => r.role === 'Professor').length, icon: '📚', color: 'text-indigo-600' },
            { label: 'Gestores', value: registrations.filter(r => ['Diretor', 'Coordenador', 'Gestor'].includes(r.role)).length, icon: '🏫', color: 'text-emerald-600' },
            { label: 'Com E-mail', value: registrations.filter(r => r.email).length, icon: '✉️', color: 'text-purple-600' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              <p className="text-lg mt-0.5">{stat.icon}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-4 px-4 py-3 flex items-center gap-3">
          <span className="text-slate-400 text-base">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nome, escola, cidade ou perfil..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 text-sm text-slate-700 placeholder-slate-400 outline-none bg-transparent"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-700 text-xs">✕</button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoadingData ? (
            <div className="flex items-center justify-center p-16 text-slate-400 text-sm gap-3">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Carregando cadastros...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center p-16 text-slate-400">
              <p className="text-4xl mb-3">🦜</p>
              <p className="text-sm font-medium">{registrations.length === 0 ? 'Nenhum cadastro ainda.' : 'Nenhum resultado encontrado.'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {['#', 'Nome', 'Escola', 'Cidade', 'Perfil', 'Contato', 'E-mail', 'Data'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id} className="border-b border-slate-50 hover:bg-sky-50/30 transition-colors">
                      <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{r.name}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap max-w-[180px] truncate">{r.school}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{r.city}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${ROLE_COLORS[r.role] || ROLE_COLORS.Outro}`}>
                          {r.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{r.contact}</td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {r.email ? (
                          <a href={`mailto:${r.email}`} className="text-sky-600 hover:underline">{r.email}</a>
                        ) : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                        {new Date(r.registeredAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {filtered.length > 0 && (
          <p className="text-xs text-slate-400 text-right mt-3">
            Exibindo {filtered.length} de {registrations.length} cadastros
          </p>
        )}
      </main>
    </div>
  );
};
