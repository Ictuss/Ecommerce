import { google } from 'googleapis'

interface NewsletterData {
  name: string
  email: string
  phone?: string
}

export async function saveToGoogleSheets(data: NewsletterData) {
  console.log('📊 [Google Sheets] Iniciando processo de adição...')

  try {
    // Verifica se as variáveis estão configuradas
    if (
      !process.env.GOOGLE_CLIENT_EMAIL ||
      !process.env.GOOGLE_PRIVATE_KEY ||
      !process.env.GOOGLE_SHEETS_ID
    ) {
      console.warn('⚠️ [Google Sheets] Variáveis de ambiente não configuradas')
      console.log('  - GOOGLE_CLIENT_EMAIL:', !!process.env.GOOGLE_CLIENT_EMAIL)
      console.log('  - GOOGLE_PRIVATE_KEY:', !!process.env.GOOGLE_PRIVATE_KEY)
      console.log('  - GOOGLE_SHEETS_ID:', !!process.env.GOOGLE_SHEETS_ID)
      return { success: false, error: 'Configuração incompleta' }
    }

    console.log('🔐 [Google Sheets] Criando autenticação...')
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID

    // Formata a data no padrão brasileiro
    const now = new Date()
    const brazilTime = new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'America/Sao_Paulo',
    }).format(now)

    console.log('➕ [Google Sheets] Adicionando dados...')
    console.log('  - Planilha ID:', spreadsheetId)
    console.log('  - Range: Newsletter!A:D')

    // Adiciona os dados na planilha
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Newsletter!A:D', // ⚠️ CERTIFIQUE-SE QUE SUA ABA SE CHAMA "Newsletter"
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[data.name, data.email, data.phone || '', brazilTime]],
      },
    })

    console.log('✅ [Google Sheets] Dados salvos com sucesso!')
    console.log('  - Range atualizado:', result.data.updates?.updatedRange)
    console.log('  - Células atualizadas:', result.data.updates?.updatedCells)

    return { success: true }
  } catch (error: any) {
    console.error('❌ [Google Sheets] ERRO:', error.message)
    if (error.response) {
      console.error('  - Status:', error.response.status)
      console.error('  - Data:', JSON.stringify(error.response.data, null, 2))
    }
    throw error
  }
}
