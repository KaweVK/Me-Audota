export const MiniBox = ({ title, text }: {
    title: string
    text: string
}) => {
    return (
        <div className="rounded-[1.5rem] border border-[var(--brand-line)] bg-white/70 p-4">
            <p className="text-sm font-semibold text-[var(--brand-title)]">
                {title}
            </p>
            <p className="mt-2 text-sm text-[var(--brand-text-soft)]">
                {text}
            </p>
        </div>
    )
}