// src/endpoints/newsletter.ts
import type { PayloadHandler } from 'payload'
import { google } from 'googleapis'

const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID
const GOOGLE_SERVICE_ACCOUNT = process.env.GOOGLE_SERVICE_ACCOUNT

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

const addToGoogleSheets = async (data: { name: string; email: string; phone: string }) => {
  try {
    if (!GOOGLE_SERVICE_ACCOUNT || !GOOGLE_SHEETS_ID) {
      console.warn('Google Sheets não configurado')
      return
    }

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(GOOGLE_SERVICE_ACCOUNT),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: 'Newsletter!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[data.name, data.email, data.phone, new Date().toISOString()]],
      },
    })
  } catch (error) {
    console.error('Erro ao adicionar no Google Sheets:', error)
  }
}

export const newsletterSubscribe: PayloadHandler = async (req) => {
  try {
    const body = (await req.json?.()) || req.body
    const { name, email, phone } = body

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

    // Buscar registros existentes - usando type assertion para resolver o erro de tipos
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
      return Response.json({ error: 'Este email já está cadastrado' }, { status: 409 })
    }

    // Criar novo registro
    await req.payload.create({
      collection: 'newsletter-subscribers' as any,
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        active: true,
      },
    })

    addToGoogleSheets({
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
    }).catch(console.error)

    return Response.json(
      {
        success: true,
        message: 'Inscrição realizada com sucesso!',
      },
      { status: 201 },
    )
  } catch (error: unknown) {
    console.error('Erro na inscrição:', error)

    return Response.json(
      { error: 'Erro ao processar inscrição. Tente novamente.' },
      { status: 500 },
    )
  }
}
