const discvoice = require('@discordjs/voice')
const prism = require('prism-media')


//discvoice.VoiceReceiver 
function createListeningStream(receiver, userId, user) {
	const opusStream = receiver.subscribe(userId, {
		end: {
			behavior: discvoice.EndBehaviorType.AfterSilence,
			duration: 100,
		},
	});

	const oggStream = new prism.opus.OggLogicalBitstream({
		opusHead: new prism.opus.OpusHead({
			channelCount: 2,
			sampleRate: 48000,
		}),
		pageSizeControl: {
			maxPackets: 10,
		},
	});

	const filename = `./recordings/${Date.now()}-${getDisplayName(userId, user)}.ogg`;

	const out = createWriteStream(filename);

	console.log(`👂 Started recording ${filename}`);

	pipeline(opusStream, oggStream, out, (err) => {
		if (err) {
			console.warn(`❌ Error recording file ${filename} - ${err.message}`);
		} else {
			console.log(`✅ Recorded ${filename}`);
		}
	});
}