// Vérifie le mot de passe admin fourni contre la variable d'environnement.
// Protection simple (cf. cahier des charges §6.3) — pas d'authentification
// complexe. À renforcer si le périmètre évolue.
export function checkAdminPassword(password: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  if (typeof password !== 'string') return false
  // Comparaison à temps ~constant sur la longueur commune.
  if (password.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= password.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return diff === 0
}
