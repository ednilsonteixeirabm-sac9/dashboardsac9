export const META_MENSAL_PADRAO = 300_000

const metaMensalEnv = Number(import.meta.env.VITE_DASHBOARD_META_MENSAL)

export const META_MENSAL_DASHBOARD = Number.isFinite(metaMensalEnv)
  ? metaMensalEnv
  : META_MENSAL_PADRAO
