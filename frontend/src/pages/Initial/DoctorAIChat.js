import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';

// Define the question types
const questionTypes = {
    YES_NO: 'yesno',
    OPEN_ENDED: 'open_ended'
};

// Updated conversation questions
let conversationStep = 0;
let userName = ''; // Variable to store the user's name
const conversationQuestions = [
    "Hi there! I'm here to help you with personalized nutrition guidance. Before we start, can I have your consent to ask a few questions about your health and lifestyle? Your privacy is our top priority.",
    "Great, thank you! Can we start with your name?",
    "Nice to meet you, {userName}! Could you please provide your age, gender, height, and weight?",
    "Thanks, {userName}. Do you have any health conditions, allergies, family medical history, or are you taking any medications or supplements that we should know about?",
    "Got it. Could you describe a typical day for you, including your work, relaxation, and physical activities? For example, when you wake up, work, exercise, and eat.",
    "What are your dietary preferences and restrictions? Do you have favorite cuisines or dishes, or any foods you definitely don't want to be recommended? Could you also describe your typical eating patterns, including meals and snacks?",
    "How do you approach meal preparation and grocery shopping? Do budget constraints affect your food choices?",
    "What are your health and nutrition goals? Are there any challenges or obstacles you're facing in achieving them?",
    "Thanks for sharing all this information, {userName}. You're doing great! Is there anything else you'd like to tell us about your health and nutrition habits?"
];

const conversationQuestionTypes = [
    questionTypes.YES_NO, // for the first question
    questionTypes.OPEN_ENDED, // for the second question
    questionTypes.OPEN_ENDED, // for the third question
    questionTypes.OPEN_ENDED, // for the fourth question
    questionTypes.OPEN_ENDED, // for the fifth question
    questionTypes.OPEN_ENDED, // for the sixth question
    questionTypes.OPEN_ENDED, // for the seventh question
    questionTypes.OPEN_ENDED // for the eighth question
];

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  position: relative;
  color: var(--white);
  background: var(--primary-color);
`;

const ChatMessage = styled.h1`
  font-size: var(--font-size-h5);
  margin-bottom: var(--spacing-large);
  font-family: var(--font-family);
`;

const SubText = styled.p`
  font-size-small-caption: 10px;
  font-weight: var(--font-light);
  margin-bottom: var(--spacing-medium);
  font-family: var(--font-family);
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  100% {
    transform: scale(1);
  }
`;

const wave = keyframes`
  0% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.5);
  100% {
    transform: scaleY(1);
  }
`;

const ListeningIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-large);
  animation: ${pulse} 1.5s infinite;
`;

const Waveform = styled.div`
  width: 80px;
  height: 10px;
  background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(204,204,204,1) 50%, rgba(255,255,255,1) 100%);
  animation: ${wave} 1s infinite;
`;

const PulsingCircle = styled.div`
  width: 50px;
  height: 50px;
  background-color: var(--white);
  border-radius: 50%;
  margin-top: 10px;
`;

const SpeakingIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-large);
  animation: ${pulse} 1.5s infinite;
`;

const EqualizerBar = styled.div`
  width: 5px;
  background-color: var(--white);
`;

const Equalizer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 50px;
  height: 25px;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid var(--white);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin-top: 10px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const MessageContainer = styled.div`
  width: 100%;
  max-width: 600px;
  height: 70vh;
  background: #f5f5f5;
  border-radius: 10px;
  padding: 10px;
  overflow-y: auto;
`;

const Message = styled.div`
  margin: 10px 0;
  padding: 10px;
  border-radius: 10px;
  background-color: ${(props) => (props.isUser ? '#e0f7fa' : '#ffffff')};
  text-align: ${(props) => (props.isUser ? 'right' : 'left')};
  color: ${(props) => (props.isUser ? '#006064' : '#000000')};
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const TypingAnimation = keyframes`
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
`;

const RollingText = styled.span`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid;
  animation: ${TypingAnimation} 2s steps(40, end) 1s 1 normal both;
`;

const AIChatScreen = () => {
  const [isListening, setIsListening] = useState(false); // Changed to false initially
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false); // New state variable
  const [messages, setMessages] = useState([]); // State for chat messages
  const [currentText, setCurrentText] = useState(''); // State for current rolling text
  const [userResponses, setUserResponses] = useState({}); // State for user responses
  const [userId, setUserId] = useState(null); // State for user ID
  const messageEndRef = useRef(null);

  // Function to fetch user ID from the appropriate source
  const fetchUserIdFromSource = () => {
    // Example: Fetching user ID from local storage
    const userId = localStorage.getItem('userId');
    console.log('Fetched userId:', userId); // Added logging
    return userId;
  };

  useEffect(() => {
    const userId = fetchUserIdFromSource();
    setUserId(userId);
    console.log('Set userId state:', userId); // Added logging
  }, []);

  const startGPTDoctorSession = async () => {
    console.log("Starting GPT Doctor Session");
    await speakQuestion(conversationQuestions[conversationStep]);
  };

  const handleStart = () => {
    setSessionStarted(true);
    startGPTDoctorSession();
  };

  useEffect(() => {
    if (sessionStarted) {
      if (isListening) {
        console.log("Listening...");
      } else if (isSpeaking) {
        console.log("Speaking...");
      }
    }
  }, [isListening, isSpeaking, sessionStarted]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const playAudio = (audioUrl) => {
    console.log("Playing audio from URL:", audioUrl);
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
    audio.onended = () => {
      console.log("Audio playback ended, recording audio...");
      setIsListening(true);
      recordAudio();
    };
  };

  const fetchTTS = async (text) => {
    try {
      console.log("Fetching TTS for text:", text);
      const response = await axios.post('https://api.openai.com/v1/audio/speech', {
        model: "tts-1",
        voice: "fable",
        input: text
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      });

      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = new Blob([response.data], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(blob);
      return { audioUrl };
    } catch (error) {
      console.error('Error in TTS functionality:', error);
      throw error;
    }
  };

  const speakQuestion = async (questionText) => {
    try {
      console.log("Speaking question:", questionText);
      setMessages((prevMessages) => [...prevMessages, { text: questionText, isUser: false }]);
      animateText(questionText);
      const { audioUrl } = await fetchTTS(questionText);
      playAudio(audioUrl);
      setIsSpeaking(true);
      setIsListening(false);
    } catch (error) {
      console.error('Error speaking question:', error);
    }
  };

  const animateText = (text) => {
    let index = 0;
    setCurrentText('');
    const intervalId = setInterval(() => {
      setCurrentText((prev) => prev + text[index]);
      index++;
      if (index >= text.length) {
        clearInterval(intervalId);
      }
    }, 50); // Adjust speed as necessary
  };

  const recordAudio = async () => {
    console.log("Starting audio recording...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = { mimeType: 'audio/webm' };
      const mediaRecorder = new MediaRecorder(stream, options);
      let audioChunks = [];
      let silenceTimer;
      let silenceStart = 0;

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        clearTimeout(silenceTimer); // Clear the timeout to prevent multiple stops
        const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
        audioChunks = [];
        console.log("Recording stopped, transcribing audio...");
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);
      analyser.fftSize = 2048;
      const bufferLength = analyser.fftSize;
      const dataArray = new Uint8Array(bufferLength);

      const detectSilence = () => {
        analyser.getByteTimeDomainData(dataArray);
        let silent = true;
        for (let i = 0; i < bufferLength; i++) {
          if (dataArray[i] > 128 + 5 || dataArray[i] < 128 - 5) {
            silent = false;
            break;
          }
        }
        if (silent) {
          if (silenceStart === 0) {
            silenceStart = Date.now();
          } else if (Date.now() - silenceStart > 2000) { // 2 seconds of silence
            mediaRecorder.stop();
          }
        } else {
          silenceStart = 0;
        }
        if (mediaRecorder.state === 'recording') {
          requestAnimationFrame(detectSilence);
        }
      };
      detectSilence();

    } catch (error) {
      console.error('Error recording audio:', error);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    try {
      console.log("Transcribing audio...");
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');
  
      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = response.data;
      console.log('Transcription result:', result);
      setMessages((prevMessages) => [...prevMessages, { text: result.text, isUser: true }]);
      processConversationStep(result.text);
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  };

  const saveResponse = (questionIndex, response) => {
    const updatedResponses = { ...userResponses };
    switch (questionIndex) {
        case 1:
            userName = extractName(response);
            updatedResponses.name = userName;
            break;
        case 2:
            updatedResponses.ageGenderHeightWeight = response;
            break;
        case 3:
            updatedResponses.healthConditions = response;
            break;
        case 4:
            updatedResponses.dailyRoutine = response;
            break;
        case 5:
            updatedResponses.dietaryPreferences = response;
            break;
        case 6:
            updatedResponses.mealPrepGrocery = response;
            break;
        case 7:
            updatedResponses.healthGoals = response;
            break;
        case 8:
            updatedResponses.additionalInfo = response;
            break;
        default:
            break;
    }
    setUserResponses(updatedResponses);
    sendResponsesToBackend(updatedResponses);
};

  const sendResponsesToBackend = async (responses) => {
    try {
        console.log('Sending responses to backend:', responses); // Added logging
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/conversation/saveResponses`, {
            userId, // Include the user ID in the request
            conversationData: responses
        });
        console.log('Responses sent successfully'); // Added logging
    } catch (error) {
        console.error('Error sending responses to backend:', error);
    }
};

  const processConversationStep = (transcriptionText) => {
    console.log("Processed transcription:", transcriptionText);
    console.log("Processing response:", transcriptionText);

    if (conversationStep < conversationQuestions.length) {
      const currentQuestionType = conversationQuestionTypes[conversationStep];

      if (currentQuestionType === questionTypes.YES_NO) {
        if (isAffirmative(transcriptionText)) {
          speakQuestion(conversationQuestions[++conversationStep].replace('{userName}', userName));
        } else if (isNegative(transcriptionText)) {
          handleNegativeResponse();
        } else {
          speakQuestion("I'm sorry, I didn't catch that. Can you please respond with a clear 'Yes' or 'No'?");
        }
      } else {
        saveResponse(conversationStep, transcriptionText);
        if (conversationStep < conversationQuestions.length - 1) {
          speakQuestion(conversationQuestions[++conversationStep].replace('{userName}', userName));
        } else {
          endConversation();
        }
      }
    } else {
      console.error('Reached an unexpected state in the conversation.');
    }
  };

  const handleNegativeResponse = () => {
    speakQuestion("I understand. If you change your mind, we can continue our conversation.");
  };

  const isAffirmative = (response) => {
    const affirmativeResponses = ['yes', 'sure', 'absolutely', 'indeed', 'of course', 'thats right', 
    'please', 'okay', 'alright', 'yep', 'yeah', 'definitely' ];
    return affirmativeResponses.some(affirmative => response.toLowerCase().includes(affirmative));
  };

  const isNegative = (response) => {
    const negativeResponses = ['no', 'not at all', 'no way', 'nah', 'nope', 'don\'t', 'never', 
    'absolutely not', 'certainly not', 'I disagree',];
    return negativeResponses.some(negative => response.toLowerCase().includes(negative));
  };

  const endConversation = () => {
    console.log("Ending conversation. Sending data to server for processing.");
    sendResponsesToBackend(userResponses);
  };

  const extractName = (response) => {
    const words = response.split(' ');
    if (words.includes('name') && words.includes('is')) {
      const nameIndex = words.indexOf('is') + 1;
      return words[nameIndex];
    }
    return response; // fallback to the whole response if not in expected format
  };

  return (
    <ChatContainer>
      <ChatMessage>Chat with AI Doctor</ChatMessage>
      <SubText>We're here to help you get started.</SubText>
      {!sessionStarted ? (
        <button onClick={handleStart}>Start Session</button>
      ) : (
        <>
          <MessageContainer>
            {messages.map((message, index) => (
              <Message key={index} isUser={message.isUser}>
                {message.text}
              </Message>
            ))}
            <div ref={messageEndRef} />
          </MessageContainer>
          {isListening && (
            <ListeningIndicator>
              <Waveform />
              <PulsingCircle />
            </ListeningIndicator>
          )}
          {isSpeaking && (
            <SpeakingIndicator>
              <Equalizer>
                <EqualizerBar />
                <EqualizerBar />
                <EqualizerBar />
                <EqualizerBar />
              </Equalizer>
              <LoadingSpinner />
            </SpeakingIndicator>
          )}
        </>
      )}
    </ChatContainer>
  );
};

export default AIChatScreen;
