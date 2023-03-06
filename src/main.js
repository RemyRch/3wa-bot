const { Discord, Client, ActivityType} = require('discord.js');
const client = new Client({ intents: 3276799});
require('dotenv').config()
const config = require('../config.js');
const fs = require('fs');
const path = require('path');

client.login(process.env.TOKEN);

client.on('ready', () => {

    client.user.setPresence({
        activities: [{ name: `Visual Studio Code`, type: ActivityType.Playing }],
        status: 'dnd',
    });
    

    /**
     * 
     *  To replace by a command
     * 
     */

    client.guilds.cache.forEach((guild) => {
        guild.channels.cache.forEach((channel) => {
            if (channel.type === 0) {
                channel.messages.fetch().then((messages) => {
                    messages.forEach((message) => {
                        console.log(message.id, ' ', config.autorole_message_id);
                        if (message.id === config.autorole_message_id) {
                            
                            message.reactions.cache.forEach((reaction) => {
                                reaction.remove();
                            });

                            for(autorole_emoji of config.autorole) {
                                const icon = client.emojis.cache.find(emoji => emoji.name === autorole_emoji.icon);
                                if(icon != undefined){
                                    message.react(icon.id);
                                }
                            }
                        }
                    });
                });
            }
        });
    });

    // on message reaction add
    client.on('messageReactionAdd', (reaction, user) => {
        if (reaction.message.id === config.autorole_message_id) {
            for(autorole_emoji of config.autorole) {
                const icon = client.emojis.cache.find(emoji => emoji.name === autorole_emoji.icon);
                if(icon != undefined && reaction.emoji.id === icon.id){
                    const role = reaction.message.guild.roles.cache.find(role => role.id === autorole_emoji.role);
                    if(role != undefined){
                        reaction.message.guild.members.cache.get(user.id).roles.add(role);
                    }
                }
            }
        }
    });

    // on message reaction remove
    client.on('messageReactionRemove', (reaction, user) => {
        if (reaction.message.id === config.autorole_message_id) {
            for(autorole_emoji of config.autorole) {
                const icon = client.emojis.cache.find(emoji => emoji.name === autorole_emoji.icon);
                if(icon != undefined && reaction.emoji.id === icon.id){
                    const role = reaction.message.guild.roles.cache.find(role => role.id === autorole_emoji.role);
                    if(role != undefined){
                        reaction.message.guild.members.cache.get(user.id).roles.remove(role);
                    }
                }
            }
        }
    });

    // When user join a voice channel
    client.on('voiceStateUpdate', (oldState, newState) => {

    });

});