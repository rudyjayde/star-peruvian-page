const CULQI_API = 'https://api.culqi.com/v2'

const culqiRequest = async (path, body) => {
  const res = await fetch(`${CULQI_API}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CULQI_SECRET_KEY}`,
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) {
    const error = new Error(data?.user_message || data?.merchant_message || 'Error al comunicarse con Culqi')
    error.culqi = data
    throw error
  }
  return data
}

// amountInCents: Culqi charges in the smallest currency unit (céntimos de sol).
const createCharge = ({ amountInCents, email, sourceId, description }) =>
  culqiRequest('/charges', {
    amount: amountInCents,
    currency_code: 'PEN',
    email,
    source_id: sourceId,
    description,
    capture: true,
  })

const refundCharge = (chargeId, amountInCents) =>
  culqiRequest('/refunds', {
    amount: amountInCents,
    charge_id: chargeId,
    reason: 'solicitud_comprador',
  })

module.exports = { createCharge, refundCharge }
