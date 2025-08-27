import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import { fileURLToPath } from 'url';

// Para ES modules, precisamos obter __filename e __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========== CONFIGURAÇÕES ==========
const CONFIG = {
  // WordPress API
  wordpress: {
    apiUrl: 'https://ictusvirtual.com.br/wp-json/wc/v3/products',
    username: 'ck_e29371d5acb89f096cf94aa8cd744cb4ced2bd30', // Consumer Key do WooCommerce
    password: 'cs_f2877205c5b32c41948f1e488feebe0b6ab23b8b' // Consumer Secret do WooCommerce
  },
  
  // Payload API  
  payload: {
    apiUrl: 'http://localhost:3000/api', // Ajuste conforme sua configuração
    // Se você tiver autenticação, adicione aqui:
    // auth: 'Bearer SEU_TOKEN'
  },
  
  // Configurações da migração
  migration: {
    batchSize: 2, // Usar os 2 produtos que temos confirmados
    imageDownloadPath: './temp_images', // Pasta temporária para imagens
    delay: 1500 // Delay entre requests (ms)
  }
};

// ========== FUNÇÕES AUXILIARES ==========

// Função para criar pasta se não existir
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Função para verificar se a URL da imagem é válida
async function checkImageUrl(url) {
  try {
    const response = await axios.head(url, {
      timeout: 5000,
      validateStatus: (status) => status === 200
    });
    return response.status === 200;
  } catch (error) {
    console.log(`⚠️ Imagem não acessível: ${url}`);
    return false;
  }
}

// Função para baixar imagem
async function downloadImage(url, filename) {
  try {
    console.log(`📥 Baixando imagem: ${filename}`);
    
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });
    
    const filepath = path.join(CONFIG.migration.imageDownloadPath, filename);
    const writer = fs.createWriteStream(filepath);
    
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(filepath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`❌ Erro ao baixar imagem ${filename}:`, error.message);
    return null;
  }
}

// Função para fazer upload da imagem no Payload
async function uploadImageToPayload(imagePath, alt) {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(imagePath));
    formData.append('alt', alt || 'Imagem do produto');
    
    const response = await axios.post(`${CONFIG.payload.apiUrl}/media`, formData, {
      headers: {
        ...formData.getHeaders(),
        // Authorization: CONFIG.payload.auth // Descomente se tiver auth
      }
    });
    
    console.log(`✅ Imagem enviada para Payload: ${response.data.id}`);
    return response.data.id;
  } catch (error) {
    console.error(`❌ Erro ao enviar imagem para Payload:`, error.message);
    return null;
  }
}

// Função para limpar HTML das descrições
function cleanHtmlContent(html) {
  if (!html) return '';
  
  return html
    .replace(/<[^>]*>/g, '') // Remove tags HTML
    .replace(/&nbsp;/g, ' ') // Substitui &nbsp; por espaço
    .replace(/&amp;/g, '&') // Substitui &amp; por &
    .replace(/&lt;/g, '<') // Substitui &lt; por <
    .replace(/&gt;/g, '>') // Substitui &gt; por >
    .trim();
}

// ========== FUNÇÕES PRINCIPAIS ==========

// 1. Usar produtos pré-definidos com imagens válidas
async function fetchFilteredWPProducts() {
  try {
    console.log('🔍 Usando produtos pré-selecionados com imagens válidas...');
    
    // Produtos específicos que sabemos que têm imagens funcionais
    const validProducts = [
      {
        "id": 3721,
        "name": "Travesseiro de Viagem Trip Top Fibrasca",
        "slug": "travesseiro-de-viagem-trip-top-fibrasca",
        "price": "",
        "regular_price": "",
        "sale_price": "",
        "description": "<p>Este produto traz o benefício da higiene e saúde, pois pode ser utilizado como um pillow top para travesseiro, podendo ser utilizado sobre o travesseiro do hotel, assim você poderá dormir em seu Trip top ao invés de dormir com a cabeça diretamente sobre o travesseiro do hotel onde várias pessoas já dormiram ali. Outro fator importante para o benefício da saúde é o tratamento anti bactericida, fungicida e anti ácaro dos íons de prata! Esta é uma nanotecnologia aplicada no revestimento do produto que elimina toda e qualquer presença de ácaros, fungos e bactérias a todo instante! Ou seja, nesse caso nada é melhor do que dormir em algo que é seu, não é? O produto ainda acompanha com uma alça em malha para poder melhor se acoplar ao travesseiro, ficando firme e sem escorregar! Além disso, ele é pequeno, dobrável, sendo muito fácil e prático de levar! E ainda mais! Seu revestimento é produzido em uma das mais nobres malharias da Fibrasca, que produz a malha dupla com detalhes e jacquard, feita com tecnologia italiana, produzida inteiramente no Brasil! Ah, e se sujar, não há problema, seu enchimento feito em espuma hipersoft aerada com aplicação de silicone promove a fácil passagem da água e do ar sendo integralmente lavável em máquina, podendo secar também até 40ºC, ou seja, higiene total para seu Trip Top e para você. Surpreenda-se e descubra o conforto, a qualidade, saúde e bem estar do travesseiro de viagem Trip top by Fibrasca!</p>",
        "short_description": "<p>O travesseiro de viagem Trip top é um excelente acompanhante para o seu passeio! Este produto pode ser utilizado como travesseiro para recostar a cabeça na poltrona do avião, no carro e até mesmo no onibus durante suas viagens.</p>",
        "images": [
          {
            "id": 3725,
            "src": "https://ictusvirtual.com.br/wp-content/uploads/2023/05/71XLKhOyEgL._AC_SL1500_.jpg",
            "name": "71XLKhOyEgL._AC_SL1500_",
            "alt": ""
          },
          {
            "id": 3728,
            "src": "https://ictusvirtual.com.br/wp-content/uploads/2023/05/71L6Eb1y3wL._AC_SL1500_.jpg",
            "name": "71L6Eb1y3wL._AC_SL1500_",
            "alt": ""
          },
          {
            "id": 3727,
            "src": "https://ictusvirtual.com.br/wp-content/uploads/2023/05/71x4Rir0YTL._AC_SL1500_.jpg",
            "name": "71x4Rir0YTL._AC_SL1500_",
            "alt": ""
          }
        ],
        "categories": [
          {
            "id": 18,
            "name": "OUTROS",
            "slug": "outros"
          }
        ],
        "stock_status": "instock"
      },
      {
        "id": 3709,
        "name": "Travesseiro de Corpo Minhocão Fibrasca",
        "slug": "travesseiro-de-corpo-minhocao-fibrasca",
        "price": "",
        "regular_price": "",
        "sale_price": "",
        "description": "<h5><strong>Veja como o travesseiro pode transformar suas noites de sono</strong></h5><p>Durante a gestação: Esse modelo proporciona sustentação ideal para encaixe da barriguinha da gestante, envolvendo ela e trazendo muito conforto.</p><h5>Alinhamento da postura</h5><p>Com o uso do Travesseiro Minhocão, a gestante terá muito mais conforto, pois não deixará a barriga pendente forçando a coluna e a lombar.</p><p>Alinhando corretamente a posição do corpo e do ventre.</p><h5>Produto ideal para antes e depois da gestação</h5><p>Esse travesseiro pode ser usado, como travesseiro de amamentação após a gestação.</p><p>Proporcionando suporte ideal, conforto para mamãe e para o bebê na hora da amamentação.</p><ul><li>Ajuda no alinhamento da coluna</li><li>Multiuso</li><li>Travesseiro de corpo</li><li>Travesseiro para gestante</li><li>Travesseiro de amamentação</li></ul>",
        "short_description": "<h3>Um travesseiro completo para seu sono, saúde e bem estar</h3><p>O travesseiro de corpo Minhocão, da Fibrasca foi desenvolvido para proporcionar uma noite de sono, ainda mais aconchegante e confortável para você.</p><p>Este modelo feito em exclusivo formato anatômico, trás um sono envolvente que auxilia desde a mamãe gestante e até quem busca dormir com posicionamento correto alinhando a postura durante o sono.</p>",
        "images": [
          {
            "id": 3720,
            "src": "https://ictusvirtual.com.br/wp-content/uploads/2023/05/81Q64HSs5pL._AC_SL1500_.jpg",
            "name": "81Q64HSs5pL._AC_SL1500_",
            "alt": ""
          },
          {
            "id": 3719,
            "src": "https://ictusvirtual.com.br/wp-content/uploads/2023/05/71AKOUo5EyL._AC_SL1500_.jpg",
            "name": "71AKOUo5EyL._AC_SL1500_",
            "alt": ""
          },
          {
            "id": 3718,
            "src": "https://ictusvirtual.com.br/wp-content/uploads/2023/05/81ZkDC6XQcL._AC_SL1500_.jpg",
            "name": "81ZkDC6XQcL._AC_SL1500_",
            "alt": ""
          }
        ],
        "categories": [
          {
            "id": 18,
            "name": "OUTROS",
            "slug": "outros"
          }
        ],
        "stock_status": "instock"
      }
    ];

    console.log(`📦 ${validProducts.length} produtos pré-selecionados encontrados`);
    
    console.log('\n📋 Produtos para migração:');
    validProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.images?.length || 0} imagens)`);
      console.log(`   Imagens: ${product.images.map(img => img.name).join(', ')}`);
    });
    
    return validProducts;
    
  } catch (error) {
    console.error('❌ Erro ao obter produtos:', error.message);
    return [];
  }
}

// 2. Processar imagens do produto
async function processProductImages(wpImages, productName) {
  const processedImages = [];
  
  for (let i = 0; i < wpImages.length; i++) {
    const wpImage = wpImages[i];
    
    try {
      // Verificar se é uma URL válida do WordPress
      if (!wpImage.src || !wpImage.src.includes('ictusvirtual.com.br/wp-content/uploads/')) {
        console.log(`⚠️ URL de imagem inválida: ${wpImage.src}`);
        continue;
      }
      
      console.log(`📥 Processando imagem: ${wpImage.name || 'sem nome'}`);
      
      // Gerar nome único para a imagem
      const imageExtension = path.extname(wpImage.src) || '.jpg';
      const sanitizedName = productName.replace(/[^a-z0-9]/gi, '_');
      const imageName = `${sanitizedName}_${wpImage.id}${imageExtension}`;
      
      // Baixar imagem
      const localImagePath = await downloadImage(wpImage.src, imageName);
      
      if (localImagePath) {
        // Fazer upload para Payload
        const payloadImageId = await uploadImageToPayload(
          localImagePath, 
          wpImage.alt || productName
        );
        
        if (payloadImageId) {
          processedImages.push({
            image: payloadImageId,
            alt: wpImage.alt || productName
          });
          console.log(`✅ Imagem processada com sucesso: ${imageName}`);
        }
        
        // Limpar arquivo temporário
        fs.unlinkSync(localImagePath);
      }
      
      // Delay entre uploads de imagem
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ Erro ao processar imagem ${wpImage.src}:`, error.message);
    }
  }
  
  return processedImages;
}

// 3. Converter produto WordPress para formato Payload
async function convertToPayloadFormat(wpProduct) {
  console.log(`🔄 Convertendo produto: ${wpProduct.name}`);
  
  // Processar imagens
  const images = await processProductImages(wpProduct.images, wpProduct.name);
  
  if (images.length === 0) {
    console.warn(`⚠️ Produto ${wpProduct.name} não tem imagens válidas, pulando...`);
    return null;
  }
  
  // Extrair categoria principal
  const category = wpProduct.categories && wpProduct.categories.length > 0 
    ? wpProduct.categories[0].name 
    : 'Outros';
  
  // Determinar preço
  const price = parseFloat(wpProduct.price) || parseFloat(wpProduct.regular_price) || 0;
  const salePrice = parseFloat(wpProduct.sale_price) || null;
  
  return {
    name: wpProduct.name,
    slug: wpProduct.slug,
    description: cleanHtmlContent(wpProduct.description || wpProduct.short_description),
    shortDescription: cleanHtmlContent(wpProduct.short_description || wpProduct.description).substring(0, 300),
    price: price,
    salePrice: salePrice,
    category: category,
    tags: [], // Pode adicionar lógica para extrair tags se necessário
    images: images,
    inStock: wpProduct.stock_status === 'instock',
    stock: 10, // Valor padrão, você pode ajustar
    featured: false,
    wpId: wpProduct.id,
    publishedAt: new Date()
  };
}

// 4. Criar produto no Payload
async function createProductInPayload(productData) {
  try {
    console.log(`📤 Enviando produto para Payload: ${productData.name}`);
    
    const response = await axios.post(`${CONFIG.payload.apiUrl}/products`, productData, {
      headers: {
        'Content-Type': 'application/json',
        // Authorization: CONFIG.payload.auth // Descomente se tiver auth
      }
    });
    
    console.log(`✅ Produto criado no Payload com ID: ${response.data.doc.id}`);
    return response.data.doc;
    
  } catch (error) {
    console.error(`❌ Erro ao criar produto ${productData.name}:`, error.response?.data || error.message);
    return null;
  }
}

// ========== FUNÇÃO PRINCIPAL ==========
async function main() {
  try {
    console.log('🚀 Iniciando migração WordPress → Payload');
    console.log('='.repeat(50));
    
    // Criar pasta para imagens temporárias
    ensureDirectoryExists(CONFIG.migration.imageDownloadPath);
    
    // 1. Buscar produtos filtrados do WordPress
    const wpProducts = await fetchFilteredWPProducts();
    
    if (wpProducts.length === 0) {
      console.log('❌ Nenhum produto válido encontrado para migração');
      return;
    }
    
    console.log(`\n📋 Produtos selecionados para migração:`);
    wpProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.images?.length || 0} imagens)`);
    });
    
    console.log('\n🔄 Iniciando conversão e migração...');
    console.log('='.repeat(50));
    
    const results = {
      success: [],
      errors: []
    };
    
    // 2. Processar cada produto
    for (let i = 0; i < wpProducts.length; i++) {
      const wpProduct = wpProducts[i];
      
      try {
        console.log(`\n[${i + 1}/${wpProducts.length}] Processando: ${wpProduct.name}`);
        console.log('-'.repeat(40));
        
        // Converter para formato Payload
        const payloadProduct = await convertToPayloadFormat(wpProduct);
        
        if (!payloadProduct) {
          results.errors.push({
            wpId: wpProduct.id,
            name: wpProduct.name,
            error: 'Falha na conversão (provavelmente sem imagens válidas)'
          });
          continue;
        }
        
        // Criar no Payload
        const createdProduct = await createProductInPayload(payloadProduct);
        
        if (createdProduct) {
          results.success.push({
            wpId: wpProduct.id,
            payloadId: createdProduct.id,
            name: wpProduct.name
          });
        } else {
          results.errors.push({
            wpId: wpProduct.id,
            name: wpProduct.name,
            error: 'Falha ao criar no Payload'
          });
        }
        
        // Delay entre produtos
        await new Promise(resolve => setTimeout(resolve, CONFIG.migration.delay));
        
      } catch (error) {
        console.error(`❌ Erro geral ao processar ${wpProduct.name}:`, error.message);
        results.errors.push({
          wpId: wpProduct.id,
          name: wpProduct.name,
          error: error.message
        });
      }
    }
    
    // 3. Relatório final
    console.log('\n' + '='.repeat(50));
    console.log('📊 RELATÓRIO FINAL DA MIGRAÇÃO');
    console.log('='.repeat(50));
    
    console.log(`\n✅ Produtos migrados com sucesso: ${results.success.length}`);
    results.success.forEach(item => {
      console.log(`   • ${item.name} (WP: ${item.wpId} → Payload: ${item.payloadId})`);
    });
    
    console.log(`\n❌ Produtos com erro: ${results.errors.length}`);
    results.errors.forEach(item => {
      console.log(`   • ${item.name} (WP: ${item.wpId}): ${item.error}`);
    });
    
    // Salvar relatório
    const reportPath = `migration_report_${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\n📄 Relatório salvo em: ${reportPath}`);
    
    // Limpar pasta temporária
    if (fs.existsSync(CONFIG.migration.imageDownloadPath)) {
      fs.rmSync(CONFIG.migration.imageDownloadPath, { recursive: true });
      console.log('🧹 Pasta temporária de imagens removida');
    }
    
    console.log('\n🎉 Migração concluída!');
    
  } catch (error) {
    console.error('💥 Erro crítico na migração:', error);
  }
}

// ========== EXECUTAR MIGRAÇÃO ==========
// Executar sempre quando o arquivo for chamado
console.log('🎯 Iniciando execução do script de migração...');
main().catch(console.error);

// ========== EXPORTAR FUNÇÕES ==========
export {
  main,
  fetchFilteredWPProducts,
  convertToPayloadFormat,
  createProductInPayload
};