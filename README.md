
# EntrePáginas

**Seu espaço para acompanhar cada leitura.**

Aplicativo mobile para descobrir livros, organizar favoritos e registrar leituras com avaliações pessoais.

</div>

---

## Sobre o projeto

O **EntrePáginas** é um aplicativo desenvolvido com React Native, Expo e TypeScript como projeto acadêmico da disciplina de React Native. A proposta é oferecer um espaço simples e intuitivo para explorar livros e acompanhar a própria jornada literária.

O aplicativo consulta a API Open Library para pesquisar livros e apresentar informações como capa, título, autores, ano da primeira publicação, quantidade de edições e, quando disponível, descrição.

## Funcionalidades

- **Cadastro e login:** criação de conta e autenticação local.
- **Catálogo de livros:** visualização de livros em uma lista com capas e informações principais.
- **Busca:** pesquisa de livros por título ou autor.
- **Detalhes do livro:** consulta de informações adicionais obtidas pela API.
- **Favoritos:** adição e remoção de livros da lista de favoritos.
- **Livros lidos:** registro dos livros concluídos.
- **Avaliações:** atribuição de uma nota de 1 a 5 estrelas aos livros lidos.
- **Persistência local:** manutenção dos favoritos e das leituras entre sessões.
- **Navegação por abas:** acesso às telas Início, Favoritos e Lidos.
- **Acessibilidade e estados de interface:** rótulos acessíveis, indicadores de carregamento e mensagens de erro em fluxos relevantes.

## Tecnologias utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Navigation](https://reactnavigation.org/)
- [Open Library API](https://openlibrary.org/developers/api)
- AsyncStorage para persistência local de dados
- Expo SecureStore para armazenamento seguro de senhas
- Context API para compartilhar o estado de favoritos, leituras e autenticação

## Pré-requisitos

Antes de executar o projeto, instale:

- [Node.js](https://nodejs.org/) — preferencialmente uma versão compatível com a configuração do projeto.
- npm, instalado com o Node.js.
- Android Studio com um emulador Android, ou um dispositivo móvel compatível.
- Expo Go, caso opte por executar em um dispositivo físico e a configuração do projeto seja compatível.

## Como executar

1. Clone o repositório:

   ```bash
   git clone https://github.com/leticiafabri/EntrePaginas.git
   ```

2. Entre na pasta do projeto:

   ```bash
   cd EntrePaginas
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Inicie o Expo:

   ```bash
   npx expo start
   ```

5. Para abrir no emulador Android, pressione `a` no terminal do Expo. Para outras opções, siga as instruções apresentadas no terminal.

> **Observação:** a API Open Library é acessada pela internet. A disponibilidade dos resultados depende da conexão e do serviço externo.

## Estrutura do projeto

A organização principal do código está dentro de `src/`:

```text
src/
├── auth/             # Serviços de autenticação
├── components/       # Componentes reutilizáveis
├── contexts/         # Contextos de autenticação, favoritos e leituras
├── navigation/       # Configuração de navegação
├── screens/          # Telas do aplicativo
├── services/         # Integração com a Open Library API
└── types/            # Tipos e interfaces TypeScript
```

Os nomes ou a distribuição de arquivos podem variar conforme a versão atual do projeto.

## API utilizada

O aplicativo utiliza a **Open Library API** para pesquisar livros e consultar informações detalhadas.

Documentação oficial: https://openlibrary.org/developers/api

## Dados e autenticação

O projeto utiliza armazenamento local para manter informações do aplicativo no dispositivo:

- **AsyncStorage:** persistência de favoritos, livros lidos e dados locais da aplicação.
- **Expo SecureStore:** armazenamento das senhas de contas locais.
- **Context API:** compartilhamento do estado da sessão e das listas do usuário entre as telas.

A autenticação é local ao aplicativo e não representa uma conta hospedada em um serviço de autenticação remoto.

## Demonstração

🎥 **Vídeo de demonstração:** *link será adicionado após a gravação.*

> Substitua esta seção pelo link público do vídeo no YouTube quando a gravação estiver disponível.

## Integrantes

- **Bruno Viccenzo Mazetto**
- **Helen Lauren Bonato**
- **Leticia Bastias Fabri**

## Contexto acadêmico

Projeto desenvolvido para a disciplina de **Mobile Development: Framework**, com foco na construção de uma aplicação mobile, consumo de API, navegação entre telas, gerenciamento de estado, persistência local e experiência de usuário.

---

<div align="center">

**EntrePáginas — cada livro, uma nova história.** 📚

</div>
