import { Link } from 'react-router-dom'

export const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-[var(--brand-line)] bg-[var(--brand-brown-950)] px-6 py-6 text-[var(--brand-surface)] md:px-10 lg:px-14">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.12em] text-[var(--brand-surface-strong)]">
            MeAudota
          </p>
          <p className="text-sm text-[rgba(248,244,234,0.78)]">
            Conectando famílias e pets com carinho.
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Link
            to="/"
            className="font-semibold text-[var(--brand-surface)] transition-colors hover:text-[var(--brand-green-500)]"
          >
            Início
          </Link>
          <Link
            to="/pets/novo"
            className="font-semibold text-[var(--brand-surface)] transition-colors hover:text-[var(--brand-green-500)]"
          >
            Divulgar Pet
          </Link>
        </div>
      </div>

      <p className="mt-4 border-t border-[rgba(248,244,234,0.2)] pt-4 text-xs text-[rgba(248,244,234,0.6)]">
        © {year} KaweVK. Todos os direitos reservados.
      </p>
    </footer>
  )
}
