const errorMessagesPT: Record<string, string> = {
  'validation.required': 'Campo obrigatório',
  // Adicione outros códigos de erro e traduções conforme necessário
}

const fieldNamesPT: Record<string, string> = {
  name: 'Nome',
  email: 'E-mail',
  amount: 'Valor',
  date: 'Data',
  seller_id: 'Vendedor',

  // Adicione outros campos se necessário
}

export function translateApiErrors(errors: Record<string, string[]>): Record<string, string[]> {
  const traduzidos: Record<string, string[]> = {}
  for (const campo in errors) {
    const campoTraduzido = fieldNamesPT[campo] || campo
    traduzidos[campoTraduzido] = errors[campo].map((codigo) => errorMessagesPT[codigo] || codigo)
  }
  return traduzidos
}
