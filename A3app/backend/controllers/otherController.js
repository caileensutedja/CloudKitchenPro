const Recipe = require('../models/recipe');
const Inventory = require('../models/inventory');
const User = require('../models/user');
const textToSpeech = require("@google-cloud/text-to-speech");
const ttsClient = new textToSpeech.TextToSpeechClient();

module.exports = {
    dashboard: async function (req, res){
        try {
            // const { role, userId, fullname, email } = req.query;
            let userCount = await User.countDocuments();
            let recipeCount = await Recipe.countDocuments();
            let inventoryCount = await Inventory.countDocuments();
            console.log('hi userCount, recipeCount, inventoryCount',userCount, recipeCount, inventoryCount )
            res.status(200).json({
                userCount,
                recipeCount,
                inventoryCount
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Server Error'})
        }
    },
    textToSpeech: async function (req, res) {
        try {
            const text = req.body.text;
            console.log('got text: ', text)
            if (!text) return res.status(400).json({ error: "Text is required" });

            const request = {
                input: { text },
                voice: {
                    languageCode: "en-US",
                    name: "en-US-Chirp3-HD-Leda"
                },
                audioConfig: { audioEncoding: "MP3" }
            };
            
            const [response] = await ttsClient.synthesizeSpeech(request);
            res.set("Content-Type", "audio/mpeg");
            res.send(response.audioContent);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "TTS Server Error" });
        }
    }
};