import { players } from './index.js'

const nicknames = ['Black Mamba', 'Chocolate Thunder', 'Magic', 'Dr. Dunkenstein',
  'Air Jordan', 'King James', 'Shaq Diesel', 'Mailman', 'White Chocolate',
  'The Claw', 'Mr. Big Shot', 'Great Wall']

export async function addPlayer(ctx) {
  let firstName = ctx.message.from.first_name
  let lastName = ctx.message.from.last_name

  if (lastName === undefined) {
    lastName = nicknames[Math.floor(Math.random() * nicknames.length)]

    players.forEach((el) => {
      if (el.lastName === lastName) {
        lastName = nicknames[Math.floor(Math.random() * nicknames.length)]
      }
    })
  }

  if (players.length < 15) {
    let buffer = { firstName, lastName }
    players.push(buffer)
    await ctx.telegram.sendMessage(ctx.message.chat.id, printPlayers());
  } else {
    await ctx.telegram.sendMessage(ctx.message.chat.id, printPlayers());
    await ctx.telegram.sendMessage(ctx.message.chat.id, `Ты не успел, слишком много игроков.`);
  }
}

export async function removePlayer(ctx) {
  for (var i = players.length - 1; i >= 0; i--) {
    if (players[i].firstName === ctx.message.from.first_name) {
      players.splice(i, 1);
      break;
    }
  }
}

export async function removeListPlayers() {
  players.length = 0
}

export function printPlayers() {
  let resultString = 'Список игроков:\n'
  if (players.length == 0) return 'Список игроков пуст'

  if (players.length == 15) resultString = 'Опрос окончен\n'

  players.forEach((el, ind) => {
    resultString += `${ind + 1}. ${el.lastName} ${el.firstName}\n`
  })

  return resultString
}
