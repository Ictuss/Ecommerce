import axios from 'axios';

console.log('🧪 Testando conexões...');

// Teste 1: WordPress API
async function testWordPress() {
  try {
    console.log('\n1️⃣ Testando WordPress API...');
    
    const response = await axios.get('https://ictusvirtual.com.br/wp-json/wc/v3/products', {
      auth: {
    username: 'ck_e29371d5acb89f096cf94aa8cd744cb4ced2bd30', // Consumer Key do WooCommerce
    password: 'cs_f2877205c5b32c41948f1e488feebe0b6ab23b8b'// ⚠️ Substitua aqui
      },
      params: {
        per_page: 5,
        _fields: 'id,name'
      }
    });
    
    console.log('✅ WordPress API funcionando!');
    console.log(`📦 Encontrados ${response.data.length} produtos`);
    console.log('Produtos:', response.data.map(p => p.name));
    
  } catch (error) {
    console.error('❌ Erro no WordPress:', error.response?.status, error.response?.statusText);
    console.error('💡 Verifique suas credenciais do WooCommerce!');
  }
}

// Teste 2: Payload API
async function testPayload() {
  try {
    console.log('\n2️⃣ Testando Payload API...');
    
    const response = await axios.get('http://localhost:3000/api/products');
    
    console.log('✅ Payload API funcionando!');
    console.log(`📦 Produtos existentes no Payload: ${response.data.docs?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Erro no Payload:', error.code);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 O Payload não está rodando! Execute: npm run dev');
    }
  }
}

// Executar testes
async function runTests() {
  await testWordPress();
  await testPayload();
  console.log('\n🏁 Testes concluídos!');
}

runTests();