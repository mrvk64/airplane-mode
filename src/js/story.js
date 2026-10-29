// Airplane Mode: the scripted storyline, paced to the length of the flight.
// `at` is the fraction of the flight (0 = takeoff, 1 = landing). Backlog items use `ago` (real minutes
// before takeoff) instead. Text placeholders: {name} {handle} (the player), {culprit} {culpritHandle},
// {decoy1} {decoy1Name} {decoy2Name} (suspects who are NOT the culprit), {game} scores.
// `text` may be an object keyed by a variant (see `variant`) instead of a string.
// `when` gates an item on the player's choices (flags) and the world (ctx).
window.AM = window.AM || {};

AM.STORY = {};

// ---- what happened before you boarded ------------------------------------------------------------
AM.STORY.backlog = [
  { id: 'b1', ago: 1310, by: 'priya', scene: 'pasta', likes: 5400,
    text: "respectfully, ferri's anniversary menu is a love letter to butter and nothing else. the risotto had the texture of an apology. 6/10",
    replies: [
      { by: 'luca', text: "6/10?? That risotto is my nonna's recipe. BASTA." },
      { by: 'kai', text: "the texture of an apology 😭😭😭" },
      { by: 'moe', text: "6/10 from a critic is a 9/10 from a human being. we've all been there luca" }
    ] },
  { id: 'b2', ago: 820, by: 'luca', scene: 'restaurant', likes: 3100,
    text: "Allora. Tonight Ferri's turned 3. Thank you Harbor City for every plate, every birthday, every proposal at table 6. And thank you to the woman who still steals my breadsticks @jadeinthecity 🤍",
    replies: [
      { by: 'jade', text: "3 YEARS!! so proud of you. the breadsticks are a tax 🤍" },
      { by: 'june', text: "Happy birthday to the restaurant! I had the lasagna in March and still think about it. Love, June" }
    ] },
  { id: 'b3', ago: 700, by: 'jade', scene: 'cake', likes: 18200,
    text: "Anniversary dinner at Ferri's and he made me a dessert with my name on it in chocolate. I can't. I literally can't 🤍",
    replies: [
      { by: 'ava', text: "the way i would simply pass away" },
      { by: 'rosa', text: "GOALS!! 😭" }
    ] },
  { id: 'b4', ago: 380, by: 'dev', scene: 'rooftop', likes: 2900,
    text: "lumen last night: sold out, two proposals, one guy cried during the sunrise set. no notes",
    replies: [ { by: 'kai', text: "the guy crying was me. i'm the guy" } ] },
  { id: 'b5', ago: 260, by: 'theo', scene: 'rain', likes: 1700,
    text: "5AM. Rain. Ran anyway. Your excuses are not my problem. Let's be real." },
  { id: 'b6', ago: 150, by: 'margot', scene: 'plant', likes: 4100,
    text: "Restyled a client's living room this morning. They had eleven throw pillows. Eleven. We are down to two. Just saying." }
];

// ---- the flight ---------------------------------------------------------------------------------
AM.STORY.beats = [
  // Climb
  { at: 0.02, pa: "This is your captain speaking. We've reached cruising altitude. Feel free to scroll about the cabin." },
  { at: 0.03, post: { id: 's_biscuit1', by: 'june', scene: 'dog', likes: 640,
    text: "Has anyone seen my Biscuit? He slipped his collar at Kestrel Park this morning. Small, brown, very friendly, thinks he is a big dog. Please share!! Love, June #lostdog #biscut",
    replies: [
      { by: 'rosa', text: "Sharing!! Run club will keep an eye out on the Kestrel loop!" },
      { by: 'transit', text: "All Harbor Line drivers have been alerted. If Biscuit boards, Biscuit rides free." }
    ] } },
  { at: 0.05, post: { id: 's_oven1', by: 'greg', scene: 'bricks', likes: 210,
    text: "Day 1 of building a backyard pizza oven out of bricks I \"found\" behind the hardware store. My wife has questions. I have answers. The answers are pizza.",
    replies: [ { by: 'lena', text: "this is how every incident report I've ever read begins" } ] } },
  { at: 0.08, post: { id: 's_oh1', by: 'overheard', likes: 900,
    text: "Welcome to Overheard. Harbor City has secrets and I have receipts. The first one drops soon. DMs are open if you've got tea." } },
  { at: 0.10, post: { id: 's_kai1', by: 'kai', likes: 1300,
    text: "who is overheard and why do i feel personally threatened",
    replies: [
      { by: 'harry', text: "If you're scared, you're guilty. Simple." },
      { by: 'marcus', text: "deleting my search history just in case" }
    ] } },
  { at: 0.12, post: { id: 's_transit1', by: 'transit', likes: 2200,
    text: "To whoever runs @overheard_hc: we have nothing to hide. Except the 6:40 tram. That one's never been on time and we don't know why." } },
  { at: 0.15, post: { id: 's_oh2', by: 'overheard', likes: 7400,
    text: "Blind item: which Harbor City it-couple was arguing outside a certain Old Town trattoria last night after closing? Someone left in a cab. Someone stayed and stacked chairs for an hour.",
    replies: [
      { by: 'kai', text: "OLD TOWN TRATTORIA. there's like one" },
      { by: 'june', text: "Oh dear. I hope they are both okay. Love, June" }
    ] } },
  { at: 0.17, post: { id: 's_news1', by: 'hcnow', likes: 3300,
    text: "Anonymous gossip account @overheard_hc has gained 10,000 followers in under an hour. Who's behind it? Nobody knows, and everyone's asking." } },
  { at: 0.19, post: { id: 's_jade1', by: 'jade', likes: 21000,
    text: "people should really mind their own business. some of us are just trying to have a normal day.",
    replies: [
      { by: 'ava', text: "jade who do we need to fight" },
      { by: 'wren', text: "Sending you soft things today." }
    ] } },

  // Everyone denies it (each denial shows how that suspect writes)
  { at: 0.205, post: { id: 's_dev1', by: 'dev', likes: 2100,
    text: "everyone in my mentions asking if i'm overheard. i'm a dj. i can barely run my own account. that blind item though... no notes" } },
  { at: 0.22, post: { id: 's_priya1', by: 'priya', likes: 3800,
    text: "for the record i am not overheard. i have a job. the job is eating. respectfully, whoever it is has better sources than me" } },
  { at: 0.235, post: { id: 's_margot1', by: 'margot', likes: 3900,
    text: "No, I am not @overheard_hc. I'm far too busy, and frankly my secrets are more interesting than anything they've posted. Just saying." } },
  { at: 0.25, post: { id: 's_theo1', by: 'theo', likes: 2600,
    text: "Seeing my name in these Overheard theories. I'm up at 5AM and asleep by 9. When would I even have time? Let's be real." } },

  { at: 0.28, dm: 'jade1' },
  { at: 0.30, post: { id: 's_oven2', by: 'greg', scene: 'bricks', likes: 380,
    text: "Oven update: the dome is about 60% dome. The other 40% is a vibe. Neighbors have started bringing lawn chairs to watch.",
    replies: [ { by: 'moe', text: "if that oven makes one (1) pizza with mayo on it I'm calling the city" } ] } },
  { at: 0.32, post: { id: 's_biscuit2', by: 'june', likes: 820,
    text: "Thank you all for sharing!! A nice man on the tram says he saw a small brown dog near Old Town. Biscuit has never been to Old Town. He doesn't even have money. Love, June" } },

  // Overheard goes after a suspect who is NOT the culprit
  { at: 0.34, post: { id: 's_oh3', by: 'overheard', likes: 11800, variant: 'decoy1',
    text: {
      priya: "Tea: a certain food critic who 'never accepts free meals' was seen leaving the back door of a restaurant she gave 9/10 last month. With a doggy bag. A large one.",
      dev: "Tea: a certain DJ has played the same 'unreleased' track three Fridays in a row. It's not unreleased. It's from 2014. It's on every streaming app.",
      margot: "Tea: a certain beige-obsessed designer has a secret room in her house. It's painted neon orange. There's a lava lamp. My sources have photos.",
      theo: "Tea: a certain 5AM fitness coach was at Lumen rooftop at 1AM last night, eating mozzarella sticks. A full basket. Alone. Who was he waiting for?"
    } } },
  { at: 0.355, pa: "We're expecting a little turbulence. Please return to your seats and keep scrolling.", shake: true },
  { at: 0.36, post: { id: 's_decoy1', by: '{decoy1}', likes: 4200, variant: 'decoy1',
    text: {
      priya: "a doggy bag is not a bribe. it's leftovers. leftovers are a human right",
      dev: "it's a classic. classics are timeless. you wouldn't understand",
      margot: "Everyone is allowed one room. Mine happens to be orange. Moving on.",
      theo: "Cheat meals are part of the program. Recovery matters. Moving on."
    } } },
  { at: 0.38, post: { id: 's_news2', by: 'hcnow', likes: 5100,
    text: "Overheard HC passes 50,000 followers. Several Harbor City residents report \"checking their phone every four minutes.\"" } },

  // The game
  { at: 0.40, post: { id: 's_game0', by: 'carl', scene: 'court', likes: 1400, pollId: 'game',
    text: "TONIGHT: Herons vs Rockets. Herons riding a 4-game win streak, Rockets have the best defense in the league. Tip-off soon. Who you got?",
    poll: ['Herons', 'Rockets'] } },
  { at: 0.43, post: { id: 's_jade2', by: 'jade', likes: 16000,
    text: "taking a little break from posting. please be kind to each other today 🤍" } },
  { at: 0.45, dm: 'oh1' },
  { at: 0.47, post: { id: 's_game1', by: 'carl', likes: 900, live: true,
    text: "Tip-off! Herons win the jump. Arena is LOUD. Here we go." } },
  { at: 0.50, post: { id: 's_game2', by: 'carl', likes: 1100, live: true, variant: 'winner',
    text: {
      herons: "End of Q1: Rockets 28, Herons 24. That Rockets defense is as advertised. Herons 3 for 11 from deep. Ugly start.",
      rockets: "End of Q1: Rockets 29, Herons 22. Herons look like they're still on the bus. Rockets swarming everything."
    } } },
  { at: 0.52, post: { id: 's_oven3', by: 'greg', scene: 'oven', likes: 520,
    text: "The oven is finished. It's beautiful. It's leaning slightly, like a famous tower. First fire tonight. Pray for my eyebrows." } },
  { at: 0.53, post: { id: 's_game3', by: 'carl', likes: 1500, live: true, variant: 'winner',
    text: {
      herons: "HALFTIME: Herons 51, Rockets 49. A 15-2 run to close the half and the arena is shaking. Somebody check on the Rockets bench.",
      rockets: "HALFTIME: Rockets 52, Herons 50. Herons clawed back but the Rockets keep answering. Coin flip game."
    } } },
  { at: 0.545, post: { id: 's_marcus_game', by: 'marcus', likes: 600,
    text: "watching the herons game instead of streaming and chat is FURIOUS. sorry chat. this is bigger than us" } },
  { at: 0.55, post: { id: 's_biscuit3', by: 'june', likes: 1500,
    text: "Update: Biscuit has been spotted three times! Once at Pier 9, once at the night market and once, allegedly, on the Harbor Line tram. He is having a better day than me. Love, June",
    replies: [ { by: 'transit', text: "Can confirm. Biscuit rode the 14 for two stops and got off without paying. Legend." } ] } },
  { at: 0.565, post: { id: 's_oh4', by: 'overheard', likes: 14200,
    text: "Everyone thinks I'm {decoy2Name}. Cute. Keep guessing." } },
  { at: 0.57, post: { id: 's_game4', by: 'carl', likes: 1300, live: true, variant: 'winner',
    text: {
      herons: "End of Q3: Herons 77, Rockets 76. Twelve lead changes. I've stopped breathing. Fourth quarter coming up.",
      rockets: "End of Q3: Rockets 80, Herons 74. Rockets starting to pull away. Herons need a run, and fast."
    } } },
  { at: 0.58, dm: 'jade2', when: f => f.posted },
  { at: 0.60, dm: 'luca1' },
  { at: 0.61, post: { id: 's_game5', by: 'carl', scene: 'court', likes: 4800, variant: 'winner',
    text: {
      herons: "FINAL: HERONS 104, ROCKETS 99. Five straight. A three with 0:21 left to seal it. I'm hoarse. I'm emotional. I'm going to need a minute.",
      rockets: "FINAL: Rockets 101, Herons 96. Streak's over. Rockets defense was the story all night. Herons fans, we go again Thursday."
    } } },
  { at: 0.615, post: { id: 's_game6', by: 'harry', likes: 700, variant: 'winner',
    text: {
      herons: "Hot take: the Herons only won because the Rockets let them. I will not be elaborating.",
      rockets: "Called it. Said the Herons were frauds this morning. Nobody listened. Nobody ever listens."
    } } },
  { at: 0.62, post: { id: 's_ferris_saved', by: 'hcnow', scene: 'restaurant', likes: 8800, when: f => f.posted,
    text: "After a leaked text revealed Ferri's Trattoria is closing, Harbor City showed up: there's a line around the block in Old Town tonight. #SaveFerris" } },

  // The net tightens
  { at: 0.63, post: { id: 's_harry_theory', by: 'harry', likes: 900,
    text: "Hot take: Overheard is obviously {decoy2Name}. Case closed. You're welcome." } },
  { at: 0.645, post: { id: 's_kai_clue', by: 'kai', likes: 2400, variant: 'culprit',
    text: {
      priya: "ok has anyone noticed overheard ends EVERY post with the same emoji. 💅 every time. that has to mean something",
      dev: "ok has anyone noticed overheard ends EVERY post with the same emoji. 🌙 every time. that has to mean something",
      margot: "ok has anyone noticed overheard ends EVERY post with the same emoji. 💅 every time. that has to mean something",
      theo: "ok has anyone noticed overheard ends EVERY post with the same emoji. 🌙 every time. that has to mean something"
    },
    replies: [ { by: 'marcus', text: "kai has a spreadsheet. kai has a SPREADSHEET." } ] } },
  { at: 0.66, post: { id: 's_lena_clue', by: 'lena', likes: 1800, variant: 'case',
    text: {
      lower: "Pattern I can't unsee: Overheard has never once used a capital letter. Not even for Harbor City. Who else types like that?",
      proper: "Pattern I can't unsee: Overheard writes in full sentences with capitals and punctuation, like a cover letter. Who else types like that?"
    } } },
  { at: 0.68, post: { id: 's_poll', by: 'hcnow', likes: 6400, pollId: 'accuse',
    text: "POLL: Who do YOU think runs @overheard_hc?",
    poll: ['Priya (food critic)', 'Dev (DJ)', 'Margot (designer)', 'Theo (coach)'] } },
  { at: 0.70, post: { id: 's_oh5', by: 'overheard', likes: 16900,
    text: "You're all getting warmer. I'll unmask myself before you land. Then we'll see who's laughing." } },
  { at: 0.74, post: { id: 's_biscuit4', by: 'june', scene: 'dog', likes: 9200,
    text: "BISCUIT IS FOUND!!! A very nice man named Greg found him asleep inside a pizza oven?? I don't understand but I am crying. Love, June #biscuitishome",
    replies: [
      { by: 'rosa', text: "CRYING ON MY COOLDOWN 😭😭" },
      { by: 'transit', text: "Biscuit's tram privileges are hereby extended for life." }
    ] } },
  { at: 0.75, post: { id: 's_oven4', by: 'greg', likes: 3400,
    text: "Update: went to light the oven. Did not light the oven. There was a dog in it. Dog is fine. Dog is great. Dog has a grandma. Pizza postponed." } },
  { at: 0.78, post: { id: 's_oh6', by: 'overheard', likes: 19500, variant: 'culprit',
    text: {
      priya: "respectfully, this city cannot keep a secret to save its life. 300 dms today.",
      dev: "300 dms today. this city cannot keep a secret to save its life. no notes",
      margot: "Three hundred DMs today. This city cannot keep a secret to save its life. Just saying.",
      theo: "Three hundred DMs today. Let's be real. This city cannot keep a secret to save its life."
    } } },
  { at: 0.795, post: { id: 's_kai_gun', by: 'kai', likes: 3100,
    text: "WAIT. read overheard's last post again. i've seen someone say that EXACT thing before. i'm shaking" } },
  { at: 0.82, notify: { icon: 'mystery', text: "Overheard unmasks before landing. Make your call: tap Overheard's profile and pick who you think it is." }, when: f => !f.accused },
  { at: 0.85, post: { id: 's_oven5', by: 'greg', scene: 'pizza', likes: 2700,
    text: "First pizza: achieved. Fence: slightly on fire. Fire department: very nice. 10/10 would build again." } },
  { at: 0.86, post: { id: 's_oh7', by: 'overheard', likes: 22000,
    text: "Unmasking in a few minutes. Last chance to guess." } },

  // Descent and the finale
  { at: 0.88, pa: "Ladies and gentlemen, we've begun our descent. Please make sure your seatbelt is fastened and your guesses are locked in.", chime: true, phase: 'descent' },
  { at: 0.90, post: { id: 's_news3', by: 'hcnow', likes: 9700,
    text: "BREAKING: Overheard HC says it will reveal its identity in the next few minutes. Over 140,000 people are watching." } },
  { at: 0.92, reveal: true, post: { id: 's_unmask', by: 'overheard', likes: 64000, variant: 'culprit',
    text: {
      priya: "Fine. It's me. Priya. I started Overheard the night Ferri's banned me over a 6/10. Turns out this city is way more interesting than risotto. Respectfully, see you all at dinner.",
      dev: "It's Dev. Six years in the booth at every party in this city and nobody ever looks at the DJ. I hear everything. I got tired of being background music. No notes.",
      margot: "It's me. Margot. My brand was struggling, and Overheard got more followers in a day than Lindqvist Home got in five years. I'm not proud. I'm a little proud. Just saying.",
      theo: "It's Theo. Let's be real, I started it to find out who Jade was spending her nights with. The answer was nobody. She was helping Luca save his restaurant. I'm deleting this account and going for a run."
    } } },
  { at: 0.925, post: { id: 's_news4', by: 'hcnow', likes: 31000,
    text: "JUST IN: The person behind @overheard_hc was {culprit} (@{culpritHandle}) all along." } },
  { at: 0.93, post: { id: 's_called', by: 'hcnow', likes: 12500, when: (f, ctx) => ctx.correct,
    text: "Wildest part of the Overheard story: a passenger on a flight with no wifi, @{handle}, called it {calledAgo} before the reveal." } },
  { at: 0.932, post: { id: 's_kai_end', by: 'kai', likes: 5200,
    text: "i KNEW it was {culprit}. (i did not know it was {culprit}. i had a spreadsheet and it was wrong)" } },

  // Jade and Luca: four endings, from two choices (did you relay Luca's message? did you post the leak?)
  { at: 0.95, post: { id: 's_end_jade', by: 'jade', likes: 88000, scene: 'restaurant', variant: 'ending',
    text: {
      engaged: "So... he told me everything. Ferri's was in trouble and he was trying to protect me from it. We're going to figure it out together. And then he got down on one knee next to the dish pit?? I SAID YES 🤍 (thank you @{handle}, you know what you did)",
      salty: "Ok. A lot happened today. Someone leaked our business (still mad at you, @{handle}). But because of it there's a line around the block at Ferri's, and he finally told me everything. We're okay. Better than okay 🤍",
      apart: "The whole city knows our business now. The restaurant is saved, which is good. I just wish I'd heard it from him first.",
      lastcall: "We're taking some time apart. Thank you for all the kind messages today. Be gentle with the people you love 🤍"
    } } },
  { at: 0.96, post: { id: 's_end_luca', by: 'luca', likes: 41000, variant: 'ending',
    text: {
      engaged: "Ferri's is staying open. Jade did the math, Harbor City did the rest. Also I'm engaged. Mamma mia.",
      salty: "Ferri's is booked for two months. I don't know who to thank. Actually I do. Grazie, Harbor City.",
      apart: "Ferri's is staying open because of all of you. Jade, if you're reading this: I'm sorry.",
      lastcall: "Last services at Ferri's are next month. Come eat while you can. Grazie for three beautiful years."
    } } },
  { at: 0.975, pa: "Welcome to {to}. Please keep your phone in Airplane Mode until we reach the gate." , chime: true }
];

// ---- direct messages with choices ---------------------------------------------------------------
// Each DM delivers `messages` (with a typing delay), then offers `choices`. A choice can send more
// messages, set flags, and offer `next` choices. `variants` swaps the opening on a condition.
AM.STORY.dms = {
  jade1: { with: 'jade',
    messages: ["hey, random but you seem nice", "you saw the overheard thing right? be honest. do people think it's about me and luca"],
    choices: [
      { label: "Honestly... yeah", reply: ["ugh. ok. thank you for not lying to me", "i'll be fine. i think 🤍"], set: { jadeHonest: true } },
      { label: "Could be anyone", reply: ["you're sweet but you're a bad liar lol", "it's fine. it's not fine. it's fine"] },
      { label: "Want me to find out who runs it?", reply: ["...would you?? ok. you're my detective now 🕵️", "report back. i'm putting you in charge"], set: { detective: true } }
    ] },

  oh1: { with: 'overheard',
    messages: ["Hey. You've got followers and good taste. I like you.", "Want an exclusive? A screenshot nobody else has. Post it and you'll blow up."],
    choices: [
      { label: "Send it 👀", set: { tookLeak: true },
        reply: ["[screenshot]", "You didn't get this from me."],
        next: [
          { label: "Post it", set: { posted: true }, reply: ["Knew I liked you."], action: 'postLeak' },
          { label: "Delete it", reply: ["Your loss. Offer expires when you land."] }
        ] },
      { label: "Not my business", reply: ["Suit yourself. The offer expires when you land."] }
    ] },

  jade2: { with: 'jade',
    messages: ["did you really post that??", "that was private. i didn't even know about the restaurant"],
    choices: [
      { label: "I'm sorry", set: { apologized: true }, reply: ["i know you didn't mean harm. still. ugh", "people are lining up outside ferri's so... i don't know how to feel"] },
      { label: "People deserved to know", reply: ["wow. ok."], action: 'jadeUnfollow' }
    ] },

  luca1: { with: 'luca',
    messages: ["Ciao. I know we don't know each other. Jade follows you and she won't answer me.",
      "The fight wasn't about her. Ferri's is closing next month. I didn't know how to tell her, and I made it worse.",
      "Could you tell her? Just that. Please."],
    variants: [
      { when: f => f.posted, messages: ["Ciao. So. Everyone knows about the restaurant now.",
        "I'm not even mad. People keep calling to book tables. But Jade still won't talk to me.",
        "Could you tell her I'm sorry she had to find out like that? She follows you."] }
    ],
    choices: [
      { label: "I'll tell her", set: { relayed: true }, reply: ["Grazie. Really."], action: 'relayToJade' },
      { label: "Stay out of it", reply: ["Capisco. Okay."] }
    ] }
};

// What the player sends Jade when relaying Luca's message, and how she answers.
AM.STORY.relay = {
  plain: { you: "Luca asked me to tell you: the fight wasn't about you. Ferri's is closing next month and he didn't know how to say it.",
    jade: ["...oh.", "oh no. ok. thank you for telling me 🤍", "i'm going to call him"] },
  posted: { you: "Luca asked me to tell you he's sorry you found out about the restaurant like that.",
    jade: ["...ok.", "i'm still mad at you. but thank you", "i'm going to call him"] }
};

// The leaked screenshot, shown in DMs and on the player's post.
AM.STORY.leak = {
  from: 'Luca',
  text: "we can't keep doing this. the restaurant is closing in a month and I don't know how to tell her",
  caption: "someone sent me this... so THAT'S what the fight outside Ferri's was about??"
};

// Endings for the recap.
AM.STORY.endings = {
  engaged: { title: 'Engaged at the dish pit', blurb: 'You passed on the leak and carried Luca\'s message. Jade said yes, and Ferri\'s stays open.' },
  salty: { title: 'Saved, but salty', blurb: 'Your leak saved Ferri\'s and your message reunited them. Jade is still a little mad at you.' },
  apart: { title: 'Saved, but apart', blurb: 'Your leak saved the restaurant, but Jade heard the news from the internet instead of from Luca.' },
  lastcall: { title: 'Last call at Ferri\'s', blurb: 'You stayed out of it. Ferri\'s closes next month and Jade and Luca are taking time apart.' }
};

// How each suspect deflects when you DM them about Overheard (styled by the engine, so these are clues too).
AM.STORY.suspectDm = {
  priya: ["respectfully, why would i run a gossip account when i can just write reviews", "if i was overheard the posts would have better grammar", "i'm eating. ask me later"],
  dev: ["bro i'm in the booth until 3am. i don't have time to be a mystery", "i hear a lot of stuff from the booth. doesn't mean i post it", "no notes on overheard, they're good at this. it's not me though"],
  margot: ["I'm a designer, not a detective's suspect. Please.", "If I ran a gossip account it would be beautifully curated. Look at that one. Just saying.", "I'm going to need you to take my name out of your mouth, sweetly."],
  theo: ["I'm asleep by 9. Overheard posts at midnight. Do the math.", "Let's be real, I have three clients and a protein shake to deal with right now.", "Focus on your own goals. Not on gossip."]
};

// Overheard's replies when you DM it after the offer.
AM.STORY.overheardDm = ["I don't reveal sources.", "Nice try.", "Keep guessing.", "I see everything. Even from up here.", "You'll find out before you land."];

// Trending topics, switched on by progress and choices.
AM.STORY.trends = [
  { tag: 'WhoIsOverheard', from: 0.10, to: 0.93, base: 4000, grow: 180000 },
  { tag: 'ItWas{culpritName}', from: 0.925, base: 60000, grow: 90000 },
  { tag: 'BiscuitWatch', from: 0.03, to: 0.74, base: 300, grow: 9000 },
  { tag: 'BiscuitIsHome', from: 0.74, base: 12000, grow: 30000 },
  { tag: 'HeronsVsRockets', from: 0.40, to: 0.70, base: 6000, grow: 40000 },
  { tag: 'GregsOven', from: 0.30, base: 200, grow: 15000 },
  { tag: 'SaveFerris', from: 0.62, base: 9000, grow: 60000, when: f => f.posted },
  { tag: 'SaveFerris', from: 0.96, base: 20000, grow: 40000, when: f => !f.posted && f.relayed },
  { tag: 'PlaneSnackRanking', from: 0, base: 2100, grow: 3000 },
  { tag: 'MayoWar', from: 0, base: 900, grow: 2500 },
  { tag: 'HarborLineDelays', from: 0, base: 1500, grow: 1200 }
];

// ---- world settings the engine reads (the kids world has its own set) ---------------------------
AM.STORY.world = {
  name: 'Harbor City',
  mysteryTitle: 'Who runs Overheard?',
  mysteryIntro: 'Four people everyone suspects. Read how each of them writes, then make your call before the unmasking.',
  mysteryRx: 'overheard|gossip|blind item|who runs|unmask|\bpriya\b|\bmargot\b|\btheo\b|\bdev\b|detective|suspect',
  interests: ['food', 'sports', 'music', 'tech', 'pets', 'travel', 'fashion', 'gaming', 'memes', 'city', 'fitness', 'art']
};
AM.STORY.roles = { priya: 'Food critic', dev: 'DJ', margot: 'Designer', theo: 'Fitness coach' };
AM.STORY.noReply = ['overheard', 'jade', 'luca'];
AM.STORY.welcome = [
  { who: 'nina', text: "Welcome aboard, {name}! I'm Nina, I'll be your flight attendant on this feed." },
  { who: 'nina', text: 'Tap any post to read the replies. And post something! Harbor City loves a new face. Keep an eye on @overheard_hc though, I hear things are about to get messy.' }
];
AM.STORY.game = { teams: ['herons', 'rockets'], names: { herons: 'Herons', rockets: 'Rockets' }, closesAt: 0.47, post: 's_game5' };
AM.STORY.endingKey = f => (f.relayed ? (f.posted ? 'salty' : 'engaged') : (f.posted ? 'apart' : 'lastcall'));
AM.STORY.endingLabel = 'Jade and Luca';
AM.STORY.recapChips = (f, sent) => {
  const out = [];
  if (f.detective) out.push("Jade's detective"); else if (f.jadeHonest) out.push('Told Jade the truth');
  if (sent.oh1) out.push(f.posted ? 'Posted the leak' : f.tookLeak ? 'Took the leak, deleted it' : 'Turned down the leak');
  if (sent.luca1) out.push(f.relayed ? "Carried Luca's message" : 'Stayed out of it');
  out.push('Biscuit made it home');
  return out;
};
AM.STORY.overheardReplies = ['I see you, detective.', 'Warm. Very warm.', 'Careful. I read everything.', 'Interesting theory.', 'Noted.'];
AM.STORY.overheardRetired = ['This account is retired. It was fun while it lasted.', 'No more secrets. Okay, a few.', 'You already know who I am.'];
AM.STORY.trendQ = { WhoIsOverheard: 'overheard', BiscuitWatch: 'biscuit', BiscuitIsHome: 'biscuit', HeronsVsRockets: 'herons|rockets',
  GregsOven: 'oven', SaveFerris: 'ferri', PlaneSnackRanking: 'snack', MayoWar: 'mayo', HarborLineDelays: 'tram|harbor line' };
