import type { GeneratedSession } from '@/types/reading';

// 10 pre-seeded sessions for offline/demo use
export const SEEDED_SESSIONS: GeneratedSession[] = [
  {
    passage_title: "The Clever Fox",
    passage_text: "One sunny morning, a young fox named Ruby woke up feeling very hungry. She stretched her legs and trotted into the forest to find some breakfast. Ruby spotted a tall tree with delicious red apples at the top. The apples looked so yummy, but the branches were too high for her to reach. Ruby sat down and thought carefully. Then she had an idea! She found a long stick and used it to knock the apples down. The apples tumbled to the ground, and Ruby enjoyed a wonderful breakfast. She learned that thinking before acting can solve many problems.",
    passage_type: "fiction",
    primary_skill_category: "B",
    reading_level: "grade3",
    questions: [
      {
        order_index: 0,
        question_type: "mcq_main_idea",
        prompt: "What is this story mostly about?",
        choices: [
          "Foxes like to sleep in the morning",
          "Using your brain can help you solve problems",
          "Apples are the best fruit to eat",
          "Forests have many tall trees"
        ],
        correct_answer: "Using your brain can help you solve problems",
        explanation: "The story shows how Ruby solved her problem by thinking carefully and finding a creative solution with the stick.",
        hint: null,
        evidence_spans: [{ start: 345, end: 421 }]
      },
      {
        order_index: 1,
        question_type: "mcq_detail",
        prompt: "What did Ruby use to get the apples?",
        choices: [
          "A ladder",
          "A long stick",
          "Her sharp claws",
          "Another animal's help"
        ],
        correct_answer: "A long stick",
        explanation: "Ruby found a long stick and used it to knock the apples down from the tall tree.",
        hint: null,
        evidence_spans: [{ start: 265, end: 317 }]
      },
      {
        order_index: 2,
        question_type: "short_answer",
        prompt: "Why couldn't Ruby reach the apples at first?",
        choices: null,
        correct_answer: "The branches were too high for her to reach.",
        explanation: "The story tells us that the apples were at the top of a tall tree, and the branches were too high for Ruby to reach them.",
        hint: "Think about where the apples were on the tree.",
        evidence_spans: [{ start: 157, end: 218 }]
      },
      {
        order_index: 3,
        question_type: "mcq_vocab",
        prompt: "In the story, what does 'tumbled' mean?",
        choices: [
          "Flew away quickly",
          "Fell down in a rolling way",
          "Stayed in place",
          "Grew bigger"
        ],
        correct_answer: "Fell down in a rolling way",
        explanation: "When the apples 'tumbled' to the ground, they fell down and rolled after Ruby knocked them with the stick.",
        hint: null,
        evidence_spans: [{ start: 317, end: 354 }]
      }
    ]
  },
  {
    passage_title: "Amazing Honeybees",
    passage_text: "Honeybees are some of the busiest insects on Earth. They live together in large groups called colonies. Each colony has one queen bee, many worker bees, and some drone bees. The worker bees have many important jobs. They collect nectar from flowers to make honey. They also build the honeycomb where the colony lives and stores food. When a worker bee finds a good flower patch, it does a special dance to tell other bees where to go. This dance is called the waggle dance. Without honeybees, many plants could not make seeds and grow new plants. Honeybees help our world in many ways.",
    passage_type: "nonfiction",
    primary_skill_category: "C",
    reading_level: "grade3",
    questions: [
      {
        order_index: 0,
        question_type: "mcq_main_idea",
        prompt: "What is this story mostly about?",
        choices: [
          "How to make honey at home",
          "Why queens are important",
          "How honeybees live and work together",
          "The different types of flowers"
        ],
        correct_answer: "How honeybees live and work together",
        explanation: "The passage explains how honeybees live in colonies and describes the different jobs that bees do to help the colony.",
        hint: null,
        evidence_spans: [{ start: 0, end: 100 }]
      },
      {
        order_index: 1,
        question_type: "mcq_detail",
        prompt: "What is the special dance called that bees do?",
        choices: [
          "The honey dance",
          "The flower dance",
          "The waggle dance",
          "The bee boogie"
        ],
        correct_answer: "The waggle dance",
        explanation: "The passage tells us that when a bee finds flowers, it does a special dance called the waggle dance to tell other bees.",
        hint: null,
        evidence_spans: [{ start: 324, end: 405 }]
      },
      {
        order_index: 2,
        question_type: "short_answer",
        prompt: "What would happen if there were no honeybees?",
        choices: null,
        correct_answer: "Many plants could not make seeds and grow new plants.",
        explanation: "The passage explains that without honeybees, many plants could not make seeds and grow new plants because bees help spread pollen.",
        hint: "Look at the end of the passage for clues.",
        evidence_spans: [{ start: 406, end: 498 }]
      },
      {
        order_index: 3,
        question_type: "mcq_vocab",
        prompt: "In the story, what does 'nectar' mean?",
        choices: [
          "A type of leaf",
          "Sweet liquid from flowers",
          "The bee's house",
          "A kind of dance"
        ],
        correct_answer: "Sweet liquid from flowers",
        explanation: "Nectar is the sweet liquid that bees collect from flowers to make honey.",
        hint: null,
        evidence_spans: [{ start: 155, end: 200 }]
      }
    ]
  },
  {
    passage_title: "The Lost Puppy",
    passage_text: "Maya was walking home from school when she heard a small whimpering sound. She looked around and found a tiny brown puppy hiding under a bush. The puppy was shaking and looked scared. Maya gently picked up the puppy and noticed it had a collar with a phone number on it. She hurried home and asked her mom to call the number. Soon, a worried family arrived at Maya's house. A little boy named Jake jumped out of the car and hugged the puppy tightly. His family thanked Maya again and again for finding their lost pet. Maya felt warm inside knowing she had helped reunite the puppy with its family.",
    passage_type: "fiction",
    primary_skill_category: "B",
    reading_level: "grade3",
    questions: [
      {
        order_index: 0,
        question_type: "mcq_main_idea",
        prompt: "What is the main message of this story?",
        choices: [
          "Always walk home quickly from school",
          "Puppies should not go outside",
          "Helping others makes you feel good",
          "Phone numbers are important to remember"
        ],
        correct_answer: "Helping others makes you feel good",
        explanation: "The story shows that Maya felt 'warm inside' after helping return the lost puppy to its family, teaching us that helping others is rewarding.",
        hint: null,
        evidence_spans: [{ start: 486, end: 593 }]
      },
      {
        order_index: 1,
        question_type: "mcq_detail",
        prompt: "How did Maya know who owned the puppy?",
        choices: [
          "The puppy told her",
          "She recognized the puppy",
          "There was a phone number on the collar",
          "A neighbor knew the owners"
        ],
        correct_answer: "There was a phone number on the collar",
        explanation: "Maya noticed the puppy had a collar with a phone number on it, which helped her find the owners.",
        hint: null,
        evidence_spans: [{ start: 168, end: 247 }]
      },
      {
        order_index: 2,
        question_type: "short_answer",
        prompt: "How do you think Jake felt when he saw his puppy?",
        choices: null,
        correct_answer: "Jake felt very happy and relieved to see his puppy again.",
        explanation: "We can tell Jake was very happy because he 'jumped out of the car and hugged the puppy tightly.'",
        hint: "Think about what Jake did when he saw the puppy.",
        evidence_spans: [{ start: 346, end: 429 }]
      },
      {
        order_index: 3,
        question_type: "mcq_vocab",
        prompt: "What does 'whimpering' mean in the story?",
        choices: [
          "Barking loudly",
          "Making soft crying sounds",
          "Running very fast",
          "Sleeping quietly"
        ],
        correct_answer: "Making soft crying sounds",
        explanation: "Whimpering means making soft, sad crying sounds, which is what the scared puppy was doing under the bush.",
        hint: null,
        evidence_spans: [{ start: 45, end: 79 }]
      }
    ]
  },
  {
    passage_title: "The Water Cycle",
    passage_text: "Have you ever wondered where rain comes from? Water on Earth moves in a never-ending circle called the water cycle. First, the sun heats water in oceans, lakes, and rivers. This heat turns some water into an invisible gas called water vapor. The water vapor rises high into the sky. As it goes higher, the air gets colder. The cold air turns the water vapor back into tiny water droplets. These droplets join together to form clouds. When the clouds get heavy with water, the droplets fall back to Earth as rain or snow. The water flows into rivers and oceans, and the cycle starts all over again!",
    passage_type: "nonfiction",
    primary_skill_category: "D",
    reading_level: "grade3",
    questions: [
      {
        order_index: 0,
        question_type: "mcq_main_idea",
        prompt: "What is this story mainly about?",
        choices: [
          "Why oceans are so big",
          "How water moves in a cycle on Earth",
          "The best time to see rain",
          "Why clouds are white"
        ],
        correct_answer: "How water moves in a cycle on Earth",
        explanation: "The passage explains the water cycle and how water keeps moving from Earth to the sky and back again.",
        hint: null,
        evidence_spans: [{ start: 46, end: 115 }]
      },
      {
        order_index: 1,
        question_type: "mcq_detail",
        prompt: "What happens to water vapor when it rises and the air gets colder?",
        choices: [
          "It disappears forever",
          "It turns back into tiny water droplets",
          "It becomes hotter",
          "It turns into ice immediately"
        ],
        correct_answer: "It turns back into tiny water droplets",
        explanation: "The passage explains that cold air turns water vapor back into tiny water droplets, which then form clouds.",
        hint: null,
        evidence_spans: [{ start: 264, end: 355 }]
      },
      {
        order_index: 2,
        question_type: "short_answer",
        prompt: "Why is the water cycle called a 'cycle'?",
        choices: null,
        correct_answer: "Because the water keeps moving in a circle that never ends.",
        explanation: "It is called a cycle because the same water keeps moving from Earth to sky and back again, over and over, in a never-ending circle.",
        hint: "Think about what happens after rain falls.",
        evidence_spans: [{ start: 478, end: 593 }]
      },
      {
        order_index: 3,
        question_type: "mcq_vocab",
        prompt: "What is 'water vapor' in the story?",
        choices: [
          "Very cold water",
          "Water that is invisible gas",
          "Water in a cloud",
          "Water that tastes funny"
        ],
        correct_answer: "Water that is invisible gas",
        explanation: "The passage tells us that heat turns water into 'an invisible gas called water vapor.'",
        hint: null,
        evidence_spans: [{ start: 169, end: 223 }]
      }
    ]
  },
  {
    passage_title: "Sam's Science Fair",
    passage_text: "Sam spent three weeks working on his science fair project about plants and light. He grew four bean plants in different conditions. One plant got full sunlight, one got half sunlight, one stayed in shade, and one was kept in a dark closet. Sam watered all the plants the same amount each day. After two weeks, he measured each plant carefully. The plant in full sunlight grew the tallest and had bright green leaves. The plant in the dark closet barely grew at all and had yellow, droopy leaves. Sam made a colorful poster showing his results. On science fair day, many people stopped to look at his project. Sam won second place and felt proud of his hard work.",
    passage_type: "fiction",
    primary_skill_category: "D",
    reading_level: "grade3",
    questions: [
      {
        order_index: 0,
        question_type: "mcq_main_idea",
        prompt: "What is the main idea of this story?",
        choices: [
          "Science fairs are very long",
          "Plants need light to grow well",
          "Posters should be colorful",
          "Winning is the most important thing"
        ],
        correct_answer: "Plants need light to grow well",
        explanation: "Sam's experiment showed that the plant with the most sunlight grew best, proving that plants need light to grow well.",
        hint: null,
        evidence_spans: [{ start: 296, end: 418 }]
      },
      {
        order_index: 1,
        question_type: "mcq_detail",
        prompt: "How many plants did Sam grow for his project?",
        choices: [
          "Two plants",
          "Three plants",
          "Four plants",
          "Five plants"
        ],
        correct_answer: "Four plants",
        explanation: "The story says Sam grew four bean plants in different conditions for his experiment.",
        hint: null,
        evidence_spans: [{ start: 70, end: 115 }]
      },
      {
        order_index: 2,
        question_type: "short_answer",
        prompt: "Why did Sam water all the plants the same amount?",
        choices: null,
        correct_answer: "To make sure the only difference was the amount of light each plant got.",
        explanation: "In a fair experiment, you only change one thing at a time. By watering all plants the same, Sam could be sure that light was what made the plants grow differently.",
        hint: "Think about what makes an experiment fair.",
        evidence_spans: [{ start: 216, end: 274 }]
      },
      {
        order_index: 3,
        question_type: "mcq_vocab",
        prompt: "What does 'droopy' mean when describing the leaves?",
        choices: [
          "Very tall and straight",
          "Hanging down weakly",
          "Bright and colorful",
          "Making a loud noise"
        ],
        correct_answer: "Hanging down weakly",
        explanation: "Droopy means hanging down in a sad, weak way. The plant in the dark didn't get enough light, so its leaves were weak and hanging down.",
        hint: null,
        evidence_spans: [{ start: 380, end: 418 }]
      }
    ]
  },
  {
    passage_title: "Penguins of Antarctica",
    passage_text: "Emperor penguins live in Antarctica, the coldest place on Earth. These amazing birds cannot fly, but they are excellent swimmers. They dive deep into the icy ocean to catch fish and squid. Emperor penguins are the tallest penguins in the world, growing up to four feet tall. In winter, the mother penguin lays one egg and then goes to the ocean to find food. The father penguin keeps the egg warm by balancing it on his feet and covering it with a special pouch of skin. He does not eat for over two months while he keeps the egg safe. When the chick hatches, the mother returns with food. Penguin families work together to survive in their frozen home.",
    passage_type: "nonfiction",
    primary_skill_category: "C",
    reading_level: "grade3",
    questions: [
      {
        order_index: 0,
        question_type: "mcq_main_idea",
        prompt: "What is this story mostly about?",
        choices: [
          "How to catch fish in the ocean",
          "Why Antarctica is cold",
          "How emperor penguins live and raise their young",
          "Different types of birds that can swim"
        ],
        correct_answer: "How emperor penguins live and raise their young",
        explanation: "The passage describes how emperor penguins live in Antarctica and explains how penguin parents work together to care for their eggs and chicks.",
        hint: null,
        evidence_spans: [{ start: 0, end: 66 }]
      },
      {
        order_index: 1,
        question_type: "mcq_detail",
        prompt: "How tall can emperor penguins grow?",
        choices: [
          "Up to two feet tall",
          "Up to three feet tall",
          "Up to four feet tall",
          "Up to five feet tall"
        ],
        correct_answer: "Up to four feet tall",
        explanation: "The passage states that emperor penguins are the tallest penguins, growing up to four feet tall.",
        hint: null,
        evidence_spans: [{ start: 189, end: 272 }]
      },
      {
        order_index: 2,
        question_type: "short_answer",
        prompt: "Why does the father penguin not eat for two months?",
        choices: null,
        correct_answer: "He must stay with the egg to keep it warm and cannot leave to find food.",
        explanation: "The father penguin must balance the egg on his feet and keep it warm with his skin pouch, so he cannot go to the ocean to find food.",
        hint: "Think about what the father is doing during this time.",
        evidence_spans: [{ start: 358, end: 519 }]
      },
      {
        order_index: 3,
        question_type: "mcq_vocab",
        prompt: "In the story, what does 'survive' mean?",
        choices: [
          "To have a party",
          "To stay alive and healthy",
          "To swim very fast",
          "To build a home"
        ],
        correct_answer: "To stay alive and healthy",
        explanation: "Survive means to stay alive and continue living, even in difficult conditions like the frozen Antarctic.",
        hint: null,
        evidence_spans: [{ start: 594, end: 654 }]
      }
    ]
  },
  {
    passage_title: "Grandma's Garden",
    passage_text: "Every Saturday, Lily helped her grandmother in the garden. They wore big sun hats and got their hands dirty in the soft soil. Grandma taught Lily how to plant tomato seeds in neat rows. She showed her how to pull weeds gently so the good plants could grow strong. Lily's favorite job was watering the flowers with the old green watering can. It made a lovely tinkling sound as the water sprinkled out. By summer, the garden was full of red tomatoes, orange carrots, and beautiful sunflowers. Grandma always said, 'Good things take time and care, my dear.' Lily understood this was true for gardens and for everything else in life.",
    passage_type: "fiction",
    primary_skill_category: "B",
    reading_level: "grade3",
    questions: [
      {
        order_index: 0,
        question_type: "mcq_main_idea",
        prompt: "What is the most important lesson Lily learned?",
        choices: [
          "Gardening is very hard work",
          "Good things take time and care",
          "Tomatoes are better than carrots",
          "Saturdays are the best day of the week"
        ],
        correct_answer: "Good things take time and care",
        explanation: "Grandma's saying that 'good things take time and care' is the main lesson, which Lily understood applies to gardens and life.",
        hint: null,
        evidence_spans: [{ start: 489, end: 622 }]
      },
      {
        order_index: 1,
        question_type: "mcq_detail",
        prompt: "What was Lily's favorite gardening job?",
        choices: [
          "Planting tomato seeds",
          "Pulling weeds",
          "Watering the flowers",
          "Wearing the sun hat"
        ],
        correct_answer: "Watering the flowers",
        explanation: "The story tells us that Lily's favorite job was watering the flowers with the old green watering can.",
        hint: null,
        evidence_spans: [{ start: 264, end: 340 }]
      },
      {
        order_index: 2,
        question_type: "short_answer",
        prompt: "Why did Grandma teach Lily to pull weeds?",
        choices: null,
        correct_answer: "So the good plants could grow strong without weeds taking their space and food.",
        explanation: "Grandma showed Lily how to pull weeds gently so the good plants could grow strong. Weeds take water and nutrients from the plants we want to grow.",
        hint: "Think about what happens to plants when weeds are around.",
        evidence_spans: [{ start: 184, end: 263 }]
      },
      {
        order_index: 3,
        question_type: "mcq_vocab",
        prompt: "What does 'sprinkled' mean in the story?",
        choices: [
          "Poured out in a heavy stream",
          "Fell lightly in small drops",
          "Stayed inside the can",
          "Made a very loud noise"
        ],
        correct_answer: "Fell lightly in small drops",
        explanation: "Sprinkled means the water came out gently in small drops, which is why it made a 'lovely tinkling sound.'",
        hint: null,
        evidence_spans: [{ start: 340, end: 397 }]
      }
    ]
  },
  {
    passage_title: "How Bridges Work",
    passage_text: "Bridges help people cross over rivers, valleys, and busy roads. There are many different types of bridges. Beam bridges are the simplest kind. They have a flat road on top held up by pillars on each end. Arch bridges have a curved shape underneath that helps spread out the weight of cars and trucks. Suspension bridges are the longest bridges in the world. They hang from thick cables attached to tall towers. The Golden Gate Bridge in San Francisco is a famous suspension bridge. Engineers must think carefully about how much weight a bridge will hold. They also think about wind, earthquakes, and other forces. Building a safe bridge takes smart planning and strong materials.",
    passage_type: "nonfiction",
    primary_skill_category: "D",
    reading_level: "grade3",
    questions: [
      {
        order_index: 0,
        question_type: "mcq_main_idea",
        prompt: "What is this story mainly about?",
        choices: [
          "The Golden Gate Bridge story",
          "Why rivers are hard to cross",
          "Different types of bridges and how they work",
          "How to become an engineer"
        ],
        correct_answer: "Different types of bridges and how they work",
        explanation: "The passage explains three types of bridges (beam, arch, and suspension) and what engineers think about when building them.",
        hint: null,
        evidence_spans: [{ start: 63, end: 106 }]
      },
      {
        order_index: 1,
        question_type: "mcq_detail",
        prompt: "What type of bridge is the Golden Gate Bridge?",
        choices: [
          "A beam bridge",
          "An arch bridge",
          "A suspension bridge",
          "A floating bridge"
        ],
        correct_answer: "A suspension bridge",
        explanation: "The passage says that the Golden Gate Bridge in San Francisco is a famous suspension bridge.",
        hint: null,
        evidence_spans: [{ start: 376, end: 482 }]
      },
      {
        order_index: 2,
        question_type: "short_answer",
        prompt: "Why do arch bridges have a curved shape underneath?",
        choices: null,
        correct_answer: "The curved shape helps spread out the weight of cars and trucks crossing the bridge.",
        explanation: "The arch shape helps distribute the weight more evenly, which makes the bridge stronger and able to hold more weight.",
        hint: "Look for what the passage says about the arch shape.",
        evidence_spans: [{ start: 206, end: 301 }]
      },
      {
        order_index: 3,
        question_type: "mcq_vocab",
        prompt: "What does 'suspension' mean when talking about bridges?",
        choices: [
          "Made of wood only",
          "Hanging from cables above",
          "Going under the water",
          "Moving back and forth"
        ],
        correct_answer: "Hanging from cables above",
        explanation: "Suspension means hanging from something above. Suspension bridges hang from thick cables attached to tall towers.",
        hint: null,
        evidence_spans: [{ start: 302, end: 375 }]
      }
    ]
  },
  {
    passage_title: "The Rainy Day Race",
    passage_text: "It was the day of the big running race, but dark clouds filled the sky. Soon, rain began to pour down heavily. Many kids groaned and wanted to go home. But Coach Martinez smiled and said, 'A little rain won't hurt us! Let's show what we can do!' The runners lined up at the starting line. When the whistle blew, everyone took off running. The track was slippery, and some kids fell down. But they got right back up and kept going. Emma slipped twice but never gave up. She crossed the finish line in third place, covered in mud but grinning from ear to ear. The parents cheered loudly for every single runner. It turned out to be the most memorable race of the year.",
    passage_type: "fiction",
    primary_skill_category: "A",
    reading_level: "grade3",
    questions: [
      {
        order_index: 0,
        question_type: "mcq_main_idea",
        prompt: "What is the main message of this story?",
        choices: [
          "Racing in the rain is dangerous",
          "Keep trying even when things are hard",
          "Coaches should cancel races in bad weather",
          "Winning is more important than finishing"
        ],
        correct_answer: "Keep trying even when things are hard",
        explanation: "The story shows that even though conditions were difficult and kids fell down, they got back up and finished the race. This teaches us to keep trying.",
        hint: null,
        evidence_spans: [{ start: 346, end: 397 }]
      },
      {
        order_index: 1,
        question_type: "mcq_detail",
        prompt: "How many times did Emma slip during the race?",
        choices: [
          "One time",
          "Two times",
          "Three times",
          "She didn't slip"
        ],
        correct_answer: "Two times",
        explanation: "The story tells us that Emma slipped twice but never gave up and finished third.",
        hint: null,
        evidence_spans: [{ start: 398, end: 425 }]
      },
      {
        order_index: 2,
        question_type: "short_answer",
        prompt: "Why did Coach Martinez say 'A little rain won't hurt us'?",
        choices: null,
        correct_answer: "He wanted to encourage the kids to be brave and run even though it was raining.",
        explanation: "Coach Martinez was being positive and encouraging. He wanted the kids to know they could still have a great race even in the rain.",
        hint: "Think about how the coach was feeling about the race.",
        evidence_spans: [{ start: 135, end: 212 }]
      },
      {
        order_index: 3,
        question_type: "mcq_vocab",
        prompt: "What does 'memorable' mean at the end of the story?",
        choices: [
          "Easy to forget",
          "Something you will remember for a long time",
          "Very boring and slow",
          "Happening in the morning"
        ],
        correct_answer: "Something you will remember for a long time",
        explanation: "Memorable means something special that you will remember for a long time. The rainy race was so unusual and fun that no one would forget it.",
        hint: null,
        evidence_spans: [{ start: 598, end: 663 }]
      }
    ]
  },
  {
    passage_title: "Amazing Animal Helpers",
    passage_text: "Service animals help people with disabilities do everyday tasks. Dogs are the most common service animals. Guide dogs help people who are blind walk safely through streets and buildings. Hearing dogs alert deaf people to important sounds like doorbells, alarms, and crying babies. Some dogs even help people in wheelchairs by picking up dropped items and opening doors. Miniature horses can also be service animals! They live longer than dogs and can guide people for up to thirty years. All service animals receive special training to learn their important jobs. These amazing animals make life easier and safer for the people they help.",
    passage_type: "nonfiction",
    primary_skill_category: "C",
    reading_level: "grade3",
    questions: [
      {
        order_index: 0,
        question_type: "mcq_main_idea",
        prompt: "What is this story mainly about?",
        choices: [
          "Why dogs make the best pets",
          "How horses are trained",
          "Animals that help people with disabilities",
          "The history of guide dogs"
        ],
        correct_answer: "Animals that help people with disabilities",
        explanation: "The passage explains how different animals, mainly dogs and miniature horses, are trained to help people with various disabilities.",
        hint: null,
        evidence_spans: [{ start: 0, end: 64 }]
      },
      {
        order_index: 1,
        question_type: "mcq_detail",
        prompt: "How long can miniature horses work as service animals?",
        choices: [
          "Up to ten years",
          "Up to twenty years",
          "Up to thirty years",
          "Up to forty years"
        ],
        correct_answer: "Up to thirty years",
        explanation: "The passage states that miniature horses live longer than dogs and can guide people for up to thirty years.",
        hint: null,
        evidence_spans: [{ start: 408, end: 487 }]
      },
      {
        order_index: 2,
        question_type: "short_answer",
        prompt: "What are two ways hearing dogs help deaf people?",
        choices: null,
        correct_answer: "Hearing dogs alert deaf people to sounds like doorbells, alarms, and crying babies.",
        explanation: "The passage lists several sounds that hearing dogs help with: doorbells, alarms, and crying babies.",
        hint: "Look for what hearing dogs do in the passage.",
        evidence_spans: [{ start: 187, end: 279 }]
      },
      {
        order_index: 3,
        question_type: "mcq_vocab",
        prompt: "What does 'alert' mean in this story?",
        choices: [
          "To make someone fall asleep",
          "To warn or notify someone about something",
          "To make something quieter",
          "To play a fun game"
        ],
        correct_answer: "To warn or notify someone about something",
        explanation: "Alert means to warn or let someone know about something important. Hearing dogs alert deaf people by letting them know when there are important sounds.",
        hint: null,
        evidence_spans: [{ start: 187, end: 279 }]
      }
    ]
  }
];
