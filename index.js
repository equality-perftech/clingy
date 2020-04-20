window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

const recognition = new SpeechRecognition();
const startButton = document.querySelector('#microphone');
const stopButton = document.querySelector('#stop-button');

let score = 2;
let words = "heart";
var receivedSpeechFlag;
var myTimeout;

startButton.onclick = () => {
  dictate();
  receivedSpeechFlag = false;

  // Set timeout of 10 seconds
  myTimeout = setTimeout(function(){
    if (!receivedSpeechFlag) {
       recognition.stop();   
       document.getElementById("speech-text-input").value = "Could not recognize speech. Please try again.";
       console.log("Timed out! Could not recognize speech.");
    }
  }, 10000);
}

  
const dictate = async() => {
    console.log("RECOGNITION STARTED");
    recognition.start();
    document.getElementById("speech-text-input").value = "Listening...";
    
    recognition.onresult = async(event) => {
      // Clear timeout
      receivedSpeechFlag = true;
      clearTimeout(myTimeout);

      const speechToText = event.results[0][0].transcript;
      document.getElementById("speech-text-input").value = speechToText;
      console.log("RECOGNITION ENDED");
  
      // ml5
      //analyzeSentiment(speechToText);
      
      // ml5
      console.log("Running prediction");
      const predictor = await ml5.sentiment('movieReviews', () => {
        words = speechToText;
        const prediction = predictor.predict(words);
        score = prediction.score;
        console.log(`Sentiment for ${words}: `, score);
        displaySentimentResults();
      });
      
  
      //tensorflow
      // console.log("running prediction")
      // const predictor = await new SentimentPredictor().init(HOSTED_URLS);
      // words = speechToText;
      // score = predictor.predict(speechToText).score;
      // console.log(score);
    }
}

const displaySentimentResults = () => {
  /** Display sentiment score */
  var roundedScore = (score*100).toFixed(1);
  document.getElementById("score").innerHTML = "(" + roundedScore + "%)";
  // Positive
  if (score >= .6){
    document.getElementById("sentiment").innerHTML = "POSITIVE";
    document.getElementById("sentiment").style.color = "green";
  }

  // Neutral
  if (score >= .3 && score <.6){
    document.getElementById("sentiment").innerHTML = "NEUTRAL";
    document.getElementById("sentiment").style.color = "yellow";
  }

  // Neutral
  if (score < .3){
    document.getElementById("sentiment").innerHTML = "NEGATIVE";
    document.getElementById("sentiment").style.color = "red";
  }
}

//ml5
const analyzeSentiment = (text) => {
    // Create a new Sentiment method
    const sentiment = ml5.sentiment('movieReviews', modelReady);

    // When the model is loaded
    function modelReady() {
        // model is ready
        console.log('Model Loaded!');

        // make the prediction
        const prediction = sentiment.predict(text);
        score = prediction.score;
        console.log(`Sentiment for ${text}: `, score);
    } 
}




// //tensor flow predictions. taken from : https://www.twilio.com/blog/how-positive-was-your-year-with-tensorflow-js-and-twilio
// //sequence utils
// const PAD_INDEX = 0;  // Index of the padding character.
// const OOV_INDEX = 2;  // Index fo the OOV character.
// function padSequences(
//     sequences, maxLen, padding = 'pre', truncating = 'pre', value = PAD_INDEX) {
//   // TODO(cais): This perhaps should be refined and moved into tfjs-preproc.
//   return sequences.map(seq => {
//     // Perform truncation.
//     if (seq.length > maxLen) {
//       if (truncating === 'pre') {
//         seq.splice(0, seq.length - maxLen);
//       } else {
//         seq.splice(maxLen, seq.length - maxLen);
//       }
//     }

//     // Perform padding.
//     if (seq.length < maxLen) {
//       const pad = [];
//       for (let i = 0; i < maxLen - seq.length; ++i) {
//         pad.push(value);
//       }
//       if (padding === 'pre') {
//         seq = pad.concat(seq);
//       } else {
//         seq = seq.concat(pad);
//       }
//     }

//     return seq;
//   });
// }

// //loader
// async function loadHostedMetadata(url) {
//     try {
//       const metadataJson = await fetch(url);
//       const metadata = await metadataJson.json();
//       return metadata;
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   async function loadHostedPretrainedModel(url) {
//     try {
//       const model = await tf.loadLayersModel(url);
//       // We can't load a model twice due to
//       // https://github.com/tensorflow/tfjs/issues/34
//       // Therefore we remove the load buttons to avoid user confusion.
//       return model;
//     } catch (err) {
//       console.error(err);
//     }
//   }

// const HOSTED_URLS = {
//     model:
//         'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json',
//     metadata:
//         'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json'
//   };
// class SentimentPredictor {
//     /**
//      * Initializes the Sentiment demo.
//      */
//     async init(urls) {
//       this.urls = urls;
//       this.model = await loadHostedPretrainedModel(urls.model);
//       await this.loadMetadata();
//       return this;
//     }
  
//     async loadMetadata() {
//       const sentimentMetadata =
//           await loadHostedMetadata(this.urls.metadata);
//       this.indexFrom = sentimentMetadata['index_from'];
//       this.maxLen = sentimentMetadata['max_len'];
//       console.log('indexFrom = ' + this.indexFrom);
//       console.log('maxLen = ' + this.maxLen);
  
//       this.wordIndex = sentimentMetadata['word_index'];
//       this.vocabularySize = sentimentMetadata['vocabulary_size'];
//       console.log('vocabularySize = ', this.vocabularySize);
//     }
  
//     predict(text) {
//       // Convert to lower case and remove all punctuations.
//       const inputText =
//           text.trim().toLowerCase().replace(/(\.|\,|\!)/g, '').split(' ');
//       // Convert the words to a sequence of word indices.
//       const sequence = inputText.map(word => {
//         let wordIndex = this.wordIndex[word] + this.indexFrom;
//         if (wordIndex > this.vocabularySize) {
//           wordIndex = OOV_INDEX;
//         }
//         return wordIndex;
//       });
//       // Perform truncation and padding.
//       const paddedSequence = padSequences([sequence], this.maxLen);
//       const input = tf.tensor2d(paddedSequence, [1, this.maxLen]);
  
//       const beginMs = performance.now();
//       const predictOut = this.model.predict(input);
//       const score = predictOut.dataSync()[0];
//       predictOut.dispose();
//       const endMs = performance.now();
  
//       return {score: score, elapsed: (endMs - beginMs)};
//     }
//   };


  
