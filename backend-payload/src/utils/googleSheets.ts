import { google } from 'googleapis'

interface NewsletterData {
  name: string
  email: string
  phone?: string
}

export async function saveToGoogleSheets(data: NewsletterData) {
  console.log('==========================================')
  console.log('📊 [Google Sheets] INÍCIO DO PROCESSO')
  console.log('==========================================')
  console.log('📊 [Google Sheets] Dados recebidos:', JSON.stringify(data, null, 2))

  // Log das variáveis de ambiente (SEM mostrar valores completos por segurança)
  console.log('📊 [Google Sheets] Checando variáveis de ambiente...')
  console.log('  - GOOGLE_SHEETS_ID existe?', !!process.env.GOOGLE_SHEETS_ID)
  console.log('  - GOOGLE_SHEETS_ID valor:', process.env.GOOGLE_SHEETS_ID?.substring(0, 10) + '...')
  console.log('  - GOOGLE_CLIENT_EMAIL existe?', !!process.env.GOOGLE_CLIENT_EMAIL)
  console.log('  - GOOGLE_CLIENT_EMAIL valor:', process.env.GOOGLE_CLIENT_EMAIL)
  console.log('  - GOOGLE_PRIVATE_KEY existe?', !!process.env.GOOGLE_PRIVATE_KEY)
  console.log('  - GOOGLE_PRIVATE_KEY length:', process.env.GOOGLE_PRIVATE_KEY?.length)
  console.log(
    '  - GOOGLE_PRIVATE_KEY começa com BEGIN?',
    process.env.GOOGLE_PRIVATE_KEY?.startsWith('"-----BEGIN'),
  )

  try {
    // Verifica se as variáveis estão configuradas
    if (
      !process.env.GOOGLE_CLIENT_EMAIL ||
      !process.env.GOOGLE_PRIVATE_KEY ||
      !process.env.GOOGLE_SHEETS_ID
    ) {
      console.error('❌ [Google Sheets] ERRO: Variáveis de ambiente FALTANDO')
      console.error('  - GOOGLE_CLIENT_EMAIL:', !!process.env.GOOGLE_CLIENT_EMAIL)
      console.error('  - GOOGLE_PRIVATE_KEY:', !!process.env.GOOGLE_PRIVATE_KEY)
      console.error('  - GOOGLE_SHEETS_ID:', !!process.env.GOOGLE_SHEETS_ID)
      return { success: false, error: 'Configuração incompleta' }
    }

    console.log('✅ [Google Sheets] Todas as variáveis existem')
    console.log('🔐 [Google Sheets] Preparando private key...')

    // Limpa a private key
    let privateKey = process.env.GOOGLE_PRIVATE_KEY

    // Remove aspas se tiverem
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      console.log('🔐 [Google Sheets] Removendo aspas da private key...')
      privateKey = privateKey.slice(1, -1)
    }

    // Substitui \n por quebras de linha reais
    privateKey = privateKey.replace(/\\n/g, '\n')

    console.log('🔐 [Google Sheets] Private key processada')
    console.log('  - Começa com -----BEGIN?', privateKey.startsWith('-----BEGIN'))
    console.log(
      '  - Termina com -----END?',
      privateKey.trim().endsWith('-----END PRIVATE KEY-----'),
    )
    console.log('  - Tem quebras de linha?', privateKey.includes('\n'))

    console.log('🔐 [Google Sheets] Criando autenticação...')
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    console.log('✅ [Google Sheets] Auth criado com sucesso')
    console.log('📝 [Google Sheets] Criando cliente sheets...')
    const sheets = google.sheets({ version: 'v4', auth })

    console.log('✅ [Google Sheets] Cliente sheets criado')
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID

    // Formata a data no padrão brasileiro
    const now = new Date()
    const brazilTime = new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'America/Sao_Paulo',
    }).format(now)

    console.log('➕ [Google Sheets] Preparando para adicionar dados...')
    console.log('  - Planilha ID:', spreadsheetId)
    console.log('  - Range: Newsletter!A:D')
    console.log('  - Valores:', [data.name, data.email, data.phone || '', brazilTime])

    console.log('📤 [Google Sheets] Enviando request para Google API...')
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Newsletter!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[data.name, data.email, data.phone || '', brazilTime]],
      },
    })

    console.log('✅ [Google Sheets] SUCESSO! Dados salvos!')
    console.log('  - Range atualizado:', result.data.updates?.updatedRange)
    console.log('  - Células atualizadas:', result.data.updates?.updatedCells)
    console.log('==========================================')
    console.log('📊 [Google Sheets] FIM DO PROCESSO (SUCESSO)')
    console.log('==========================================')

    return { success: true }
  } catch (error: any) {
    console.error('==========================================')
    console.error('❌ [Google Sheets] ERRO CAPTURADO!')
    console.error('==========================================')
    console.error('❌ [Google Sheets] Tipo do erro:', error.constructor.name)
    console.error('❌ [Google Sheets] Mensagem:', error.message)
    console.error('❌ [Google Sheets] Code:', error.code)
    console.error('❌ [Google Sheets] Stack:', error.stack)

    if (error.response) {
      console.error('❌ [Google Sheets] Response status:', error.response.status)
      console.error('❌ [Google Sheets] Response statusText:', error.response.statusText)
      console.error(
        '❌ [Google Sheets] Response data:',
        JSON.stringify(error.response.data, null, 2),
      )
      console.error(
        '❌ [Google Sheets] Response headers:',
        JSON.stringify(error.response.headers, null, 2),
      )
    }

    if (error.errors) {
      console.error('❌ [Google Sheets] Errors array:', JSON.stringify(error.errors, null, 2))
    }

    console.error('==========================================')
    throw error
  }
}
