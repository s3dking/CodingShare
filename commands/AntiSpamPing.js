const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('antispamping')
		.setDescription('Configure and activate the anti-spam ping system')
		.addSubcommand(subcommand =>
			subcommand
				.setName('set')
				.setDescription('Set the timeout duration for the anti-spam ping system')
				.addIntegerOption(option => 
					option.setName('duration')
						.setDescription('Timeout duration in seconds')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('activate')
				.setDescription('Activate the anti-spam ping system'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('deactivate')
				.setDescription('Deactivate the anti-spam ping system')),
	async execute(interaction, client) {
		if (!interaction.member.permissions.has('ManageGuild')) {
			return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
		}

		const subCommand = interaction.options.getSubcommand();

		if (!client.antiSpamConfig) {
			client.antiSpamConfig = {
				active: false,
				timeout: 60000 // default timeout duration in milliseconds
			};
		}

		switch (subCommand) {
			case 'set':
				const timeoutDuration = interaction.options.getInteger('duration');
				client.antiSpamConfig.timeout = timeoutDuration * 1000;
				await interaction.reply({ content: `Anti-spam timeout duration set to ${timeoutDuration} seconds.`, ephemeral: true });
				break;

			case 'activate':
				client.antiSpamConfig.active = true;
				await interaction.reply({ content: 'Anti-spam ping system activated.', ephemeral: true });
				break;

			case 'deactivate':
				client.antiSpamConfig.active = false;
				await interaction.reply({ content: 'Anti-spam ping system deactivated.', ephemeral: true });
				break;

			default:
				await interaction.reply({ content: 'Invalid subcommand.', ephemeral: true });
		}
	}
};
