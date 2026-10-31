# Ativar "Continuar com o Google" (backup na nuvem)

O botão já está no app (menu do $ › Settings), mas só funciona depois de você criar um "ID do cliente" gratuito no Google. É uma configuração única, de uns 10 minutos.

1. Acesse https://console.cloud.google.com e crie um projeto (ex.: "Expense Control").
2. Menu **APIs e serviços › Biblioteca** → procure **Google Drive API** → **Ativar**.
3. Menu **APIs e serviços › Tela de permissão OAuth** (ou "Google Auth Platform"):
   - Tipo de usuário: **Externo**; preencha nome do app e seu e-mail.
   - Em **Escopos / Acesso a dados**, adicione:
     - `.../auth/drive.appdata`
     - `.../auth/userinfo.email`
   - Enquanto o app estiver em **Teste**, adicione seu Gmail (e o de quem for testar) em **Usuários de teste**.
     Para qualquer pessoa poder entrar, clique em **Publicar app**. Esses dois escopos não exigem verificação do Google.
4. Menu **Credenciais › Criar credenciais › ID do cliente OAuth**:
   - Tipo: **Aplicativo da Web**.
   - **Origens JavaScript autorizadas**: o endereço onde o app está publicado, só o domínio, sem barra no final
     (ex.: `https://meuapp.com`). Para testar no computador: `http://localhost:8000`.
5. Copie o **ID do cliente** (termina em `.apps.googleusercontent.com`).
6. No `index.html`, procure esta linha e cole o ID entre as aspas:

   ```js
   var GOOGLE_CLIENT_ID='';
   ```

7. Publique os arquivos de novo e abra o app duas vezes (a primeira atualiza o cache offline).

## O que é salvo

Gastos, salário, limites, apelido, idioma e a foto do ícone. A foto de fundo e a música escolhida **não** vão para a nuvem (são pesadas); ficam só no aparelho.

O backup fica numa pasta escondida do app, dentro do Google Drive da própria pessoa. Só este app enxerga esse arquivo, e ele não aparece na lista de arquivos do Drive.

## Como funciona para o usuário

- Primeiro login: se a conta já tem backup e o aparelho está sem dados próprios (app recém-instalado), os dados voltam sozinhos. Se o aparelho já tem dados, o app pergunta qual versão manter.
- Depois de conectado, cada alteração é enviada sozinha enquanto o acesso do Google estiver ativo (cerca de 1 hora). Depois disso, o botão **Salvar agora** renova o acesso e envia.
