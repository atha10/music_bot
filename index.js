const Discord = require('discord.js');
const prefix = '/';
//const token = 'NjQ3NzY4ODYzNDMzNDI0OTM2.XdvxaQ.LUYBBK0VusXJhkavPNV207SD0X8';
const ytdl = require('ytdl-core');

const client = new Discord.Client();
const search = require('youtube-search');
const opts = {
    maxResults: 1,
    key: 'AIzaSyAz_iSE7lyu3ckiuYVYMdG5PJZQHqAYR0c',
    type: 'video'
};
//hello

const queue = new Map();
client.login(process.env.TOKEN);
client.once('ready', () => {
	console.log('Ready!');
});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});

client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	const serverQueue = queue.get(message.guild.id);

	if (message.content.startsWith(`${prefix}play`)) {
		execute(message, serverQueue);
		return;
	} else if (message.content.startsWith(`${prefix}skip`)) {
		skip(message, serverQueue);
		return;
	} else if (message.content.startsWith(`${prefix}stop`)) {
		stop(message, serverQueue);
		return;
	} else {
		message.channel.send('You need to enter a valid command!')
	}
});

async function execute(message, serverQueue) {
	const args = message.content.split(' ');

	const voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send('I need the permissions to join and speak in your voice channel!');
    }
    let filter = m => m.author.id === message.author.id;
    let query = await message.channel.awaitMessages(filter, { max: 1 });
    let songInfo = await search(query.first().content, opts).catch(err => console.log(err));
    //const songInfo = await ytdl.getInfo(args[1]);
    console.log(songInfo);

        const youtubeResults = songInfo.results;
        const url2 = youtubeResults.map(result => {
        return result.id
        });
        const title2 = youtubeResults.map(result => {
            return result.title
            });
        console.log(url2);
const song = {
    title: title2,
    url: url2,
}
    
 

	if (!serverQueue) {
		const queueContruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true,
		};

		queue.set(message.guild.id, queueContruct);

		queueContruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueContruct.connection = connection;
			play(message.guild, queueContruct.songs[0]);
		} catch (err) {
			console.log(err);
			queue.delete(message.guild.id);
			return message.channel.send(err);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		return message.channel.send(`${song.title} has been added to the queue!`);
	}

}

function skip(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	if (!serverQueue) return message.channel.send('There is no song that I could skip!');
	serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	serverQueue.songs = [];
	serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    console.log(song);
	let name = new Client.RichEmbed()
          .setColor("RED")
           .setTitle('🎧 Playing Song 🎧' + song.title);
	 message.channel.send(name);

	if (!song) {
		serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        
		return;
	}
   //server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url, {filter: "audioonly"}))
		.on('end', () => {
			console.log('Music ended!');
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => {
			console.error(error);
		});
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}
