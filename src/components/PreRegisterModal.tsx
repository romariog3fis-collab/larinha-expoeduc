import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';

const ROLES: UserRole[] = ['Professor', 'Coordenador', 'Diretor', 'Gestor', 'Outro'];

interface PreRegisterModalProps {
  onComplete: (profile: UserProfile) => void;
}

export const PreRegisterModal: React.FC<PreRegisterModalProps> = ({ onComplete }) => {
  const [form, setForm] = useState({
    name: '',
    school: '',
    city: '',
    role: '' as UserRole | '',
    contact: '',
    email: '',
  });
  const [consented, setConsented] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Informe seu nome completo';
    if (!form.school.trim()) newErrors.school = 'Informe sua escola ou instituição';
    if (!form.city.trim()) newErrors.city = 'Informe sua cidade';
    if (!form.role) newErrors.role = 'Selecione seu perfil';
    if (!form.contact.trim()) newErrors.contact = 'Informe seu contato (WhatsApp/Telefone)';
    if (!consented) newErrors.consent = 'Você precisa aceitar os termos para continuar';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'E-mail inválido';
    }
    return newErrors;
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length === 0) return '';
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const finalValue = name === 'contact' ? formatPhoneNumber(value) : value;
    setForm(prev => ({ ...prev, [name]: finalValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, consentedAt: new Date().toISOString(), consentVersion: '1.0' }),
      });

      if (!response.ok) throw new Error('Falha ao registrar');

      const data = await response.json();
      onComplete(data.profile as UserProfile);
    } catch (err) {
      console.error('Erro no cadastro:', err);
      // Fallback: create profile locally so user isn't blocked
      const fallbackProfile: UserProfile = {
        id: Date.now().toString(),
        name: form.name.trim(),
        school: form.school.trim(),
        city: form.city.trim(),
        role: form.role as UserRole,
        contact: form.contact.trim(),
        email: form.email.trim() || undefined,
        registeredAt: new Date().toISOString(),
      };
      onComplete(fallbackProfile);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(14,165,233,0.18) 0%, rgba(99,102,241,0.18) 100%)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div
        className="relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.92)',
          border: '1.5px solid rgba(14,165,233,0.18)',
          boxShadow: '0 8px 48px 0 rgba(14,165,233,0.18), 0 2px 8px 0 rgba(0,0,0,0.08)',
          animation: 'slideUpFade 0.5s cubic-bezier(.22,1,.36,1) both',
        }}
      >
        {/* Header gradient strip */}
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #0ea5e9, #6366f1, #0ea5e9)', backgroundSize: '200%', animation: 'shimmer 3s linear infinite' }} />

        <div className="p-6 pb-5">
          {/* Greeting */}
          <div className="mb-5">
            <h2 className="font-bold text-slate-900 text-lg leading-tight">
              Olá, educador(a)! 🎉
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">
              Antes de voarmos juntos pela ExpoEduc 2026, me conta um pouquinho sobre você!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-3">
            {/* Nome */}
            <Field
              label="Nome completo"
              id="name"
              name="name"
              type="text"
              placeholder="Ex: Maria da Silva"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              icon="👤"
            />

            {/* Escola */}
            <Field
              label="Escola / Instituição"
              id="school"
              name="school"
              type="text"
              placeholder="Ex: EMEF João Paulo II"
              value={form.school}
              onChange={handleChange}
              error={errors.school}
              icon="🏫"
            />

            {/* Cidade + Perfil (lado a lado) */}
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Cidade / Estado"
                id="city"
                name="city"
                type="text"
                placeholder="Ex: Natal/RN"
                value={form.city}
                onChange={handleChange}
                error={errors.city}
                icon="📍"
              />
              {/* Role Select */}
              <div>
                <label htmlFor="role" className="block text-[11px] font-semibold text-slate-600 mb-1">
                  <span className="mr-1">🎓</span>Perfil
                </label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className={`w-full text-xs rounded-xl border px-3 py-2.5 bg-white text-slate-800 appearance-none cursor-pointer transition-all outline-none focus:ring-2 focus:ring-sky-400/40 ${
                    errors.role ? 'border-rose-400 bg-rose-50' : 'border-slate-200 focus:border-sky-400'
                  }`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '16px', paddingRight: '28px' }}
                >
                  <option value="">Selecione...</option>
                  {ROLES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                {errors.role && <p className="text-[10px] text-rose-500 mt-1">{errors.role}</p>}
              </div>
            </div>

            {/* Contato */}
            <Field
              label="Contato (WhatsApp / Telefone)"
              id="contact"
              name="contact"
              type="text"
              placeholder="Ex: (84) 99999-0000"
              value={form.contact}
              onChange={handleChange}
              error={errors.contact}
              icon="📱"
            />

            {/* E-mail (opcional) */}
            <Field
              label="E-mail (opcional — para receber informações do evento)"
              id="email"
              name="email"
              type="email"
              placeholder="Ex: maria@escola.edu.br"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              icon="✉️"
              optional
            />

            {/* LGPD Consent Checkbox */}
            <div className="mt-1">
              <label className={`flex items-start gap-2.5 cursor-pointer group p-2.5 rounded-xl border transition-all ${
                errors.consent ? 'border-rose-300 bg-rose-50/50' : consented ? 'border-sky-200 bg-sky-50/30' : 'border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="checkbox"
                  checked={consented}
                  onChange={(e) => {
                    setConsented(e.target.checked);
                    if (errors.consent) setErrors(prev => ({ ...prev, consent: '' }));
                  }}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-400/40 cursor-pointer shrink-0"
                />
                <span className="text-[11px] text-slate-600 leading-snug">
                  Li e concordo com a{' '}
                  <a href="/privacidade" target="_blank" rel="noopener noreferrer" className="text-sky-600 font-semibold hover:underline">Política de Privacidade</a>
                  {' '}e os{' '}
                  <a href="/termos" target="_blank" rel="noopener noreferrer" className="text-sky-600 font-semibold hover:underline">Termos de Uso</a>.
                  Autorizo o tratamento dos meus dados pessoais para fins exclusivos do evento ExpoEduc 2026, conforme a LGPD (Lei nº 13.709/2018).
                </span>
              </label>
              {errors.consent && <p className="text-[10px] text-rose-500 mt-1 ml-2">{errors.consent}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !consented}
              className="w-full mt-2 py-3 px-6 rounded-2xl text-white font-bold text-sm transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
              style={{
                background: (isLoading || !consented)
                  ? 'linear-gradient(135deg, #94a3b8, #94a3b8)'
                  : 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                boxShadow: (isLoading || !consented) ? 'none' : '0 4px 20px rgba(14,165,233,0.35)',
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Registrando...
                </span>
              ) : (
                <span>Entrar na ExpoEduc 2026 🦜✨</span>
              )}
            </button>

            <p className="text-center text-[10px] text-slate-400 leading-tight">
              Ao se cadastrar, você concorda com nossa <a href="/privacidade" target="_blank" className="text-sky-500 hover:underline">Política de Privacidade</a> e{' '}
              <a href="/termos" target="_blank" className="text-sky-500 hover:underline">Termos de Uso</a>, conforme a LGPD (Lei nº 13.709/2018).
            </p>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bounceIn {
          0%   { opacity: 0; transform: scale(0.5) rotate(-10deg); }
          70%  { transform: scale(1.1) rotate(3deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes shimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </div>
  );
};

/* ─── Reusable Field ─────────────────────────────────────────────────── */
interface FieldProps {
  label: string;
  id: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon: string;
  optional?: boolean;
}

const Field: React.FC<FieldProps> = ({ label, id, name, type, placeholder, value, onChange, error, icon, optional }) => (
  <div>
    <label htmlFor={id} className="block text-[11px] font-semibold text-slate-600 mb-1">
      <span className="mr-1">{icon}</span>{label}
      {optional && <span className="ml-1 text-slate-400 font-normal">(opcional)</span>}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full text-xs rounded-xl border px-3 py-2.5 bg-white text-slate-800 placeholder-slate-300 transition-all outline-none focus:ring-2 focus:ring-sky-400/40 ${
        error ? 'border-rose-400 bg-rose-50' : 'border-slate-200 focus:border-sky-400'
      }`}
    />
    {error && <p className="text-[10px] text-rose-500 mt-1">{error}</p>}
  </div>
);
