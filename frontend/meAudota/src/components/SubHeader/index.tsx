import { Link } from "react-router-dom"
import type { Pet } from "../../types/pet"

interface SubHeaderProps {
  title: string
  description: string
  search: string
  setSearch: (search: string) => void
  filteredPets: Pet[]
  petsNaoAdotados: Pet[]
  searchPlaceholder: string
}


const SubHeader = ({title, description, search, setSearch, filteredPets, petsNaoAdotados, searchPlaceholder}: SubHeaderProps) => {
    return (
        <header className="rounded-[2rem] border border-[var(--brand-line)] bg-white p-6 shadow-[0_24px_60px_-42px_rgba(34,24,18,0.55)] md:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-text-muted)]">Catálogo</p>
                    <h1 className="mt-2 text-4xl text-[var(--brand-title)]">{title}</h1>
                    <p className="mt-4 text-sm leading-7 text-[var(--brand-text-soft)]">{description}</p>
                  </div>
                  <Link
                    to="/pets/novo"
                    className="rounded-full bg-[var(--brand-highlight)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-highlight-strong)]"
                  >
                    Divulgar pet
                  </Link>
                </div>
        
                <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-text-muted)]">Buscar</span>
                    <input
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={searchPlaceholder}
                      className="rounded-[1rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 py-3 text-sm font-medium text-[var(--brand-title)] outline-none transition-shadow focus:ring-2 focus:ring-[rgba(86,110,42,0.18)]"
                    />
                  </label>
                  <p className="text-sm font-semibold text-[var(--brand-text-soft)]">
                    {filteredPets.length} de {petsNaoAdotados.length} pets exibidos
                  </p>
                </div>
              </header>
    );
};


export default SubHeader;
