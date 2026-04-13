import { Link } from 'react-router-dom'

export const NotFoundPage = () => {
  return (
    <section className="grid min-h-[65vh] w-full place-items-center">
      <div className="w-full max-w-xl rounded-3xl border border-[var(--brand-line)] bg-white p-8 text-center">
        <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--brand-text-muted)]">
          Pagina nao encontrada
        </p>
        <h1 className="mt-4 text-5xl text-[var(--brand-brown-900)]">404</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--brand-text-muted)]">
          O caminho acessado nao existe. Volte para a pagina principal ou abra
          a listagem de pets.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-[var(--brand-brown-900)] px-5 py-3 text-sm font-bold uppercase text-white tracking-wide text-[var(--brand-surface)] transition-colors hover:bg-[var(--brand-brown-700)]"
          >
            Ir para inicio
          </Link>
          <Link
            to="/pets"
            className="rounded-full border border-[var(--brand-line)] px-5 py-3 text-sm font-bold uppercase tracking-wide text-[var(--brand-brown-900)] transition-colors hover:bg-[var(--brand-surface)]"
          >
            Ver pets
          </Link>
        </div>
      </div>
    </section>
  )
}
