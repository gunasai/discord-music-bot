const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const {
  entersState,
  joinVoiceChannel,
  VoiceConnectionStatus,
} = require('@discordjs/voice');

async function connectToChannel(channel) {
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });

  try {
    // await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
    console.log('CONNECTION', connection);
    return connection;
  } catch (error) {
    connection.destroy();
    throw error;
  }
}

module.exports = {
  name: 'play',
  description: 'Play a video from Youtube',
  async execute(message, args) {
    const voiceChannel = message.member?.voice.channel;

    if (!voiceChannel)
      return message.channel.send(
        'You need to be in a channel to execute this command!',
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT'))
      return message.channel.send('You dont have the correct permissions');
    if (!permissions.has('SPEAK'))
      return message.channel.send('You dont have the correct permissions');
    if (!args.length)
      return message.channel.send('You need to enter a song name');

    const connection = await connectToChannel(voiceChannel);

    const videoFinder = async (query) => {
      const videoResult = await ytSearch(query);

      return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
    };

    const video = await videoFinder(args.join(' '));

    if (video) {
      const stream = ytdl(video.url, { filter: 'audioonly' });

      console.log('STREAM', stream);

      connection.playStream(stream, { seek: 0, volume: 1 }).on('finish', () => {
        voiceChannel.leave();
      });

      await message.reply(`Now playing ***${video.title}***`);
    } else {
      message.channel.send('No results found');
    }
  },
};
