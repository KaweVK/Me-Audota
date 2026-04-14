import type { PropsWithChildren, ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface AuthCardProps extends PropsWithChildren {
  alternateAction: ReactNode
  intro: string
  title: string
}

export const AuthCard = ({
  alternateAction,
  children,
  intro,
  title,
}: AuthCardProps) => {
  return (
    <section className="grid min-h-screen px-6 py-10 md:px-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6 self-center lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[2rem] border border-[var(--brand-line)] bg-[linear-gradient(145deg,rgba(194,167,124,0.14),rgba(112,132,64,0.14))] p-8 shadow-[0_30px_90px_-55px_rgba(34,24,18,0.7)] md:p-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <img
              src="/me-audota.png"
              alt="Logo MeAudota"
              className="h-14 w-14 rounded-full border border-[var(--brand-line)] bg-white p-1.5"
            />
            <div>
              <p className="text-2xl font-semibold text-[var(--brand-title)]">
                MeAudota
              </p>
            </div>
          </Link>

          <div className="mt-10 max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-highlight)]">
              Veja e adote
            </p>
            <h1 className="mt-4 text-4xl leading-tight text-[var(--brand-title)] md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-[var(--brand-text-soft)]">
              {intro}
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-[var(--brand-line)] bg-white/70 p-4">
              <p className="text-sm font-semibold text-[var(--brand-title)]">
                Anuncie
              </p>
              <p className="mt-2 text-sm text-[var(--brand-text-soft)]">
                Viu algum pet precisando de um lar? Anuncie aqui.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--brand-line)] bg-white/70 p-4">
              <p className="text-sm font-semibold text-[var(--brand-title)]">
                Adote
              </p>
              <p className="mt-2 text-sm text-[var(--brand-text-soft)]">
                Encontre um novo amigo e dê um lar para ele.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--brand-line)] bg-white/70 p-4">
              <p className="text-sm font-semibold text-[var(--brand-title)]">
                Seja um parceiro
              </p>
              <p className="mt-2 text-sm text-[var(--brand-text-soft)]">
                Ajude a divulgar e aumentar o alcance das adoções.
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-[2rem] border border-[var(--brand-line)] bg-white p-8 shadow-[0_30px_80px_-45px_rgba(34,24,18,0.55)] md:p-10">
          {children}
          <div className="mt-8 border-t border-[var(--brand-line)] pt-6 text-sm text-[var(--brand-text-soft)]">
            {alternateAction}
          </div>
        </article>
      </div>
    </section>
  )
}
