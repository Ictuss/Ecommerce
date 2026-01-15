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
  console.log('📊 [Google Sheets] Iniciando processo de adição...')
  console.log('📊 [Google Sheets] Dados:', data)

  try {
    if (!GOOGLE_SERVICE_ACCOUNT || !GOOGLE_SHEETS_ID) {
      console.warn('⚠️ [Google Sheets] Configuração incompleta')
      console.log('  - GOOGLE_SERVICE_ACCOUNT:', !!GOOGLE_SERVICE_ACCOUNT)
      console.log('  - GOOGLE_SHEETS_ID:', GOOGLE_SHEETS_ID)
      return
    }

    console.log('🔐 [Google Sheets] Parseando credenciais...')
    let credentials
    try {
      credentials = JSON.parse(GOOGLE_SERVICE_ACCOUNT)
      console.log('✅ [Google Sheets] Credenciais parseadas com sucesso')
      console.log('  - Email da Service Account:', credentials.client_email)
    } catch (parseError) {
      console.error('❌ [Google Sheets] Erro ao parsear JSON das credenciais:', parseError)
      throw parseError
    }

    console.log('🔐 [Google Sheets] Criando autenticação...')
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    console.log('📝 [Google Sheets] Conectando à API...')
    const sheets = google.sheets({ version: 'v4', auth })

    console.log('➕ [Google Sheets] Adicionando dados...')
    console.log('  - Planilha ID:', GOOGLE_SHEETS_ID)
    console.log('  - Range: Newsletter!A:D')

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: 'Newsletter!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[data.name, data.email, data.phone, new Date().toISOString()]],
      },
    })

    console.log('✅ [Google Sheets] Sucesso!')
    console.log('  - Range atualizado:', result.data.updates?.updatedRange)
    console.log('  - Células atualizadas:', result.data.updates?.updatedCells)
  } catch (error: any) {
    console.error('❌ [Google Sheets] ERRO COMPLETO:', error)
    console.error('  - Mensagem:', error.message)
    console.error('  - Código:', error.code)
    if (error.response) {
      console.error('  - Status:', error.response.status)
      console.error('  - Data:', error.response.data)
    }
    if (error.errors) {
      console.error('  - Erros detalhados:', JSON.stringify(error.errors, null, 2))
    }
    // Re-throw para ver o erro
    throw error
  }
}

export const newsletterSubscribe: PayloadHandler = async (req) => {
  try {
    const body = (await req.json?.()) || req.body
    const { name, email, phone } = body

    console.log('📧 [Newsletter] Nova inscrição recebida:', { name, email, phone })

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

    // IMPORTANTE: Vamos esperar o Google Sheets terminar para ver o erro
    console.log('📊 [Newsletter] Iniciando sincronização com Google Sheets...')
    try {
      await addToGoogleSheets({
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
      })
      console.log('✅ [Newsletter] Google Sheets sincronizado')
    } catch (sheetsError: any) {
      console.error(
        '❌ [Newsletter] Falha ao sincronizar Google Sheets, mas cadastro no Payload OK',
      )
      console.error('Erro:', sheetsError.message)
    }

    return Response.json(
      {
        success: true,
        message: 'Inscrição realizada com sucesso!',
      },
      { status: 201 },
    )
  } catch (error: unknown) {
    console.error('❌ [Newsletter] Erro geral na inscrição:', error)

    return Response.json(
      { error: 'Erro ao processar inscrição. Tente novamente.' },
      { status: 500 },
    )
  }
}
