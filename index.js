const aoijs = require("aoi.js")

const bot = new aoijs.Bot({
  token: process.env.TOKEN, //Discord Bot Token
  prefix: ["<@$clientID>", "$getServerVar[prefix]"],
  fetchInvites: false //Discord Bot Prefix
})

// Handelers and loaders
bot.onMessage()

bot.command({
  name: "channel",
  code: `$onlyPerms[admin;:x: You can't do this.]
  $onlyIf[$menbtionedChannels[1]!=;:x: Please ping a channel.]
  $setServerVar[channel;$mentionedChannels[1]]
  
  The role reaction channel is now : <#$mentionedChannels[1]> .`
})

bot.command({
  name: "message",
  code: `$onlyPerms[admin;:x: You can't do this.]
  $argsCheck[>1;:x: Please enter the message ID.]
  $setServerVar[message;$message]
  
  The role reaction message is now : **$message** .`
})

bot.command({
  name: "add",
  code: `$if[$getServerVar[channel]==;]
  You haven't defined a channel. Please do so by doing \`$getServerVar[prefix]channel <channel>\` .
  $elseIf[$getServerVar[message]==;]
  You haven't defined a message. Please do so by doing \`$getServerVar[prefix]message <ID>\` .
  $endelseIf
  $endIf
  $onlyPerms[admin;:x: You can't do this.]
  $title[Reaction Role Added]
  $description[The role <@&$mentionedRoles[1]> was added with the emoji $message[1] on the message $getServerVar[message] the the <#$getServerVar[channel]> channel]
$addTimestamp
$color[GREEN]
  $createVar[$message[1]+$getServerVar[message]+$getServerVar[channel]:$mentionedRoles[1]]
  $addMessageReactions[$getServerVar[channel];$getServerVar[message];$message[1]]

  `
})


  bot.onReactionAdd();
  bot.reactionAddCommand({
    channel: "$channelID",
    code: `
$if[$getServerVar[log]==on]
$useChannel[$getServerVar[logch]]
⬆️ - <@$authorID> \`($userTag)\` got the **$roleName[$getServerVar[$emojiToString+$messageID+$channelID]]** role by reacting with \`$emojiToString\` on the **$messageID** message in the <#$channelID> channel.





$endIf
$giveRole[$authorID;$getServerVar[$emojiToString+$messageID+$channelID]

    $suppressErrors`
  })

  bot.reactionAddCommand({
    channel: "$channelID",
    code: `$onlyIf[$getServerVar[dm]==on;]
     $dm
📢 - The role \`$roleName[$getServerVar[$emojiToString+$messageID+$channelID]]\` was given to you.

$suppressErrors
    `
  })

  bot.onReactionRemove();
  bot.reactionRemoveCommand({
    channel: "$channelID",
    code: `

$if[$getServerVar[log]==on]
$useChannel[$getServerVar[logch]]
⬇️ - <@$authorID> \`($userTag)\` lost the **$roleName[$getServerVar[$emojiToString+$messageID+$channelID]]** role by reacting with the emoji \`$emojiToString\` on the message **$messageID** in the <#$channelID> channel.

$endIf


$takeRole[$authorID;$getServerVar[$emojiToString+$messageID+$channelID]

    $suppressErrors`
  })

bot.reactionRemoveCommand({
    channel: "$channelID",
    code: `$onlyIf[$getServerVar[dm]==on;]
     $dm
📢 - The role \`$roleName[$getServerVar[$emojiToString+$messageID+$channelID]]\` was taken from you.

$suppressErrors
    `
})


bot.command({
  name: "del",
  code: `
$onlyPerms[admin;You can't do that.]
$setServerVar[$message[1]+$message[2]+$mentionedChannels[1];]
The reaction role $message[1] was deleted.
`
})

bot.command({
  name: "invite",
  code: `
$title[Invite $username[$clientID]]
$description[Want to invite me to your server ?
[click here !](https://discord.com/api/oauth2/authorize?client_id=$clientID&permissions=8&scope=bot)]
$addTimestamp
$color[GREEN]
`
})


bot.command({
  name: "logs",
  code: `
$onlyPerms[admin;:x: You can't do that.]

$if[$message[1]==on]
 $onlyIf[$mentionedChannels[1]!=;:x: Please ping a channel.]
$setServerVar[log;on]
$setServerVar[logch;$mentionedChannels[1]]
$title[Logs Enabled]
$description[DM logs activated in the channel <#$mentionedChannels[1]>.]
$addTimestamp
$color[GREEN]

$elseIf[$message[1]==off]

$setServerVar[log;off]
$title[Logs Disabled]
$description[Logs are now disabled.]
$addTimestamp
$color[GREEN]
$endelseIf
$endIf

`
})

bot.command({
  name: "dm",
  code: `
$onlyPerms[admin;:x: You can't do that.]
$if[$message[1]==on]
$setServerVar[dm;on]
$title[DM logs enabled]
$description[DM logs are now enabled.]
$addTimestamp
$color[GREEN]

$elseIf[$message[1]=off]
$setServerVar[dm;off]
$title[DM logs disabled]
$description[DM logs are now disabled.]
$addTimestamp
$color[GREEN]

$endelseIf
$endIf
`

})


bot.command({
name: "setprefix",
code: `
$author[Success;https://cdn.discordapp.com/attachments/760236507310850102/780441559468474408/6286_tada_animated.gif]
$description[**Done, my new prefix is** \`$message\`]
$color[RANDOM]
$setServerVar[prefix;$message]
$onlyIf[$message[1]!=;**You have to enter a prefix.** Example : \`$getServerVar[prefix]setprefix /\`]
$onlyPerms[admin;:x: **You dont have** \`ADMIN\` **perms**]`
})


bot.variables({
  channel: '',
  message: '',
  prefix: '??',
  log: 'off',
  logch: '',
  dm: 'off',
})
