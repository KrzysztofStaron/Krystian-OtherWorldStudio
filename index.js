const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const client = new Discord.Client();
let permisionRole="worker";
let prefix;
if (!fs.existsSync("info.json")) {fs.writeFileSync('info.json', JSON.stringify({}))};
let info = JSON.parse(fs.readFileSync('info.json'));
let playerData;


client.on('ready', () => {
  console.log(`Krystian on`);
});

client.on('message', msg => {
  if (msg.author.bot) return;
  const getCommand = function() {return msg.content.split(" ")}
  const getMeasage = function() {return msg.content.toLowerCase()}
  const send = function(txt) {msg.channel.send(txt)}
  const noPermision= function(){send("only "+permisionRole+" can use this command");return;}
  const permision=msg.member.roles.cache.some(r => r.name === permisionRole)
  const createData = function (who) {info[who]={"points":0};}

  info = JSON.parse(fs.readFileSync('info.json'));

  const showPoints = function() {
    let toWho = msg.mentions.users.first() || msg.author;
    send(toWho.username+" has: **" + info[toWho.id].points+"** points");
  }

  prefix = info.prefix;
  if (getMeasage().charAt(0)!=prefix) {return;}
  if (!info.hasOwnProperty(msg.author.id)) createData(msg.author.id);

  if (getCommand()[0]==prefix + "changePrefix") {
    if (permision) {
      if (getCommand().length < 1) {
        send("{prefix}");;
      }else if(getCommand()[1].length!=1){
        send("prefix must have 1 char");
      }else{
        info.prefix=getCommand()[1];
        send("prefix: "+info.prefix)
        msg.guild.members.cache.get("863100627436830721").setNickname(`Krystian[${info.prefix}]`);
      }
    }else{noPermision();}
  }

  if (getCommand()[0]==prefix + "addPoints") {
    if (permision) {
      if (getCommand().length < 2) {
        send("{how many?} {who}");
      }else if(!parseInt(getCommand()[1]) > 0){
        send("number!!");
      }else{
        let toWho = msg.mentions.users.first();
        if (!info.hasOwnProperty(toWho.id)) createData(toWho.id);
        info[toWho.id].points += parseInt(getCommand()[1]);
        send(toWho.username+" now has: **" + info[toWho.id].points+"** points");
      }
    }else{noPermision();}
  }

  if (getCommand()[0]==prefix + "points") {
    showPoints();
  }

  fs.writeFileSync('info.json',JSON.stringify(info));
});

client.on('guildMemberAdd', member => {
    console.log(member);
});

client.login(JSON.parse(fs.readFileSync('token.txt', 'utf8')));
