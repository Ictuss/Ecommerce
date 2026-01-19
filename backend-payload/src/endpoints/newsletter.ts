import type { PayloadHandler } from 'payload'
import { saveToGoogleSheets } from '../utils/googleSheets'

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone: string): boolean => {
  if (!phone) return true
  const phoneRegex = /^[\d\s\-\(\)\+]+$/
  return phoneRegex.test(phone) && phone.length <= 20
}

export const newsletterSubscribe: PayloadHandler = async (req) => {
  try {
    const body = (await req.json?.()) || req.body
    const { name, email, phone } = body

    console.log('📧 [Newsletter] Nova inscrição recebida:', { name, email, phone })

    // Validações
    if (!name || !email) {
      return Response.json({ error: 'Nome e email são obrigatórios' }, { status: 400 })
    }

    const sanitizedName = sanitizeInput(name)
    const sanitizedEmail = sanitizeInput(email.toLowerCase())
    const sanitizedPhone = phone ? sanitizeInput(phone) : ''

    if (sanitizedName.length > 100) {
      return Response.json({ error: 'Nome muito longo' }, { status: 400 })
    }

    if (!validateEmail(sanitizedEmail)) {
      return Response.json({ error: 'Email inválido' }, { status: 400 })
    }

    if (!validatePhone(sanitizedPhone)) {
      return Response.json({ error: 'Telefone inválido' }, { status: 400 })
    }

    // Verifica se email já existe
    const existing = await req.payload.find({
      collection: 'newsletter-subscribers' as any,
      where: {
        email: {
          equals: sanitizedEmail,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log('⚠️ [Newsletter] Email já cadastrado:', sanitizedEmail)
      return Response.json({ error: 'Este email já está cadastrado' }, { status: 409 })
    }

    // 1️⃣ Salvar no Payload
    console.log('💾 [Newsletter] Salvando no Payload...')
    await req.payload.create({
      collection: 'newsletter-subscribers' as any,
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        active: true,
      },
    })
    console.log('✅ [Newsletter] Salvo no Payload com sucesso')

    // 2️⃣ Salvar no Google Sheets
    console.log('📊 [Newsletter] Sincronizando com Google Sheets...')
    try {
      await saveToGoogleSheets({
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
      })
      console.log('✅ [Newsletter] Google Sheets sincronizado')
    } catch (sheetsError: any) {
      console.error(
        '❌ [Newsletter] Falha no Google Sheets (dados salvos no Payload):',
        sheetsError.message,
      )
      // Não falha a request, pois já salvou no banco
    }

    return Response.json(
      {
        success: true,
        message: 'Inscrição realizada com sucesso!',
      },
      { status: 201 },
    )
  } catch (error: unknown) {
    console.error('❌ [Newsletter] Erro geral:', error)
    return Response.json(
      { error: 'Erro ao processar inscrição. Tente novamente.' },
      { status: 500 },
    )
  }
}
