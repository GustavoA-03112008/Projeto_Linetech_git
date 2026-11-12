
const API_URL = "https://localhost:7193";

// FUNÇÃO PRINCIPAL PARA COMUNICAÇÃO COM A API
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.mensagem ||
      data?.message ||
      "Erro ao conectar com a API."
    );
  }

  return data;
}

// TESTE DE CONEXÃO COM A API
export async function testarConexao() {
  try {
    const resposta = await fetch(`${API_URL}/swagger/index.html`);

    if (resposta.ok) {
      console.log("Conexão com a API realizada com sucesso!");
    } else {
      console.log("A API respondeu, mas houve um problema.");
    }
  } catch (erro) {
    console.error(
      "Não foi possível conectar com a API:",
      erro
    );
  }
}
