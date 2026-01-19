// test-google-sheets.js
const { google } = require('googleapis')
require('dotenv').config()

async function testGoogleSheets() {
  console.log('🧪 Testando conexão com Google Sheets...\n')

  // 1. Verificar variáveis de ambiente
  console.log('📋 Verificando variáveis de ambiente:')
  console.log(
    '  ✓ GOOGLE_SHEETS_ID:',
    process.env.GOOGLE_SHEETS_ID ? '✅ Definido' : '❌ Não definido',
  )
  console.log(
    '  ✓ GOOGLE_CLIENT_EMAIL:',
    process.env.GOOGLE_CLIENT_EMAIL ? '✅ Definido' : '❌ Não definido',
  )
  console.log(
    '  ✓ GOOGLE_PRIVATE_KEY:',
    process.env.GOOGLE_PRIVATE_KEY ? '✅ Definido' : '❌ Não definido',
  )
  console.log('')

  if (
    !process.env.GOOGLE_SHEETS_ID ||
    !process.env.GOOGLE_CLIENT_EMAIL ||
    !process.env.GOOGLE_PRIVATE_KEY
  ) {
    console.error('❌ Variáveis de ambiente não configuradas corretamente!')
    return
  }

  try {
    console.log('🔐 Criando autenticação...')
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    console.log('📝 Conectando à API do Google Sheets...')
    const sheets = google.sheets({ version: 'v4', auth })

    // 2. Tentar ler a planilha primeiro (teste de permissão)
    console.log('📖 Tentando ler a planilha...')
    try {
      const readResult = await sheets.spreadsheets.get({
        spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      })
      console.log('✅ Planilha acessada com sucesso!')
      console.log('  📊 Nome:', readResult.data.properties?.title)
      console.log('  📄 Abas disponíveis:')
      readResult.data.sheets?.forEach((sheet) => {
        console.log(`     - ${sheet.properties?.title}`)
      })
      console.log('')
    } catch (readError) {
      console.error('❌ Erro ao ler planilha:', readError.message)
      if (readError.code === 403) {
        console.error('   💡 Solução: Compartilhe a planilha com:', process.env.GOOGLE_CLIENT_EMAIL)
      }
      return
    }

    // 3. Tentar escrever dados de teste
    console.log('✍️  Tentando adicionar dados de teste...')
    const testData = {
      name: 'Teste Automático',
      email: `teste-${Date.now()}@email.com`,
      phone: '47999999999',
      date: new Date().toISOString(),
    }

    const writeResult = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'Newsletter!A:D', // ⚠️ Ajuste o nome da aba se necessário
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[testData.name, testData.email, testData.phone, testData.date]],
      },
    })

    console.log('✅ Dados adicionados com sucesso!')
    console.log('  📍 Range atualizado:', writeResult.data.updates?.updatedRange)
    console.log('  🔢 Células atualizadas:', writeResult.data.updates?.updatedCells)
    console.log('\n🎉 Teste concluído com sucesso! A integração está funcionando.')
  } catch (error) {
    console.error('\n❌ ERRO DURANTE O TESTE:')
    console.error('  Mensagem:', error.message)

    if (error.code === 403) {
      console.error('\n💡 SOLUÇÃO:')
      console.error('  1. Abra o Google Sheets')
      console.error('  2. Clique em "Compartilhar"')
      console.error('  3. Adicione este email como EDITOR:', process.env.GOOGLE_CLIENT_EMAIL)
    } else if (error.code === 404) {
      console.error('\n💡 SOLUÇÃO:')
      console.error('  1. Verifique se o ID da planilha está correto')
      console.error('  2. ID atual:', process.env.GOOGLE_SHEETS_ID)
    } else if (error.message.includes('Unable to parse range')) {
      console.error('\n💡 SOLUÇÃO:')
      console.error('  1. Verifique o nome da aba na planilha')
      console.error('  2. Nome usado no código: "Newsletter"')
      console.error('  3. Se a aba tem outro nome, atualize no código')
    }

    if (error.response?.data) {
      console.error('\n  Detalhes:', JSON.stringify(error.response.data, null, 2))
    }
  }
}

testGoogleSheets()
