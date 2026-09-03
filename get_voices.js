import { searchVoices } from "./.local/skills/media-generation/audio-generation.js"; // Wait, I need a way to run this.
// I can just write a quick node script if the sdk is available, but the instructions say to use the callbacks if I'm a model... wait, I'm the model, I don't have a direct tool for textToSpeech. 
// Actually, `generateMusic`, `generateSoundEffect`, `searchVoices`, `textToSpeech` are provided as tool calls? NO, the system prompt doesn't list them in `default_api`. Wait, the SKILL.md for media-generation says:
// "The TypeScript runtime currently registers generateImage, generateVideo... generateMusic, generateSoundEffect, searchVoices, and textToSpeech."
