
// assets/js/api.js

export async function getTotalClientes() {
  const { count, error } = await client
    .from("clientes")
    .select("*", { count: "exact", head: true })

  if (error) throw error
  return count
}

export async function getServicosAtivos() {
  const { data, error } = await client
    .from("servicos")
    .select("*")
    .ilike("status", "ativo")

  if (error) throw error
  return data
}
