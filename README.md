## Ferney
Ferney is a plant companion that talks.
![Ferney logo](https://i.imgur.com/f9XvXQh.png)

### The inspiration behind the project
The idea for this project stems from a shared interest in making plant care easier and more interactive for users. Many people struggle with knowing when to water their plants, often either overwatering or underwatering them, leading to unhealthy plants. Additionally, caring for plants can feel like a chore, so we thought, why not add a fun, interactive element to the experience? That’s how the concept of an AI plant companion was born—a bot that not only helps with plant care but also adds a conversational, playful aspect to it.

### What it does
Our project monitors soil humidity in real time using sensors. When the moisture level is either too low or too high, it triggers a water pump to either stop or start watering the plant. A built-in LED light blinks to alert the user when the water level is out of the optimal range. In addition to this, we have an AI-powered plant bot that acts as a companion to the user, providing them with real-time updates about their plant's status and even holding conversations through natural language processing.

### How we built it
The project combines hardware and software elements. The sensors are connected to an Arduino board, which measures soil humidity and controls an LED light to indicate water levels. When the soil is too dry, the Arduino triggers a water pump to hydrate the plant.
For the AI companion, we used Voiceflow to develop a chatbot that communicates with the user about the plant's status, interacts conversationally, and offers tips or updates. We also implemented front-end development to display sensor data in a user-friendly interface, connecting the Arduino and Voiceflow via APIs.

![Software Diagram](https://i.imgur.com/v3dT7w7.png)

Ferney is built around VoiceFlow, which powers most of the plant agent features including text-to-speech. The agent flows were built to facilitate interaction between the plant and the human. Additionally, the plant agent is aware of key metrics of the plant such as soil moisture and air humidity. The agent achieves this by fetching data from a sensor API that is powered by an Arduino board with sensors, which integrates directly with the plant. The user interface was built to facilitate interaction between the plant and the user by voice. This is done by extending VoiceFlow capabilities using the Whisper speech recognition model. The user interface listens to user speech, converts it to text and propagates it in text form to VoiceFlow. All together, this architecture  makes the plant "aware" of its state and enables it to "talk" to humans.

### Challenges we ran into
We initially had an idea that we add a speech to text feature on Voiceflow such that the user can speak to the chatbot. We ran into challenges trying to integrate the speech to text feature, and after multiple tries and tight deadline, we decided to scrap the idea.

### What we learned
Throughout this project, we learned a lot about integrating hardware with software, especially how to connect real-time sensor data to an AI chatbot system. We gained experience working with Arduino, sensors, water pumps, and LEDs, as well as deepening our understanding of AI development through Voiceflow. Additionally, working with APIs to connect different platforms taught us valuable lessons in web development and real-time data transmission.

### What’s next for Ferney
Moving forward, we aim to enhance the AI plant companion by training it on more diverse plant datasets, making its interactions even more informative and personalized. We also plan to improve the system by adding more sensors, such as temperature and light sensors, to provide a more holistic approach to plant care. Moreover, we're looking to refine the UI and explore machine learning algorithms to predict watering schedules based on historical data.

