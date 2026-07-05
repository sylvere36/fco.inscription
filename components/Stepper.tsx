const ETAPES = ['Mon profil', 'Mes informations', 'Mon engagement']

export function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3">
      {ETAPES.map((titre, i) => {
        const etat =
          i < current ? 'done' : i === current ? 'active' : 'todo'
        return (
          <li key={titre} className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <span
                className={[
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition',
                  etat === 'done' && 'bg-succes text-white',
                  etat === 'active' && 'bg-madeb text-white',
                  etat === 'todo' && 'bg-nuit/10 text-nuit/50',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {etat === 'done' ? '✓' : i + 1}
              </span>
              <span
                className={[
                  'hidden text-sm font-medium sm:block',
                  etat === 'todo' ? 'text-nuit/50' : 'text-nuit',
                ].join(' ')}
              >
                {titre}
              </span>
            </div>
            <div
              className={[
                'h-1 rounded-full transition',
                i <= current ? 'bg-madeb' : 'bg-nuit/10',
              ].join(' ')}
            />
          </li>
        )
      })}
    </ol>
  )
}
