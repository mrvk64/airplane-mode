// Airplane Mode kids world: Treetop Town. Same shapes as cast.js and story.js.
// The four suspects each end every post with a signature emoji (added by the engine), and Mystery Paws
// always ends with the culprit's emoji. Never type those four emoji in anyone's text by hand, except in
// the culprit-keyed clue post (s_hoot_clue), where Ms. Hoot names the emoji on purpose.
window.AM = window.AM || {};
AM.KIDS = AM.KIDS || {};

AM.KIDS.CAST = [
  // ---- the mystery --------------------------------------------------------------------------------
  { id: 'overheard', name: 'Mystery Paws', handle: 'mysterypaws', emoji: '🐾', hue: 285, followers: 0, verified: false,
    voice: 'pun', role: 'story',
    bio: "Riddles, secrets and paw prints. Can you guess who I am?",
    style: "Secret riddle account. Written by the engine in the culprit's style. Playful, kind, never mean." },
  { id: 'bramble', name: 'Bramble Bear', handle: 'bramblebakes', emoji: '🐻', hue: 25, followers: 2400, verified: false,
    voice: 'wholesome', role: 'story',
    suspect: { lower: false, emoji: '🍯', phrase: 'Warm hugs!' },
    bio: "I bake bread, buns and cakes at the Treetop Bakery. Always warm. Always crumbs.",
    style: "Big, gentle bear baker. Talks about baking, crumbs and sharing. Proper case. Says \"Warm hugs!\"" },
  { id: 'bongo', name: 'Bongo Monkey', handle: 'bongobeats', emoji: '🐒', hue: 45, followers: 1900, verified: false,
    voice: 'chaos', role: 'story',
    suspect: { lower: false, emoji: '🍌', phrase: 'Ooh ooh ah ah!' },
    bio: "Drummer. Climber. Swinger of vines. I can drum on anything (please hide your pots).",
    style: "Bouncy, silly monkey drummer. Sound words like boom, tap, bonk. Proper case. Says \"Ooh ooh ah ah!\"" },
  { id: 'hazel', name: 'Hazel Hedgehog', handle: 'hazelgrows', emoji: '🦔', hue: 95, followers: 1600, verified: false,
    voice: 'expert', role: 'story',
    suspect: { lower: false, emoji: '🍃', phrase: 'Leaf it to me!' },
    bio: "Gardener. I grow peas, beans and very big pumpkins. Ask me anything about plants.",
    style: "Helpful hedgehog gardener who loves plant facts. Proper case. Says \"Leaf it to me!\"" },
  { id: 'clover', name: 'Clover Bunny', handle: 'cloverpaints', emoji: '🐰', hue: 320, followers: 2100, verified: false,
    voice: 'artsy', role: 'story',
    suspect: { lower: false, emoji: '🥕', phrase: 'Hoppy days!' },
    bio: "Artist. I paint with my paws and sometimes my ears. Every color is my favorite color.",
    style: "Dreamy bunny painter. Talks about colors and pictures. Proper case. Says \"Hoppy days!\"" },

  // ---- Pip's first flight -------------------------------------------------------------------------
  { id: 'pip', name: 'Pip Robin', handle: 'littlepip', emoji: '🐤', hue: 60, followers: 800, verified: false,
    voice: 'wholesome', role: 'story',
    bio: "Baby robin. Small wings, big dreams. Learning to fly!",
    style: "Tiny, nervous, brave baby bird. Very short sentences. Counts flaps. Lots of exclamation marks." },
  { id: 'rosie', name: 'Rosie Robin', handle: 'rosiesings', emoji: '🐦', hue: 5, followers: 3300, verified: false,
    voice: 'artsy', role: 'story',
    bio: "Singer. Pip's mama. I sing the town awake every morning. Tweet tweet!",
    style: "Warm robin mama and morning singer. So proud of Pip. Sometimes talks in little songs." },

  // ---- side stories -------------------------------------------------------------------------------
  { id: 'ziggy', name: 'Ziggy Zebra', handle: 'ziggyzoom', emoji: '🦓', hue: 180, followers: 4100, verified: false,
    voice: 'hype', role: 'side',
    bio: "Sports fan. Relay announcer. Stripes go faster. That's science (it's not).",
    style: "Super excited zebra sports announcer. CAPS for big moments. Loves every team the same." },
  { id: 'poppy', name: 'Poppy Pig', handle: 'poppyspancakes', emoji: '🐷', hue: 345, followers: 3700, verified: false,
    voice: 'wholesome', role: 'side',
    bio: "I run Poppy's Pancake Hut. Short stacks, tall stacks, and stacks with smiley faces.",
    style: "Cheerful pig pancake chef. Pancake words (flip, batter, stack). Shares everything." },

  // ---- the rest of the feed -----------------------------------------------------------------------
  { id: 'olive', name: 'Olive Hoot', handle: 'ms_hoot', emoji: '🦉', hue: 265, followers: 5200, verified: false,
    voice: 'expert', role: 'feed',
    bio: "Teacher at Treetop School. Everyone calls me Ms. Hoot. I know a fact about everything. Hoo knew?",
    style: "Kind owl teacher. Fun facts. Says \"Hoo knew?\" and calls everyone \"class\" by accident." },
  { id: 'dottie', name: 'Dottie Duck', handle: 'treetoptimes', emoji: '🦆', hue: 200, followers: 9000, verified: true,
    voice: 'news', role: 'feed',
    bio: "Reporter for the Treetop Times. All the news that fits in a pond. Quack!",
    style: "Duck news reporter. Starts with \"TREETOP TIMES:\" or \"NEWS FLASH:\". Upbeat. Sometimes ends with Quack!" },
  { id: 'percy', name: 'Percy Penguin', handle: 'percyjokes', emoji: '🐧', hue: 215, followers: 4600, verified: false,
    voice: 'pun', role: 'feed',
    bio: "Joke teller. Ice skater. Fish fan. My jokes are cool. Literally.",
    style: "Penguin who tells jokes and riddles nonstop. Puns, knock-knock jokes. Laughs at his own jokes." },
  { id: 'rory', name: 'Rory Rex', handle: 'roryroars', emoji: '🦖', hue: 130, followers: 3900, verified: false,
    voice: 'chaos', role: 'feed',
    bio: "DINOSAUR. VOLCANO FAN. VERY LOUD. Tiny arms, big heart.",
    style: "Loud little dinosaur. ALL CAPS when excited (often). Volcano facts. Roars, but nicely." },
  { id: 'cosmo', name: 'Cosmo Cat', handle: 'cosmoinspace', emoji: '🐱', hue: 240, followers: 4800, verified: false,
    voice: 'hype', role: 'feed',
    bio: "Astronaut cat. I have been to the Moon twice. Napped there once.",
    style: "Space-loving cat astronaut. Space facts, rocket talk, cat naps. Excited and curious." }
];

AM.KIDS.STORY = {
  world: {
    name: 'Treetop Town',
    mysteryTitle: 'Who borrowed the Golden Acorn?',
    mysteryIntro: "Four friends might have borrowed it, so look closely at the emoji at the end of their posts and make your guess before the big reveal.",
    // Not plain "acorn" or "paws": the relay teams are Team Acorn and Team Pinecone, so "Go Team Acorn!"
    // should get relay replies, and "my dog has muddy paws" should get pet replies, not mystery ones.
    mysteryRx: 'golden acorn|the acorn(?!s)|mystery|mysterypaws|clue|detective|who took|borrow|suspect',
    interests: ['animals', 'food', 'art', 'jokes', 'space', 'sports', 'music', 'games', 'nature', 'science']
  },

  roles: { bramble: 'Bear baker', bongo: 'Monkey drummer', hazel: 'Hedgehog gardener', clover: 'Bunny artist' },

  // Pip speaks through the story; generic replies from Pip could jump ahead of the flying arc.
  noReply: ['overheard', 'pip'],

  welcome: [
    { who: 'olive', text: "Welcome aboard, {name}! I'm Ms. Hoot, a teacher in Treetop Town. Tap any post to see what my friends said." },
    { who: 'olive', text: "You can post words or a drawing, and you can send any of us a message. Keep your eyes open today. I have a feeling something mysterious is about to happen!" }
  ],

  // ---- what happened before you boarded ---------------------------------------------------------
  backlog: [
    { id: 'kb1', ago: 840, by: 'dottie',
      text: "TREETOP TIMES: Treetop Town turns 100! The big birthday party is by the lake. There will be music, games, cake, and the Golden Acorn on show at Town Hall. Quack!",
      replies: [
        { by: 'rory', text: "100 YEARS?! THAT IS SO OLD! I'M 7!" },
        { by: 'poppy', text: "I'll bring pancakes. Lots and lots of pancakes." }
      ] },
    { id: 'kb2', ago: 600, by: 'olive',
      text: "Class trip to Town Hall! We saw the Golden Acorn on its shelf. It's bigger than my head and it shines like the sun. Hoo knew an acorn could be so fancy?",
      replies: [ { by: 'percy', text: "Why was the acorn so proud? It was a little nut with a big future!" } ] },
    { id: 'kb3', ago: 420, by: 'clover', scene: 'sunset',
      text: "I painted the lake at sunset. I used every orange I own, plus one pink I found under the couch. Hoppy days!",
      replies: [ { by: 'rosie', text: "It looks like a song! A happy, sleepy song." } ] },
    { id: 'kb4', ago: 260, by: 'bongo', scene: 'rain',
      text: "Big rain last night! I played drums on all the puddles. Splish, splash, BOOM! Ooh ooh ah ah!",
      replies: [ { by: 'hazel', text: "My garden says thank you for the rain. My boots say no thank you." } ] },
    { id: 'kb5', ago: 90, by: 'rosie',
      text: "Somebody in our nest has been flapping since sunrise. Flap, flap, flop! Big day coming for Pip.",
      replies: [ { by: 'pip', text: "I'm not flopping, Mama. I'm landing on purpose!" } ] }
  ],

  // ---- the flight ---------------------------------------------------------------------------------
  beats: [
    // Climb
    { at: 0.02, pa: "Hello from the flight deck! We're up above the clouds now. Feel free to scroll about the cabin." },
    { at: 0.03, post: { id: 's_pip0', by: 'rosie',
      text: "Good morning, Treetop Town! Big news from our nest: Pip wants to learn to fly today, before the birthday party tonight. Flap, flap, hooray!",
      replies: [
        { by: 'bramble', text: "Go, Pip! I'll save you a tiny bun." },
        { by: 'ziggy', text: "PIP! PIP! PIP! I'm already cheering!" }
      ] } },
    { at: 0.04, post: { id: 's_gone', by: 'olive',
      text: "Hoo! Something is wrong. I went to Town Hall to dust the Golden Acorn, and its shelf is EMPTY. There's just a little paw print and a note that says \"Borrowed. Back soon.\"",
      replies: [
        { by: 'rory', text: "EMPTY?! WHO DID IT?! I'M SO SURPRISED MY TAIL IS WIGGLING!" },
        { by: 'percy', text: "Maybe it went nuts! ...Sorry. Too soon?" }
      ] } },
    { at: 0.06, post: { id: 's_stack1', by: 'poppy',
      text: "Big plan! For the birthday party I'm making the TALLEST pancake tower Treetop Town has ever seen. Goal: 100 pancakes. Let's get flipping!",
      replies: [ { by: 'cosmo', text: "100 pancakes is almost space height. I'll bring my helmet." } ] } },
    { at: 0.08, post: { id: 's_paws1', by: 'overheard',
      text: "Hello, Treetop Town! I'm Mystery Paws. I borrowed the Golden Acorn. Don't worry, it's safe and sound! I'll tell you who I am before your plane lands. Can you guess first?",
      replies: [ { by: 'dottie', text: "Quack! A real mystery! Grabbing my notebook." } ] } },
    { at: 0.10, post: { id: 's_pip1', by: 'pip',
      text: "I flapped 10 times! I went up a tiny bit. Then down a big bit. I landed on Mama's pillow. That counts!",
      replies: [
        { by: 'olive', text: "Fun fact: baby birds practice for days before they fly. Every flap counts, Pip!" },
        { by: 'poppy', text: "That totally counts! Here's a tiny pancake for a tiny pilot." }
      ] } },
    { at: 0.11, post: { id: 's_news1', by: 'dottie',
      text: "TREETOP TIMES: The Golden Acorn is missing from Town Hall! A friend called Mystery Paws says it was only borrowed. The party is tonight. Who has it? Quack!" } },
    { at: 0.13, post: { id: 's_rory1', by: 'rory',
      text: "WHO BORROWED THE GOLDEN ACORN?! THIS IS THE BIGGEST MYSTERY SINCE THE VOLCANO THAT WAS ACTUALLY A HILL!",
      replies: [
        { by: 'cosmo', text: "I checked the Moon. It's not there either." },
        { by: 'percy', text: "Detective Percy is on the case! (My magnifying glass is a fish bowl.)" }
      ] } },
    { at: 0.15, post: { id: 's_paws2', by: 'overheard',
      text: "Riddle time! I have a cap but no head. I'm gold but I'm not the sun. Right now I'm resting somewhere cozy. What am I?",
      replies: [
        { by: 'percy', text: "The Golden Acorn! I solved it! I'm a genius! (It was kind of in the question.)" },
        { by: 'olive', text: "Correct, Percy. Gold star for you." }
      ] } },
    { at: 0.17, dm: 'pip1' },
    { at: 0.19, post: { id: 's_cosmo1', by: 'cosmo',
      text: "I looked at all of Treetop Town with my space telescope. I saw the lake, the bakery and a snail on a skateboard. No Golden Acorn. Mystery!" } },

    // The four suspects post (each one shows their emoji and their catchphrase)
    { at: 0.205, post: { id: 's_bramble1', by: 'bramble', scene: 'bread',
      text: "Everyone keeps asking me about the acorn. I've been at the bakery since sunrise! Fresh rolls are out of the oven. Come get one. Warm hugs!" } },
    { at: 0.22, post: { id: 's_bongo1', by: 'bongo',
      text: "Was it me? Nope! I was drumming on a log all morning. Boom, tap, boom! Ooh ooh ah ah!",
      replies: [ { by: 'rory', text: "I HEARD IT! I DANCED! I FELL OVER! IT WAS GREAT!" } ] } },
    { at: 0.235, post: { id: 's_hazel1', by: 'hazel', scene: 'plant',
      text: "Not me! I've been pulling weeds in my garden all day. Fun fact: some sunflowers grow taller than a basketball hoop! Need help looking for the acorn? Leaf it to me!" } },
    { at: 0.25, post: { id: 's_clover1', by: 'clover', scene: 'flowers',
      text: "I didn't take it! I've been painting all day. I have blue paint on my nose and green paint on my ears. Hoppy days!" } },

    { at: 0.27, post: { id: 's_stack2', by: 'poppy',
      text: "Pancake tower update: 25 pancakes! It's taller than me now. Rory helped by holding the plate with his tiny arms. It was a very tiny plate.",
      replies: [ { by: 'rory', text: "BEST JOB I EVER HAD." } ] } },
    { at: 0.29, post: { id: 's_news2', by: 'dottie',
      text: "TREETOP TIMES: The whole town is playing detective! Four friends were near Town Hall this week: Bramble, Bongo, Hazel and Clover. They all say \"Not me!\" Who do you think it is?" } },
    { at: 0.31, post: { id: 's_pip2', by: 'pip', scene: 'park',
      text: "Practice! I hopped off the low branch and flapped and flapped. I flew for ONE WHOLE SECOND! Then I sat in a puddle. It was a nice puddle.",
      replies: [
        { by: 'ziggy', text: "ONE WHOLE SECOND! That's a new record! The crowd goes wild!" },
        { by: 'rosie', text: "Proudest mama in the whole forest. Also, bath time." }
      ] } },
    { at: 0.33, post: { id: 's_paws3', by: 'overheard',
      text: "Riddle #2: What has a trunk but never packs for a trip? A tree! And here's a free clue, detectives: I always end my notes the same way.",
      replies: [ { by: 'percy', text: "An elephant! No wait. A tree. I knew that. Penguins don't have many trees." } ] } },
    { at: 0.355, pa: "We might feel a few bumps. Please stay in your seat and hold on to your snacks!", shake: true },
    { at: 0.37, post: { id: 's_rory2', by: 'rory',
      text: "VOLCANO FACT: Some volcanoes are under the sea! I asked Mystery Paws if the acorn is in a volcano. No answer. SUSPICIOUS." } },

    // The Treetop Relay
    { at: 0.40, post: { id: 's_relay0', by: 'ziggy', scene: 'park', pollId: 'game',
      text: "TODAY: The Treetop Relay! Team Acorn vs Team Pinecone, four laps around the lake. Team Acorn has Tilly Tortoise. Team Pinecone has Fern Fox, the fastest tail in town. Who will win?",
      poll: ['Team Acorn', 'Team Pinecone'] } },
    { at: 0.42, post: { id: 's_stack3', by: 'poppy',
      text: "Pancake tower: 50 pancakes! It's leaning a little, like a sleepy giraffe. Cosmo is holding the ladder. He says it's just like a rocket launch.",
      replies: [ { by: 'cosmo', text: "3... 2... 1... PANCAKE! (Nobody move.)" } ] } },
    { at: 0.44, post: { id: 's_pip_nap', by: 'rosie',
      text: "Pip fell asleep after practice, wings out like a little blanket. Flying is hard work for tiny wings. Shh!" } },
    { at: 0.45, dm: 'paws1' },
    { at: 0.47, post: { id: 's_relay1', by: 'ziggy', live: true,
      text: "AND THEY'RE OFF! Team Acorn and Team Pinecone zoom away from the starting log. The crowd is SO loud! I can't hear myself think! (I wasn't thinking anyway.)" } },
    { at: 0.50, post: { id: 's_relay2', by: 'ziggy', live: true, variant: 'winner',
      text: {
        acorns: "Lap 1 done! Team Pinecone is just ahead. Fern Fox ran like the wind! But Team Acorn is right behind. Come on, Acorns!",
        pinecones: "Lap 1 done! Team Pinecone is in front! Fern Fox is a blur! Team Acorn dropped the baton for a second, but they picked it right back up."
      } } },
    { at: 0.52, post: { id: 's_paws4', by: 'overheard',
      text: "Riddle #3: The more you take, the more you leave behind. What are they? Footsteps! Like the ones I left at Town Hall. Hee hee.",
      replies: [ { by: 'olive', text: "Class, that one is a classic. Mystery Paws knows their riddles!" } ] } },
    { at: 0.53, post: { id: 's_relay3', by: 'ziggy', live: true, variant: 'winner',
      text: {
        acorns: "HALFWAY! Team Acorn caught up! Benny Beaver swam across the pond in a flash. It's neck and neck! Stripe and stripe!",
        pinecones: "HALFWAY! So close! Team Acorn caught up for a moment, but Gus Goat hopped over the big log and Team Pinecone is ahead again!"
      } } },
    { at: 0.545, post: { id: 's_percy_relay', by: 'percy',
      text: "Why was the Treetop Relay so cool? It had so many fans! (I'm one of them. I'm flapping my flippers.)" } },
    { at: 0.55, post: { id: 's_pip3', by: 'pip',
      text: "I'm a little scared of the big flight. What if I wobble? Mama says wobbling is part of flying. Do grown-ups wobble too?",
      replies: [
        { by: 'olive', text: "Everyone wobbles when they learn something new, Pip. Even owls. Especially owls." },
        { by: 'cosmo', text: "My first rocket ride was SO wobbly. Now I nap in space. You've got this!" },
        { by: 'bramble', text: "My first cake came out flat as a pancake. Now I bake every day. Wobbles are okay. Warm hugs!" }
      ] } },
    { at: 0.565, post: { id: 's_paws_decoy', by: 'overheard',
      text: "Lots of friends think I'm {decoy2Name}. Are they right? Hee hee! I'm not telling." } },
    { at: 0.57, post: { id: 's_relay4', by: 'ziggy', live: true, variant: 'winner',
      text: {
        acorns: "LAST LAP! Team Acorn is ahead by one whisker! Tilly Tortoise has the baton. Slow and steady... and steady... and STEADY!",
        pinecones: "LAST LAP! Team Pinecone is ahead by one tail! Tilly Tortoise is giving it her all for Team Acorn. Slow and steady, Tilly!"
      } } },
    { at: 0.61, post: { id: 's_relay5', by: 'ziggy', scene: 'park', variant: 'winner',
      text: {
        acorns: "TEAM ACORN WINS THE TREETOP RELAY! Tilly Tortoise crossed the line by a nose! Team Pinecone ran SO fast too. Both teams did a big group hug. What a race!",
        pinecones: "TEAM PINECONE WINS THE TREETOP RELAY! Fern Fox crossed the line first! Team Acorn never gave up, and Tilly Tortoise got the biggest cheer of the day. What a race!"
      } } },
    { at: 0.615, post: { id: 's_relay6', by: 'olive', variant: 'winner',
      text: {
        acorns: "Team Pinecone made Team Acorn a \"Great Race!\" card. Team Acorn made one right back. Now everyone is sharing orange slices. Class, THAT is how good sports do it.",
        pinecones: "Team Acorn gave Team Pinecone three big cheers. Hip, hip, hooray! Then everyone shared orange slices. Class, THAT is how good sports do it."
      } } },
    { at: 0.62, dm: 'rosie1' },

    // The clues pile up
    { at: 0.63, post: { id: 's_percy_theory', by: 'percy',
      text: "I've cracked the case! Mystery Paws is {decoy2Name}! ...Probably. Maybe. Detective Percy is 40% sure.",
      replies: [ { by: 'rory', text: "I'M 100% SURE IT'S SOMEBODY!" } ] } },
    { at: 0.645, post: { id: 's_hoot_clue', by: 'olive', variant: 'culprit',
      text: {
        bramble: "Hoo! Class, I spotted a pattern. Mystery Paws ends EVERY note with the same emoji: 🍯. Every single time. Who else do we know who does that?",
        bongo: "Hoo! Class, I spotted a pattern. Mystery Paws ends EVERY note with the same emoji: 🍌. Every single time. Who else do we know who does that?",
        hazel: "Hoo! Class, I spotted a pattern. Mystery Paws ends EVERY note with the same emoji: 🍃. Every single time. Who else do we know who does that?",
        clover: "Hoo! Class, I spotted a pattern. Mystery Paws ends EVERY note with the same emoji: 🥕. Every single time. Who else do we know who does that?"
      },
      replies: [ { by: 'cosmo', text: "Patterns are like stars. Once you see them, you can't unsee them!" } ] } },
    { at: 0.66, post: { id: 's_stack4', by: 'poppy',
      text: "Pancake tower: 99 pancakes!! Just ONE more to go. I'm saving the last one for a big, fancy flip.",
      replies: [ { by: 'ziggy', text: "99! 99! The crowd is on its feet! The crowd is me!" } ] } },
    { at: 0.68, post: { id: 's_poll', by: 'dottie', pollId: 'accuse',
      text: "TREETOP TIMES POLL: Who do YOU think borrowed the Golden Acorn? Quack in your vote!",
      poll: ['Bramble (bear baker)', 'Bongo (monkey drummer)', 'Hazel (hedgehog gardener)', 'Clover (bunny artist)'] } },
    { at: 0.70, post: { id: 's_paws5', by: 'overheard',
      text: "You're getting warmer, detectives! I'll tell you who I am before you land. I promise." } },
    { at: 0.72, post: { id: 's_pip4', by: 'pip', scene: 'park',
      text: "I DID IT! I flew from our nest to Poppy's porch! That's three whole trees! My heart is going thump thump thump!",
      replies: [
        { by: 'poppy', text: "Pip landed right next to my syrup jar. Best visitor ever!" },
        { by: 'rory', text: "THREE TREES! THAT'S LIKE A HUNDRED DINOSAUR STEPS!" }
      ] } },
    { at: 0.75, post: { id: 's_stack5', by: 'poppy',
      text: "The 100th pancake! I flipped it SO high... it flew over the tower... and landed right on Rory's head.",
      replies: [
        { by: 'rory', text: "I AM A PANCAKE HAT DINOSAUR NOW. I WILL NEVER TAKE IT OFF." },
        { by: 'percy', text: "Rory, that's not a hat. That's a flap-jacket! ...For your head. I'll keep working on it." }
      ] } },
    { at: 0.78, post: { id: 's_paws6', by: 'overheard', variant: 'culprit',
      text: {
        bramble: "Almost time! The Golden Acorn is snug and safe. I can't wait for you to see it again. Warm hugs!",
        bongo: "Ooh ooh ah ah! Almost time! The Golden Acorn is safe and dry. I can't wait for you to see it again.",
        hazel: "Almost time! The Golden Acorn is safe and shiny. Who's taking good care of it? Leaf it to me!",
        clover: "Hoppy days! Almost time! The Golden Acorn is safe, and I can't wait to show you why I borrowed it."
      } } },
    { at: 0.795, post: { id: 's_percy_gun', by: 'percy',
      text: "WAIT. Read Mystery Paws' newest note again. I've heard somebody say that EXACT thing before! My flippers are flapping!" } },
    { at: 0.80, post: { id: 's_pip5', by: 'rosie',
      text: "Pip is doing wing stretches by the lake. Stretch, flap, stretch, flap. The big flight is almost here!" } },
    { at: 0.82, notify: { icon: 'mystery', text: "Mystery Paws tells all before landing! Make your guess: tap Mystery Paws and pick who you think borrowed the Golden Acorn." }, when: f => !f.accused },
    { at: 0.84, post: { id: 's_party1', by: 'cosmo', scene: 'sunset',
      text: "Party time is almost here! Lanterns are hanging all around the lake. They look like a hundred little moons." } },
    { at: 0.86, post: { id: 's_paws7', by: 'overheard',
      text: "I'll tell you who I am in a few minutes. Last chance to make your guess!" } },

    // Descent and the finale
    { at: 0.88, pa: "We're starting to fly down now. Please buckle your seatbelt, and lock in your guesses!", chime: true, phase: 'descent' },
    { at: 0.89, post: { id: 's_pip6', by: 'rosie',
      text: "Pip is on the big branch by the lake. The whole town is here. Quiet wings, everybody... here we go!" } },
    { at: 0.90, post: { id: 's_news3', by: 'dottie',
      text: "TREETOP TIMES: Mystery Paws will tell us who they are in just a few minutes! The whole town is waiting by Town Hall. Quack!" } },
    { at: 0.92, reveal: true, post: { id: 's_unmask', by: 'overheard', variant: 'culprit',
      text: {
        bramble: "It's me, Bramble! I borrowed the Golden Acorn so I could bake a giant cake that looks just like it, for Treetop Town's 100th birthday! The acorn is back on its shelf. Cake for everyone! Warm hugs!",
        bongo: "Ooh ooh ah ah! It's me, Bongo! The Town Hall roof had a drip right over the Golden Acorn. Drip, drip, drip! I kept it dry in my treehouse and fixed the roof. I made the riddles so the waiting would be fun!",
        hazel: "It's me, Hazel! The Golden Acorn was dusty and dull, so I polished it with soft leaves all day long. Now it shines like the sun, just in time for the birthday party. Leaf it to me!",
        clover: "Hoppy days! It's me, Clover! I borrowed the Golden Acorn so I could paint it on a giant birthday mural at Town Hall. Go and look! It's the biggest painting I've ever made."
      } } },
    { at: 0.925, post: { id: 's_news4', by: 'dottie',
      text: "NEWS FLASH: It was {culprit}! @{culpritHandle} borrowed the Golden Acorn for a sweet surprise. Nobody is in trouble, and the acorn is back home. Hooray!" } },
    { at: 0.93, post: { id: 's_called', by: 'dottie', when: (f, ctx) => ctx.correct,
      text: "Super detective alert! @{handle}, a passenger on a plane, figured out it was {culprit} {calledAgo} before the reveal. Gold stars all around!" } },
    { at: 0.932, post: { id: 's_percy_end', by: 'percy',
      text: "I KNEW it was {culprit}! (I did not know. I guessed everybody. Twice. But I'm still happy!)" } },
    { at: 0.94, post: { id: 's_acorn_home', by: 'olive', variant: 'culprit',
      text: {
        bramble: "The Golden Acorn is back on its shelf, and next to it is a giant golden acorn CAKE. Thank you, Bramble! Hoo knew a mystery could taste so good?",
        bongo: "The Golden Acorn is back on its shelf, dry and shiny, under a brand new roof. Thank you, Bongo! No more drips at Town Hall.",
        hazel: "The Golden Acorn is back on its shelf, and it shines so bright we all need sunglasses. Thank you, Hazel!",
        clover: "The Golden Acorn is back on its shelf, and right outside is Clover's giant birthday mural. It's beautiful! Thank you, Clover!"
      } } },

    // Pip's first flight: four happy endings, from two choices (a flying tip for Pip, a cheer through Rosie)
    { at: 0.95, post: { id: 's_end_pip', by: 'pip', scene: 'sunset', variant: 'ending',
      text: {
        soar: "I FLEW! All the way across the lake! I remembered your tip, and I heard your cheer. Then I did a LOOP! Thank you, @{handle}!",
        tip: "I FLEW! All the way across the lake! I was a little wobbly, but I remembered your tip, @{handle}. It worked! I'm a flying bird now!",
        cheer: "I FLEW! All the way across the lake! Mama read me your cheer, @{handle}, and it made me brave. I'm a flying bird now!",
        halfway: "I FLEW! Halfway across the lake, all by myself! I rested on the big rock in the middle. Halfway is SO far! Tomorrow, the whole lake!"
      } } },
    { at: 0.955, post: { id: 's_end_rosie', by: 'rosie', variant: 'ending',
      text: {
        soar: "My little Pip flew across the whole lake, did a loop, and landed by the birthday cake table. The whole town sang! Thank you, @{handle}, for helping Pip soar.",
        tip: "Pip flew across the whole lake today! A wobble here, a wiggle there, then a perfect landing. Thank you for the flying tip, @{handle}!",
        cheer: "Pip flew across the whole lake today! I read your cheer out loud, @{handle}, and the whole town cheered with me. Tweet tweet hooray!",
        halfway: "Pip flew all the way to the big rock in the middle of the lake today! Small wings, big flight. I sang the happiest song I know."
      } } },
    { at: 0.96, post: { id: 's_stack6', by: 'poppy',
      text: "Party report: the pancake tower made it! 99 pancakes on the tower, plus 1 that Rory wore as a hat. We shared every single one. Happy 100th birthday, Treetop Town!" } },
    { at: 0.975, pa: "Welcome to {to}! Please stay in your seat until the seatbelt light turns off. Thanks for flying with Treetop Town!", chime: true }
  ],

  // ---- direct messages with choices ---------------------------------------------------------------
  // Each DM delivers `messages`, then offers `choices`. A choice can reply, set flags and offer `next`.
  dms: {
    pip1: { with: 'pip',
      messages: ["Hi! I'm Pip. I'm a baby robin.", "I want to fly before the big party tonight. But my wings feel wobbly.", "Do you have a flying tip for me?"],
      choices: [
        { label: "Take a big breath first", set: { tip: 'breathe' },
          reply: ["In... and out. In... and out.", "Oh! My wings feel less wobbly already!", "Will you watch my big flight later?"],
          next: [
            { label: "Pinky promise!", set: { promised: true }, reply: ["Yay! I don't have pinkies. But I promise with my whole wing!"] },
            { label: "I'll try!", reply: ["Okay! I'll flap extra hard, just in case you're looking."] }
          ] },
        { label: "Start with tiny hops", set: { tip: 'hops' },
          reply: ["Hop. Hop. Hop! I can do tiny!", "Tiny hops, then bigger hops. Got it!", "Will you watch my big flight later?"],
          next: [
            { label: "Pinky promise!", set: { promised: true }, reply: ["Yay! I don't have pinkies. But I promise with my whole wing!"] },
            { label: "I'll try!", reply: ["Okay! I'll flap extra hard, just in case you're looking."] }
          ] },
        { label: "Flap, flap, then glide", set: { tip: 'glide' },
          reply: ["Flap, flap, glide. Flap, flap, glide!", "I'm going to say it all day long!", "Will you watch my big flight later?"],
          next: [
            { label: "Pinky promise!", set: { promised: true }, reply: ["Yay! I don't have pinkies. But I promise with my whole wing!"] },
            { label: "I'll try!", reply: ["Okay! I'll flap extra hard, just in case you're looking."] }
          ] }
      ] },

    paws1: { with: 'overheard',
      messages: ["Psst! Hello, detective. It's me, Mystery Paws.", "I made a riddle just for you. What has a head and a tail, but no body?"],
      choices: [
        { label: "A coin!", set: { riddle: true }, reply: ["Correct! You're a super detective.", "Here's a secret clue: look at the very end of my notes."] },
        { label: "A snake?", reply: ["Hee hee, good guess! But snakes have bodies. The answer is a coin!", "Here's a secret clue anyway: look at the very end of my notes."] },
        { label: "Who are you?!", reply: ["Nice try! I'll tell you before you land.", "Here's a clue: look at the very end of my notes."] }
      ] },

    rosie1: { with: 'rosie',
      messages: ["Hi {name}! It's Rosie, Pip's mama.", "Pip has been practicing all day. The big flight across the lake is just before you land!", "Would you send Pip a cheer? I'll read it out loud from the treetop."],
      variants: [
        { when: f => !!f.tip, messages: ["Hi {name}! It's Rosie, Pip's mama.", "Pip keeps saying your flying tip over and over. Thank you!", "The big flight across the lake is just before you land. Would you send Pip a cheer? I'll read it out loud from the treetop."] },
        { when: f => !!f.promised, messages: ["Hi {name}! It's Rosie, Pip's mama.", "Pip told me you pinky promised to watch the big flight. Pip is SO happy!", "It's just before you land. Would you send Pip a cheer? I'll read it out loud from the treetop."] }
      ],
      choices: [
        { label: "GO, PIP, GO!", set: { cheered: true }, reply: ["GO, PIP, GO! I'll shout it so loud the whole lake hears!", "Thank you, {name}. Tweet tweet!"] },
        { label: "You can do it, Pip!", set: { cheered: true }, reply: ["I'll sing it as a song! You can do it, Pip, la la la!", "Thank you, {name}. Tweet tweet!"] },
        { label: "It's okay to wobble!", set: { cheered: true }, reply: ["Oh, Pip will love that. Wobbles are part of flying!", "Thank you, {name}. Tweet tweet!"] }
      ] }
  },

  game: { teams: ['acorns', 'pinecones'], names: { acorns: 'Team Acorn', pinecones: 'Team Pinecone' }, closesAt: 0.47, post: 's_relay5' },

  // Every ending is happy. A flying tip (pip1) and a cheer (rosie1) make it extra special.
  endingKey: f => (f.tip && f.cheered ? 'soar' : f.tip ? 'tip' : f.cheered ? 'cheer' : 'halfway'),
  endings: {
    soar: { title: 'Pip soared!', blurb: 'You gave Pip a flying tip and sent a big cheer. Pip flew across the whole lake and did a loop!' },
    tip: { title: 'Pip used your tip', blurb: 'Your flying tip helped Pip fly across the lake. Wobbly, brave and proud!' },
    cheer: { title: 'Pip heard your cheer', blurb: 'Your cheer made Pip brave enough to fly across the whole lake.' },
    halfway: { title: 'Pip made it halfway!', blurb: 'Pip flew all alone to the big rock in the middle of the lake. Tomorrow, the whole lake!' }
  },
  endingLabel: "Pip's first flight",

  // The engine adds its own relay chip (from f.gamePick) just before the last chip, so this returns at
  // most 3 chips and leaves the game out. "Pip learned to fly" stays last.
  recapChips: f => {
    const c = [];
    if (f.tip) c.push({ breathe: 'Taught Pip big breaths', hops: 'Taught Pip tiny hops', glide: 'Taught Pip flap, flap, glide' }[f.tip] || 'Gave Pip a flying tip');
    if (f.cheered) c.push('Sent Pip a big cheer');
    if (f.riddle) c.push('Solved a Mystery Paws riddle');
    if (f.promised) c.push('Pinky-promised Pip');
    const out = c.slice(0, 2);
    if (!out.length) out.push('Treetop Town turned 100');
    out.push('Pip learned to fly');
    return out;
  },

  // How each suspect answers when you ask them about the mystery (styled by the engine, so these are clues too).
  suspectDm: {
    bramble: ["Me? I've been up to my ears in flour all day! Warm hugs!", "I'm a baker, not a borrower. Want a cookie while you think?", "Mystery Paws sounds very kind. I hope the acorn is cozy."],
    bongo: ["Ooh ooh ah ah! Not me! I was drumming. Boom, tap, boom!", "I can't keep a secret. I'd drum it out! Bonk, bonk, bonk!", "If I had the acorn, I'd tell everyone. Probably. Maybe!"],
    hazel: ["Not me! I've been weeding all day. Look at my muddy paws!", "Fun fact: real acorns can grow into giant oak trees. Golden ones just sit on shelves.", "Want help solving it? Leaf it to me!"],
    clover: ["Me? I've been painting since breakfast! Hoppy days!", "If I took it, I'd paint a picture of it. Hmm. That's a nice idea.", "Look at my paws. Paint, not gold! See?"]
  },

  // Mystery Paws in DMs, before and after the reveal, and on the player's mystery posts.
  overheardDm: ["Hee hee! I can't tell you yet.", "Nice try, detective!", "Here's a hint: read my notes all the way to the very end.", "The Golden Acorn is safe. Pinky promise!", "I'll tell you who I am before you land. Keep guessing!"],
  overheardRetired: ["You know who I am now! Thanks for playing detective.", "The Golden Acorn is home. Mystery solved!", "No more riddles today. Okay, one more: what has words but never talks? A book!"],
  overheardReplies: ["Ooh, a detective! Hee hee.", "Getting warmer!", "Good thinking! Keep looking.", "Hmm, interesting guess!", "Look closely. Clues are everywhere!"],

  // Trending topics, switched on by progress and choices.
  trends: [
    { tag: 'WhoHasTheAcorn', from: 0.04, to: 0.93, base: 300, grow: 9000 },
    { tag: 'MysteryPaws', from: 0.08, to: 0.92, base: 200, grow: 6000 },
    { tag: 'ItWas{culprit}', from: 0.925, base: 8000, grow: 12000 },
    { tag: 'GoPip', from: 0.03, to: 0.95, base: 150, grow: 7000 },
    { tag: 'PipCheerSquad', from: 0.63, to: 0.95, base: 400, grow: 3000, when: f => !!f.cheered },
    { tag: 'PipFlew', from: 0.95, base: 9000, grow: 15000 },
    { tag: 'TreetopRelay', from: 0.40, to: 0.70, base: 900, grow: 6000 },
    { tag: 'PancakeTower', from: 0.06, base: 100, grow: 4000 },
    { tag: 'Treetop100', from: 0, base: 1200, grow: 5000 },
    { tag: 'JokeOfTheDay', from: 0, base: 600, grow: 1500 },
    { tag: 'VolcanoFacts', from: 0, base: 400, grow: 1200 },
    { tag: 'SnackAttack', from: 0, base: 500, grow: 1500 }
  ],
  trendQ: {
    WhoHasTheAcorn: 'golden acorn|mysterypaws',
    MysteryPaws: 'mystery paws|mysterypaws',
    'ItWas{culprit}': 'golden acorn|mysterypaws',
    GoPip: 'pip',
    PipCheerSquad: 'pip',
    PipFlew: 'pip',
    TreetopRelay: 'relay|team acorn|team pinecone',
    PancakeTower: 'pancake',
    Treetop100: 'birthday|party',
    JokeOfTheDay: 'joke|why did|knock knock',
    VolcanoFacts: 'volcano',
    SnackAttack: 'snack'
  }
};
