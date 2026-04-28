import { Link } from 'react-router-dom'
import type { Pet } from '../../types/pet'
import {
  formatAge,
  formatEspecie,
  formatStatus,
  getMainImage,
  truncate,
} from '../../utils/petFormatters'

interface PetCardProps {
  pet: Pet
}

const statusColorClassMap: Record<string, string> = {
  DISPONIVEL: 'bg-[rgba(120,135,34,0.18)] text-[var(--brand-green-900)]',
  PROCESSO_DE_ADOCAO: 'bg-[rgba(98,63,35,0.14)] text-[var(--brand-brown-900)]',
  ADOTADO: 'bg-[rgba(79,92,23,0.16)] text-[var(--brand-green-900)]',
}

const getStatusColorClass = (status: string) =>
  statusColorClassMap[status] ??
  'bg-[rgba(98,63,35,0.12)] text-[var(--brand-brown-900)]'

export const PetCard = ({ pet }: PetCardProps) => {
  return (
    <Link
      to={`/pets/${pet.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--brand-line)] bg-white shadow-[0_12px_40px_-24px_rgba(47,24,12,0.7)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(47,24,12,0.65)]"
    >
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={getMainImage(pet)}
          alt={pet.nome}
          className="h-full w-full object-cover transition duration-400 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[rgba(45,26,15,0.6)] to-transparent" />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[rgba(142,161,44,0.16)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--brand-green-900)]">
            {formatEspecie(pet.especie)}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusColorClass(
              pet.status,
            )}`}
          >
            {formatStatus(pet.status)}
          </span>
        </div>

        <div>
          <h3 className="text-2xl text-[var(--brand-brown-900)]">{pet.nome}</h3>
          <p className="mt-1 text-sm font-semibold text-[var(--brand-text-muted)]">
            {formatAge(pet.idadeAno, pet.idadeMes)}
          </p>
        </div>

        <p className="text-sm leading-relaxed text-[var(--brand-text-muted)]">
          {truncate(
            pet.descricao ||
              'Esse pet está esperando por uma família para dividir muito amor.',
          )}
        </p>

        <span className="mt-auto text-sm font-bold text-[var(--brand-green-900)]">
          Ver detalhes
        </span>
      </div>
    </Link>
  )
}
