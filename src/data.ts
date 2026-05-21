import { Document, VivaQuestion } from './types';

export const PRELOADED_BOOKS: Document[] = [
  {
    id: 'sherlock_holmes',
    title: 'The Adventures of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    category: 'Mystery / Detective fiction',
    pageCount: 164,
    fileSize: '1.2 MB',
    createdAt: 'Classic Book',
    isPreloaded: true,
    summary: 'A collection of twelve short stories featuring Arthur Conan Doyle\'s famous consulting detective, Sherlock Holmes, who uses keen observation and logical deductive reasoning to solve intricate mysteries in Victorian London.',
    content: `A Scandal in Bohemia
    To Sherlock Holmes she is always THE woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex. It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind. He was, I take it, the most perfect reasoning and observing machine that the world has seen, but as a lover he would have placed himself in a false position. He never spoke of the softer passions, save with a gibe and a sneer. They were admirable things for the observer—excellent for drawing the veil from men's motives and actions. But for the trained reasoner to admit such intrusions into his own delicate and finely adjusted temperament was to introduce a distracting factor which might throw a doubt upon all his mental results.

    The Red-Headed League
    I had called upon my friend, Mr. Sherlock Holmes, one day in the autumn of last year and found him in earnest conversation with a very stout, florid-faced, elderly gentleman with fiery red hair. With an apology for my intrusion, I was about to withdraw when Holmes pulled me abruptly into the room and closed the door behind me.
    "You could not possibly have come at a better time, my dear Watson," he said cordially.
    "I was afraid that you were engaged."
    "So I am. Very much so."
    "Then I can wait in the next room."
    "Not at all. This gentleman, Mr. Jabez Wilson, has been my partner and helper in many of my most successful cases, and I declare that your presence is invaluable. It is of the first importance that I should hear every word of your story."

    The Boscombe Valley Mystery
    We were seated at breakfast one morning, my wife and I, when the maid brought in a telegram. It was from Sherlock Holmes and ran in this way:
    "Have you a couple of days to spare? Have just been wired for from the west of England in connection with Boscombe Valley tragedy. Shall be glad if you will come with me. Air and scenery perfect. Leave Paddington by the 11:15."
    "What do you say, dear?" said my wife, looking across at me. "Will you go?"
    "I really don't know what to say. I have a fairly long list at present."
    "Oh, Anstruther would do your work for you. You have been looking pale lately, and a change of air will do you good. Besides, you are always so deeply interested in Mr. Sherlock Holmes' cases."`,
    chapters: [
      {
        title: 'Chapter 1: A Scandal in Bohemia',
        excerpt: 'Sherlock Holmes is hired by the King of Bohemia to retrieve an incriminating photograph of himself and Irene Adler, an opera singer of exceptional intellect.',
        page: 1
      },
      {
        title: 'Chapter 2: The Red-Headed League',
        excerpt: 'A pawnbroker named Jabez Wilson gets a lucrative but bizarre job writing the Encyclopaedia Britannica, only to find the league suddenly dissolved.',
        page: 25
      },
      {
        title: 'Chapter 3: The Boscombe Valley Mystery',
        excerpt: 'Holmes and Watson travel to Herefordshire to investigate the murder of a landowner, where the victim\'s son stands accused but claims innocence.',
        page: 48
      }
    ]
  },
  {
    id: 'art_of_war',
    title: 'The Art of War',
    author: 'Sun Tzu',
    category: 'Military Philosophy / Strategy',
    pageCount: 82,
    fileSize: '450 KB',
    createdAt: 'Classic Book',
    isPreloaded: true,
    summary: 'An ancient Chinese military treatise dating from the Late Spring and Autumn Period. The work, which is attributed to the ancient Chinese military strategist Sun Tzu, is composed of 13 chapters, each devoted to an aspect of warfare.',
    content: `Laying Plans
    Sun Tzu said: The art of war is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected.
    The art of war, then, is governed by five constant factors, to be taken into account in one's deliberations, when seeking to determine the conditions obtaining in the field. These are: The Moral Law; Heaven; Earth; The Commander; Method and discipline.
    All warfare is based on deception. Hence, when able to attack, we must seem unable; when using our forces, we must seem inactive; when we are near, we must make the enemy believe we are far away; when far away, we must make him believe we are near.

    Waging War
    Sun Tzu said: In the operations of war, where there are in the field a thousand swift chariots, as many heavy chariots, and a hundred thousand mail-clad soldiers, with provisions enough to carry them a thousand li, the expenditure at home and at the front, including entertainment of guests, small items such as glue and paint, and sums spent on chariots and armor, will reach the total of a thousand ounces of silver per day. Such is the cost of raising an army of 100,000 men.
    When you engage in actual fighting, if victory is long in coming, then men's weapons will grow dull and their ardor will be damped. If you lay siege to a town, you will exhaust your strength.

    Attack by Stratagem
    Sun Tzu said: In the practical art of war, the best thing of all is to take the enemy's country whole and intact; to shatter and destroy it is not so good. So, too, it is better to recapture an army entire than to destroy it, to capture a regiment, a detachment or a company entire than to destroy them.
    Hence to fight and conquer in all your battles is not supreme excellence; supreme excellence consists in breaking the enemy's resistance without fighting.`,
    chapters: [
      {
        title: 'Chapter I: Laying Plans',
        excerpt: 'Explores the five core variables (Moral Law, Heaven, Earth, The Commander, Method) and the philosophy that all warfare is based on deception.',
        page: 1
      },
      {
        title: 'Chapter II: Waging War',
        excerpt: 'Discusses the economics of warfare and the crucial directive that campaigns must be concluded rapidly to avoid bankrupting the state.',
        page: 12
      },
      {
        title: 'Chapter III: Attack by Stratagem',
        excerpt: 'Covers the strategy of winning without conflict, stating that supreme excellence is breaking the enemy\'s resistance without fighting.',
        page: 22
      }
    ]
  },
  {
    id: 'frankenstein',
    title: 'Frankenstein',
    author: 'Mary Shelley',
    category: 'Gothic / Science Fiction',
    pageCount: 220,
    fileSize: '1.8 MB',
    createdAt: 'Classic Book',
    isPreloaded: true,
    summary: 'A classic gothic science fiction novel telling the story of Victor Frankenstein, a young scientist who creates a sapient creature in an unorthodox scientific experiment, and the tragic consequences of his ambition.',
    content: `Letter 1
    To Mrs. Saville, England. St. Petersburgh, Dec. 11th, 17—.
    You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.
    I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight.
    
    Chapter 1
    I am by birth a Genevese, and my family is one of the most distinguished of that republic. My ancestors had been for many years counsellors and syndics; and my father had filled several public situations with honor and reputation. He was respected by all who knew him for his integrity and indefatigable attention to public business. 
    He passed his younger days perpetually occupied by the affairs of his country; a variety of circumstances had prevented his marrying early, nor was it until the decline of life that he became a husband and the father of a family.

    Chapter 2
    We were brought up together; there was not quite a year difference in our ages. I need not say that we were strangers to any species of disunion or dispute. Harmony was the soul of our companionship, and the diversity and contrast that subsisted in our characters drew us nearer together. Elizabeth was of a calmer and more concentrated disposition; but, with all my ardour, I was capable of more intense application and was more deeply smitten with the thirst for knowledge. She busied herself with following the aerial creations of the poets; and in the majestic and wondrous scenes which surrounded our Swiss home.`,
    chapters: [
      {
        title: 'Opening Letters',
        excerpt: 'Robert Walton writes to his sister, detailing his arctic voyage and expressing his dreams of making a grand discovery at the North Pole.',
        page: 1
      },
      {
        title: 'Chapter I: My Family Origin',
        excerpt: 'Victor Frankenstein describes his noble Genevese upbringing, his parents\' deep affection, and the adoption of the beautiful Elizabeth Lavenza.',
        page: 15
      },
      {
        title: 'Chapter II: The Thirst for Knowledge',
        excerpt: 'Victor reveals his early obsession with natural philosophy, alchemy, and the secrets of heaven and earth, laying the groundwork for his experiment.',
        page: 30
      }
    ]
  },
  {
    id: 'alices_adventures',
    title: 'Alice\'s Adventures in Wonderland',
    author: 'Lewis Carroll',
    category: 'Children\'s Fantasy / Nonsense Literature',
    pageCount: 98,
    fileSize: '780 KB',
    createdAt: 'Classic Book',
    isPreloaded: true,
    summary: 'An 1865 English novel telling the story of a young girl named Alice, who falls through a rabbit hole into a subterranean fantasy world populated by peculiar, anthropomorphic creatures.',
    content: `Down the Rabbit-Hole
    Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, "and what is the use of a book," thought Alice "without pictures or conversations?"
    So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid) whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.
    There was nothing so VERY remarkable in that; nor did Alice think it so VERY much out of the way to hear the Rabbit say to itself, "Oh dear! Oh dear! I shall be too late!"
    But when the Rabbit actually TOOK A WATCH OUT OF ITS WAISTCOAT-POCKET, and looked at it, and then hurried on, Alice started to her feet.

    The Pool of Tears
    "Curiouser and curiouser!" cried Alice (she was so much surprised that for the moment she quite forgot how to speak good English); "now I’m opening out like the largest telescope that ever was! Good-bye, feet!" (for when she looked down at her feet, they seemed to be almost out of sight, they were getting so far off). "Oh, my poor little feet, I wonder who will put on your shoes and stockings for you now, dears?"

    A Mad Tea-Party
    There was a table set out under a tree in front of the house, and the March Hare and the Hatter were having tea at it: a Dormouse was sitting between them, fast asleep, and the other two were using it as a cushion, resting their elbows on it, and talking over its head. "Very uncomfortable for the Dormouse," thought Alice; "only, as it’s asleep, I suppose it doesn’t mind."
    The table was a large one, but the three were all crowded together at one corner of it: "No room! No room!" they cried out when they saw Alice coming. "There’s PLENTY of room!" said Alice indignantly, and she sat down in a large arm-chair at one end of the table.`,
    chapters: [
      {
        title: 'Chapter 1: Down the Rabbit-Hole',
        excerpt: 'Alice falls down a deep rabbit hole and finds herself in a mysterious hall with a tiny golden key, leading to a beautiful locked garden.',
        page: 1
      },
      {
        title: 'Chapter 2: The Pool of Tears',
        excerpt: 'Alice grows extraordinarily tall and cries a pool of giant tears, then shrinks back and must swim to shore with a mouse and other creatures.',
        page: 14
      },
      {
        title: 'Chapter 7: A Mad Tea-Party',
        excerpt: 'Alice encounters the March Hare, the Hatter, and the sleepy Dormouse, engaging in a series of nonsensical riddles and endless afternoon tea.',
        page: 60
      }
    ]
  }
];

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 'q1',
    question: 'What is Retrieval-Augmented Generation (RAG) in AI Document Systems?',
    options: [
      'A method to generate random fictional stories from scratch.',
      'A technique where an LLM retrieves relevant facts from a custom document database to answer users queries accurately.',
      'A way to convert PDF books into physical paper versions automatically.',
      'A programming framework used solely for editing text styles inside websites.'
    ],
    correctAnswer: 'A technique where an LLM retrieves relevant facts from a custom document database to answer users queries accurately.',
    explanation: 'RAG or Retrieval-Augmented Generation bridges the gap between static LLM knowledge and specific external documents (like your textbook) by finding relevant paragraphs and feeding them as context before generating the answer.'
  },
  {
    id: 'q2',
    question: 'Why do we need to split large books/documents into "chunks" before embedding?',
    options: [
      'Because LLMs have limited context windows and processing a 500-page book in a single prompt is slow and expensive.',
      'To prevent the PDF from being copyrighted by search engines.',
      'To color-code different paragraphs dynamically.',
      'Because computers can only read documents that are less than 10 words long.'
    ],
    correctAnswer: 'Because LLMs have limited context windows and processing a 500-page book in a single prompt is slow and expensive.',
    explanation: 'Splitting documents into smaller (e.g., 500-1000 characters) chunks with overlaps ensures that we can retrieve the exact matching paragraphs instead of saturating the AI model with the entire book.'
  },
  {
    id: 'q3',
    question: 'What is a Vector Database (like FAISS)?',
    options: [
      'A standard relational database like MySQL used for storing user credentials.',
      'A specialized store that indexes high-dimensional vectors (embeddings) to perform high-speed mathematical similarity searches.',
      'A python compiler that translates Streamlit code into C++ script.',
      'An online cloud drive for hosting large photos and videos.'
    ],
    correctAnswer: 'A specialized store that indexes high-dimensional vectors (embeddings) to perform high-speed mathematical similarity searches.',
    explanation: 'Vector databases index the semantic vectors representing text chunks. This allows finding semantically related passages using mathematical calculations (like Cosine Similarity) in milliseconds.'
  },
  {
    id: 'q4',
    question: 'What does an "Embedding Model" do in this Book Brain project?',
    options: [
      'It uploads the files directly to the server.',
      'It converts text data into a series of real numbers (vector) representing the semantic meaning of that text.',
      'It translates the document from Hindi into English dynamically.',
      'It is an editor for making books look pretty with fonts.'
    ],
    correctAnswer: 'It converts text data into a series of real numbers (vector) representing the semantic meaning of that text.',
    explanation: 'Embedding models map words to low-dimensional space. Words or sentences with similar thematic meanings are mapped near each other, allowing similarity searches.'
  }
];
