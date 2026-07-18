# 🎮 Testando Socket.IO com um Jogo Multiplayer 🎮

![Static Badge](https://img.shields.io/badge/Finalizado-%2523?style=flat-square&color=%2311AA88)

[Jogar Agora](https://firstgamesocket-io.onrender.com)

## Objetivo

Estudar comunicação com websockets utilizando Socket.IO, para isto, foi desenvolvido um jogo multiplayer com uma mecânica simples

## Tecnologias Utilizadas

- Node.JS com Socket.IO
  - Para o servidor, foi-se utilizado Javascript com socket.io para a comunicação entre cliente e servidor
- HTML, CSS e JS
  - Código do cliente responsável pela renderização e comunicação bidirecional com o servidor
 
## Como executar localmente

Após baixar ou clonar o repositório, execute o seguinte comando

```bash
  node server.js
```

O servidor estará disponível na porta 3333, mas você pode também jogar online com os amigos no link disponibilizado lá em cima em Jogar Agora

## Observações

O tempo de nascimento das sementes tem o tempo mínimo de 1s controlado pelo servidor, mesmo que você tente mandar 1ms, o servidor criará as sementes com no mínimo 1s

O input do frontend escontra-se em ms, ou seja, 1500 = 1.5s

## O que foi aprendido

Comunicação bidirecional utilizando a biblioteca Socket.IO com Node.JS e JS de Browser

Além de boas práticas de DRY e YAGNI na hora de programar as funcionalidades do jogo, pois tentei sempre ser o mais simples possível e não criar muita complexidade desnecessário, visto que o foco era em aprender o uso da biblioteca
