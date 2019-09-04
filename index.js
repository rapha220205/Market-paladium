const Discord = require ("discord.js");
const fs = require('fs');
const client = new Discord.Client();
var prefix = "+";

const warns = JSON.parse(fs.readFileSync('./warns.json'))

client.login(process.env.TOKEN);

client.on('ready', function(){
    client.user.setActivity("Etre Dev", {type: "PLAYING"})
});

client.on('message', message => {
    if(message.content === "Salut"){
    message.reply("hey ^^")
   console.log("Repond a Salut")
    };
});

client.on('message', message => {
    if(message.content === "Bonjour"){
    message.reply("Bien le Bonjour Camarade :wink:")
    console.log("Repond a Bonjour")
    };
});

client.on('message', message => {
    if(message.content === "Putain"){
    message.reply("**Ton Language; Tu risque un Mute !! Gars à toi !!**")
   console.log("Repond a Putain")
    };
});

client.on('guildMemberAdd', function (member) {
    let embed = new Discord.RichEmbed()
        .setColor("ffffff")
        .setDescription("Bienvenue **" + member.user.username + '** Sur ' + member.guild.name + " ici tu peux trouvé tous ce que tu veux comme item de Paladium :smiley: ! Je t'invite à lire le #╠:pencil:réglement pour mieux connaitre les régles du serveur ! :smiley::tada::tada: ")
        .setFooter('Nous sommes désormais ' + member.guild.memberCount)
    member.guild.channels.get('616752785450598404').send(embed)
});


client.on('guildMemberRemove', function (member) {
    let embed = new Discord.RichEmbed()
        .setColor("ffffff")
        .setDescription('Mince .... ' + member.user.username + '** à quitté ' + member.guild.name + " , à la prochaine :slight_frown: ! ")
        .setFooter('Nous sommes désormais ' + member.guild.memberCount)
    member.guild.channels.get('616752785450598404').send(embed)
});

/*Kick*/
client.on('message', function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLowerCase() === prefix + 'kick') {
       if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
       let member = message.mentions.members.first()
       if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
       if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas kick cet utilisateur :x:")
       if (!member.kickable) return message.channel.send("Je ne peux pas exclure cet utilisateur :grimacing:")
       member.kick()
       message.channel.send('**' + member.user.username + '** a été exclu :white_check_mark:')
    };
});

/*Ban*/
client.on('message', function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLocaleLowerCase() === prefix + 'ban') {
       if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
       let member = message.mentions.members.first()
       if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
       if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas bannir cet utilisateur :x:")
       if (!member.bannable) return message.channel.send("Je ne peux pas bannir cet utilisateur :grimacing:")
       message.guild.ban(member, {days: 7})
       message.channel.send('**' + member.user.username + '** a été banni :white_check_mark:')
    };
});

client.on('message', function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLowerCase() === prefix + "clear") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
        let count = parseInt(args[1])
        if (!count) return message.channel.send("Veuillez indiquer un nombre de messages à supprimer")
        if (isNaN(count)) return message.channel.send("Veuillez indiquer un nombre valide")
        if (count < 1 || count > 100) return message.channel.send("Veuillez indiquer un nombre entre 1 et 100")
        message.channel.bulkDelete(count + 1, true)
    }

    if (args[0].toLowerCase() === prefix + "mute") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas mute ce membre")
        if (!member.manageable) return message.channel.send("Je ne peux pas mute cet utilisateur :grimacing:")
        let muterole = message.guild.roles.find(role => role.name === 'Muted')
        if (muterole) {
            member.addRole(muterole)
            message.channel.send(member + ' a été mute :white_check_mark:')
        }
        else {
            message.guild.createRole({name: 'Muted', permissions: 0}).then(function (role) {
                message.guild.channels.filter(channel => channel.type === 'text').forEach(function (channel) {
                    channel.overwritePermissions(role, {
                        SEND_MESSAGES: false
                    })
                })
                member.addRole(role)
                message.channel.send(member + ' a été mute :white_check_mark:')
            })
        }
    }
})

client.on("message", function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLowerCase() === prefix + "warn") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas warn ce membre")
        let reason = args.slice(2).join(' ')
        if (!reason) return message.channel.send("Veuillez indiquer une raison")
        if (!warns[member.id]) {
            warns[member.id] = []
        }
        warns[member.id].unshift({
            reason: reason,
            date: Date.now(),
            mod: message.author.id
        });
        fs.writeFileSync('./warns.json', JSON.stringify(warns))
        message.channel.send(member + " a été warn pour " + reason + " :white_check_mark:")
    }
 
    if (args[0].toLowerCase() === prefix + "infractions") {
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionner un membre")
        let embed = new Discord.RichEmbed()
            .setAuthor(member.user.username, member.user.displayAvatarURL)
            .addField('10 derniers warns', ((warns[member.id] && warns[member.id].length) ? warns[member.id].slice(0, 10).map(e => e.reason) : "Ce membre n'a aucun warns"))
            .setTimestamp()
        message.channel.send(embed)
    };
});
 
client.on("message", function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    //unmute
    if (args[0].toLowerCase() === prefix + "unmute") {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionner un membre")
        if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unmute ce membre.")
        if(!member.manageable) return message.channel.send("Je ne peux pas unmute ce membre.")
        let muterole = message.guild.roles.find(role => role.name === 'Muted')
        if(muterole && member.roles.has(muterole.id)) member.removeRole(muterole)
        message.channel.send(member + ' a été unmute :white_check_mark:')
    }
 
    //unwarn
    if (args[0].toLowerCase() === prefix + "unwarn") {
        let member = message.mentions.members.first()
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
        if(!member) return message.channel.send("Membre introuvable")
        if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unwarn ce membre.")
        if(!member.manageable) return message.channel.send("Je ne peux pas unwarn ce membre")
        if(!warns[member.id] || !warns[member.id].length) return message.channel.send("Ce membre n'a actuellement aucun warns.")
        warns[member.id].shift()
        fs.writeFileSync('./warns.json', JSON.stringify(warns))
        message.channel.send("Le dernier warn de " + member + " a été retiré :white_check_mark:")
    };
});

client.on("message", function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
if(message.content === prefix + "help"){
    var help_embed = new Discord.RichEmbed()
    .setColor("ffffff")
    .setThumbnail("https://cdn.discordapp.com/attachments/609007129008930816/609568775263485952/Globadis_1.jpg%22")
    .setTitle("Voici les commandes d'aide:")
    .setDescription("Vous pouvez utiliser mes commandes avec le prefix + ")
    .addField("Help:"," ```affiche les commandes```")
    .addField("Help-staff:"," ```affiche les commandes de moderation```")
    .addField("Serveur-info:"," ```donne les informations sur le serveur```")
    .addField("Kill","```Kill l'utilisateur mentionner```")
    .addField("Error","```L'utilisateur a cesser de fonctionner```")
    .setTimestamp()
    .setFooter("Par Rapha2202 | Globadis#1120")
    message.channel.sendMessage(help_embed)
    console.log ("Help")
    message.delete();
}

if(message.content === prefix + "help-staff"){
var staff_embed = new Discord.RichEmbed()
.setColor("ffffff")
.setThumbnail("https://cdn.discordapp.com/attachments/609007129008930816/609568775263485952/Globadis_1.jpg%22")
.setTitle("Voici les commandes de moderation:")
.setDescription("Vous pouvez utiliser mes commandes avec le prefix + ")
.addField("Ban:"," ```Ban l'utilisateur mentionner```")
.addField("kick:"," ```Kick l'utilisateur mentionner```")
.addField("Mute:"," ```Mute l'utilisateur mentionner```")
.addField("Unmute:"," ```Unmute l'utilisateur mentionner```")
.addField("Warn:"," ```Warn l'utilisateur mentionner```")
.addField("Unwarn:"," ```Unwarn l'utilisateur mentionner```")
.addField("Clear:"," ```Clear le nombre de message demander```")
.addField("Infractions","```Affiche les warns de l'utilisateur mentionner```")
.addField("Gg-1","```Permet de dire GG a 1 personne```")
.addField("Gg-2","```Permet de dire GG a plusieurs personnes```")
.setTimestamp()
.setFooter("Par Rapha2202 | Globadis#1120") 
message.channel.sendMessage(staff_embed)
console.log ("Moderation")
message.delete();
};
});

client.on("message", function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
if(message.content === prefix + "serveur-info"){
    var serveurinfo = new Discord.RichEmbed()
    .setColor("000000")
    .setTitle("Voici les infos sur le discord")
    .addField("**Nom du discord: **", message.guild.name)
    .addField("**Crée le**", message.guild.createdAt)
    .addField("**Tu as rejoind le**", message.member.joinedAt)
    .addField("**Nombre de Joueur**", message.guild.memberCount)
    .setTimestamp()
    .setFooter("Par Rapha2202 | Globadis#1120")
    message.channel.sendMessage(serveurinfo)
    console.log ("Info")
    message.delete();
};
}); 

client.on("message", function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
if(message.content === prefix + "gg-1"){
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
    var GG1 = new Discord.RichEmbed()
    .setColor("ffffff")
    .setTitle("GG")
    .setDescription("**GG à toi. Go tous spam GG**")
    message.channel.sendMessage(GG1)
    console.log ("GG-1")
    message.delete();
};
});

client.on("message", function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
if(message.content === prefix + "gg-2"){
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
    var GG2 = new Discord.RichEmbed()
    .setColor("ffffff")
    .setTitle("GG")
    .setDescription("**GG à vous. Go tous spam GG**")
    message.channel.sendMessage(GG2)
    console.log ("GG-2")
    message.delete();
};
});

client.on('message', function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLocaleLowerCase() === prefix + 'kill') {
       let member = message.mentions.members.first()
       if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
       if (!member.bannable) return message.channel.send("Je ne peux pas kill cet utilisateur :grimacing:")
       message.channel.send('**' + member.user.username + '** a été kill, R.I.P ' + member.user.username + " il etait si jeune")
    };
});

client.on('message', function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

if (args[0].toLocaleLowerCase() === prefix + 'error') {
    let member = message.mentions.members.first()
    if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
    if (!member.bannable) return message.channel.send("je ne peux pas faire cesser de fonctionner cet utilisateur :grimacing:")
    message.channel.send("**" + member.user.username + "**.exe a cesser de fonctionner")
    };
});

client.on('message', function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

if (args[0].toLocaleLowerCase() === prefix + 'commande') {
    message.delete()
    
    var commande = new Discord.RichEmbed()
    .setColor("ffffff") 
    .setDescription(args.join(" **" + message.author.username + '** '))
    message.guild.channels.get('618218483401883649').sendEmbed(commande)

    var fin = new Discord.RichEmbed()
    .setColor("ffffff") 
    .setDescription(args.join(" **" + message.author.username + '** Votre commande a bien etait prise en compte :white_check_mark:. Commande: '))
    message.channel.sendEmbed(fin);


    console.log(`Commande say exécuté par ${message.author.username}`)
}
})

const ascii = require('ascii-art');

client.on('message', function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLocaleLowerCase() === prefix + 'ascii') {
        if (!args.join(' ')) return message.reply('Mettez le text a convertir');

        ascii.font(args.join(' '), 'Doom', function(rendered) {
            rendered = rendered.trimRight();
            if (rendered.length > 2000) return message.channel.send('Ce message est trop long :grimacing:')
            message.channel.send(rendered, {
                code: 'md'
            
            })
        })
    }
})
