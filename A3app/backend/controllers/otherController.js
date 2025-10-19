const Recipe = require('../models/recipe');
const Inventory = require('../models/inventory');
const User = require('../models/user');
const textToSpeech = require("@google-cloud/text-to-speech");
const ttsClient = new textToSpeech.TextToSpeechClient();
const { GoogleGenerativeAI } = require('@google/generative-ai');
// require('dotenv').config();
const GOOGLE_API_KEY= 'AIzaSyAUcybTTNmlCEqIwuu90QvUxvQhvS4kRLs'
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

module.exports = {
    dashboard: async function (req, res){
        try {
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
    // HD2: Text 2 Speech
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
    },
    // HD1: Google Gemini API function
    askGemini: async function (req, res) {
        try {
            const { prompt } = req.body;
            console.log('Sending request to Google Gemini...');
            console.log('Prompt:', prompt);

            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const answer = response.text();

            console.log('Google Gemini Response:');
            console.log(answer);
            console.log('-------------------');

            return res.status(200).json({
                success: true,
                response: answer,
                provider: 'Google Gemini'
            });
        } catch (error) {
            console.error('Google Gemini Error:', error.message);
            return res.status(500).json({
                success: false,
                error: error.message,
                provider: 'Google Gemini'
            });
        }
    }
};