# E-commerce ICTUS Produtos para Saúde

Este repositório contém o código-fonte do e-commerce desenvolvido para a ICTUS Produtos para Saúde LTDA. O objetivo principal deste projeto é fornecer uma plataforma online para a venda de produtos da empresa, com a finalização das compras sendo realizada via WhatsApp.

## Objetivos do Projeto

Conforme estabelecido no contrato, os principais objetivos deste projeto são:

- **Página Inicial**: Apresentação dos produtos em destaque.
- **Páginas de Produtos**: Detalhamento individual de cada produto disponível.
- **Carrinho de Compras**: Exibição dos produtos selecionados pelo cliente.
- **Integração com WhatsApp**: Redirecionamento do pedido para o WhatsApp para conclusão da compra.
- **Design Responsivo**: Otimização para dispositivos móveis e diferentes resoluções de tela.
- **Desenvolvimento Iterativo**: Ajustes progressivos realizados em conjunto com a equipe de design.
- **Estrutura para Futuras Implementações**: Preparação do sistema para a adição futura de funcionalidades, como gerenciamento de produtos e conteúdos.

## Tecnologias Utilizadas

- **Frontend**: React com TypeScript, utilizando o Vite como bundler.
- **Backend**: Node.js com Express, hospedado separadamente devido a limitações do cPanel em suportar aplicações Node.js.
- **Hospedagem**: Frontend hospedado no cPanel; backend hospedado em servidor dedicado ou serviço de cloud computing compatível com Node.js.

## Pré-requisitos

Antes de iniciar a instalação, certifique-se de ter:

- **Acesso SSH**: Credenciais fornecidas pelo administrador do servidor.
- **Node.js**: Versão 18 ou superior instalada na máquina local para o desenvolvimento.
- **Git**: Para clonagem do repositório.

## Instalação via SSH

Siga os passos abaixo para configurar o projeto:

1. **Acessar o Servidor via SSH**:

   ```bash
   ssh usuario@seu_servidor
