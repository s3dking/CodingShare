module.exports = (client) => {
	const userPingCount = new Map();
	const SPAM_THRESHOLD = 5;
	const TIME_WINDOW = 10000;

	client.on('messageCreate', (message) => {
		if (message.author.bot || !client.antiSpamConfig?.active) return;

		const userId = message.author.id;
		const now = Date.now();

		if (!userPingCount.has(userId)) {
			userPingCount.set(userId, []);
		}

		const timestamps = userPingCount.get(userId);
		timestamps.push(now);

		while (timestamps.length > 0 && timestamps[0] <= now - TIME_WINDOW) {
			timestamps.shift();
		}

		if (timestamps.length >= SPAM_THRESHOLD) {
			message.reply('Please stop spamming pings.');
			message.member.timeout(client.antiSpamConfig.timeout, 'Spamming pings');
		}
	});
};
