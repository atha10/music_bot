const { 
    Client,
    Attachment
 } = require('discord.js');
const Discord = require('discord.js');
const bot = new Client();
const ytdl = require("ytdl-core");

const token = 'NjQ3NzY4ODYzNDMzNDI0OTM2.Xdvw4w.AjcJ4rhTgRhqwsh-60NLGBpZwnk';
const PREFIX = '/';
var version = '1.2';
const search = require('youtube-search');
const opts = {
    maxResults: 25,
    key: 'AIzaSyAz_iSE7lyu3ckiuYVYMdG5PJZQHqAYR0c',
    type: 'video'
}

var servers = {};
bot.on('ready',() =>{
    console.log('Music Bot is READY!!!!!' + version);

})

bot.on('message', message => {
    let args = message.content.substring(PREFIX.length).split(" ");
    switch (args[0]){
        case 'play':
               function play(connection, message){
                      let name = new Discord.RichEmbed()
                      .setTitle("🎧 Playing Song 🎧")
                      .setColor("RED")
                     message.channel.send(name);
              
              
                          var server = servers[message.guild.id];
                          server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));
                         
                          server.queue.shift();
                          server.dispatcher.on("end", function(){
                              if(server.queue[0]){
                                  play(connection, message);
                                   
                              }else {
                                  connection.disconnect();
                              }
                          
                      })
                  }
                  if(!message.member.voiceChannel){
                    let voice = new Discord.RichEmbed()
                     .setTitle("❌ You Must be in a Voice Channel!!!")
                     .setColor("RED")
                    message.channel.send(voice);
                    return;
                    
                }
                if(!servers[message.guild.id]) servers[message.guild.id] = {
                  queue: []
                } 
                var server = servers[message.guild.id];
                server.queue.push(args[1]);
            
                
                if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){         
                  play(connection, message);
                  
            })
         
      /* function play(connection, message){
        let name = new Discord.RichEmbed()
       // .setTitle("🎧 Playing Song 🎧")
       // .setColor("RED")
       //message.channel.send(name);


            var server = servers[message.guild.id];
            server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));
           
            server.queue.shift();
            server.dispatcher.on("end", function(){
                if(server.queue[0]){
                    play(connection, message);
                     
                }else {
                    connection.disconnect();
                }
            
        })
    }
        if(!args[1]){

         message.channel.send(' Please Provide Proper Name Or URL');
         return;
        }
        if(!message.member.voiceChannel){
            let voice = new Discord.RichEmbed()
             .setTitle("❌ You Must be in a Voice Channel!!!")
             .setColor("RED")
            message.channel.send(voice);
            return;
            
        }
        if(!servers[message.guild.id]) servers[message.guild.id]= {
            queue: []
        }
        var server = servers[message.guild.id];
        server.queue.push(args[1]);
        
        if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
          play(connection, message);
        })*/

        break;
    case 'skip':
            var server = servers[message.guild.id];
        
            if(server.dispatcher) server.dispatcher.end();
            let Skipped = new Discord.RichEmbed()
            .setTitle("✅ Song Is Skipped ✅")
             .setColor("GREEN") 
            message.channel.send(Skipped);
    break;
    case 'stop':
            var server = servers[message.guild.id];
            if(message.guild.voiceConnection){
                for(var i = server.queue.length -1; i >= 0; i--){

                server.queue.splice(i,1);
            }
            server.dispatcher.end();
            message.channel.send("✔️ Ending The Queue & Leaving The Channel ✔️");
            console.log('Stopped the Queue');
                }
            if(message.guild.connection) message.guild.voiceConnection.disconnect();
     break;  
    /* case 'name':
            function play(connection, sname){
              //  let name = new Discord.RichEmbed()
               // .setTitle("🎧 Playing Song 🎧")
               // .setColor("RED")
               //message.channel.send(name);
        
        
                    var server = servers[sname.guild.id];
                    server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));
                   
                    server.queue.shift();
                    server.dispatcher.on("end", function(){
                        if(server.queue[0]){
                            play(connection, sname);
                             
                        }else {
                            connection.disconnect();
                        }
                    
                })
            }
               
        let filter = m => m.author.id === message.author.id;
        let query =  message.channel.awaitMessages(filter, { max: 1 });
        let results =  search(query.first().content, opts).catch(err => console.log(err));
        if(results) {
            let youtubeResults = results.results;
            let i  =0;
            let titles = youtubeResults.map(result => {
                i++;
                return i + ") " + result.title;
            });
            console.log(titles);
            message.channel.send({
                embed: {
                    title: 'Select which song you want by typing the number',
                    description: titles.join("\n")
                }
            }).catch(err => console.log(err));
            
            filter = m => (m.author.id === message.author.id) && m.content >= 1 && m.content <= youtubeResults.length;
            let collected = await message.channel.awaitMessages(filter, { maxMatches: 1 });
            let selected = youtubeResults[collected.first().content - 1];
            let sname = selected.link;

            embed = new Discord.RichEmbed()
                .setTitle(`🎧 Playing Song 🎧 ${selected.title}`)
                .setURL(`${selected.link}`)
                .setDescription(`${selected.description}`)
                .setThumbnail(`${selected.thumbnails.default.url}`);

            message.channel.send(embed);
            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
                play(connection, sname);
              })
        }*/
    }

})
bot.login(token);
