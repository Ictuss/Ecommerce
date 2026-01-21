import type { PayloadHandler } from 'payload'
import { saveToGoogleSheets } from '../utils/googleSheets'

export const testSheets: PayloadHandler = async (req) => {
  try {
    console.log('🧪 [TEST] Iniciando teste do Google Sheets...')

    const result = await saveToGoogleSheets({
      name: 'TESTE MANUAL',
      email: 'teste@exemplo.com',
      phone: '(99) 99999-9999',
    })

    console.log('✅ [TEST] Resultado:', result)

    return Response.json({
      success: true,
      message: 'Teste concluído! Verifique os logs e a planilha.',
      result,
    })
  } catch (error: any) {
    console.error('❌ [TEST] Erro:', error)
    return Response.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
