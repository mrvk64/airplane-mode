// Airplane Mode: how Harbor City reacts when the player insults someone. Fighters clap back, gentle
// people get hurt, brands go into PR mode, and anyone pushed past their patience blocks the player.
// {insult} is the word the player used, {victim} the first name of the person insulted, {seat} the player's seat.
window.AM = window.AM || {};

AM.REACT = {
  // Which reaction each voice falls into, and how many insults it takes before they block you.
  style: { snark: 'clap', contrarian: 'clap', chaos: 'clap', hype: 'hurt', wholesome: 'hurt', artsy: 'hurt',
    pun: 'deflect', expert: 'formal', news: 'formal', brand: 'pr', bot: 'bot' },
  patience: { clap: 4, hurt: 2, deflect: 3, formal: 3, pr: 3, bot: 3 },

  // Fighters quote your insult back at you.
  clapEcho: [
    '"{insult}"? That\'s the big move? From seat {seat}?',
    '"{insult}"? I\'ve been called worse by a seagull this morning.',
    '"{insult}." Wow. Did you think of that during the safety demo?',
    'Imagine typing "{insult}" with your whole chest on airplane wifi you don\'t even have.',
    '"{insult}" is a brave thing to say from a middle seat.',
    'I\'ve been roasted by professionals. "{insult}" isn\'t even a warm-up.',
    'You flew all this way to say "{insult}"? The ticket cost more than the insult.',
    '"{insult}" coming from someone with a tray table full of pretzel dust. Sure.',
    'Screenshotting "{insult}" for my group chat. They\'re going to love you. Not in a good way.',
    'Okay but who hurt you before takeoff? "{insult}" is a lot.',
    '"{insult}"? Babe, I\'ve seen your posts. Glass houses.',
    'Write "{insult}" on the back of your boarding pass and frame it. That\'s the peak of your career.'
  ],
  // Gentle people, hurt.
  hurt: [
    ['wholesome', 'Oh. Okay. That one stung a little.'],
    ['wholesome', 'I don\'t really know what I did, but I\'m sorry you feel that way.'],
    ['wholesome', 'That wasn\'t very kind. I hope your flight gets better.'],
    ['hype', 'wow. okay. I was having such a good day too'],
    ['hype', 'that\'s... not the energy I was bringing but okay'],
    ['artsy', 'Noted. I\'ll put that feeling somewhere useful.'],
    ['artsy', 'Some people make things. Some people make comments. Okay.'],
    ['june', 'Oh dear. My grandson says to ignore people like this but I am a little hurt. Love, June'],
    ['june', 'I taught third grade for 31 years and we had a rule about this. Kind words only, please. Love, June'],
    ['rosa', 'Ouch!! That\'s okay!! I\'ll run it off!! (I\'m a little sad)'],
    ['wren', 'there is a small bruise now / where your words landed / i will make tea'],
    ['nina', 'I\'ve been yelled at by 400 passengers over a missing pretzel. This still stung a bit.'],
    ['sam', 'Okay. I\'ll take my camera somewhere a little kinder.'],
    ['ava', 'not me getting dragged on my own post. okay. noted.']
  ],
  hurtEcho: [
    '"{insult}"... wow. Okay. I\'m going to sit with that.',
    'You really said "{insult}" to me. I just wanted to share my day.',
    '"{insult}"? I didn\'t know we were doing that today.',
    'Reading "{insult}" twice to make sure it was meant for me. It was.'
  ],
  // Joke it off.
  deflect: [
    ['pun', 'Ouch! That was a low blow. Luckily I\'m short, so it went right over my head.'],
    ['pun', 'Harsh! I\'m going to need a minute. And a snack. Mostly the snack.'],
    ['greg', 'My wife says that too, but she says it with love. You said it with typos.'],
    ['greg', 'Tough crowd! Good thing I\'m used to building things that fall apart. Like this conversation.'],
    ['pun', 'Wow, a hot take AND a cold shoulder. Very efficient.']
  ],
  // Stay formal and cold.
  formal: [
    ['expert', 'Noted. Not engaging further.'],
    ['expert', 'I\'ll treat that as noise in the data.'],
    ['lena', 'I don\'t debug people for free. Logging off this thread.'],
    ['carl', 'I\'ve taken worse from courtside fans in the fourth quarter. Moving on.'],
    ['news', 'Thank you for your feedback. It has been noted.'],
    ['hcnow', 'We do not respond to personal attacks. Tips can be sent to our tip line.']
  ],
  // Brands, in full PR mode.
  pr: [
    ['brand', 'We\'re sorry you feel that way. Please DM us so we can look into it.'],
    ['brand', 'We hear you, and we value all feedback. Even this.'],
    ['transit', 'Our intern has read your comment and is now lying on the floor. Thank you.'],
    ['transit', 'We\'re sorry your experience didn\'t meet expectations. The 6:40 tram is also sorry, in its own way.'],
    ['moe', 'EXCUSE ME? Moe\'s has served Old Town since 1987. You have served nobody.'],
    ['moe', 'You can say what you want about us. You cannot say it about the pastrami.']
  ],
  bot: [
    'INSULT DETECTED. Forecast: 100% chance of you being muted.',
    'Error 418: I am a weather bot, not a punching bag.',
    'Processing... processing... no feelings found. Your insult was wasted.',
    'Your comment has been filed under "localized storms."'
  ],
  // What they say right before blocking you.
  block: {
    clap: ['Blocked. Enjoy the rest of your flight.', 'And that\'s a block. Don\'t forget to tip your flight attendant.',
      'You\'re not worth the battery. Blocked.', 'Blocking you to protect my peace and my phone storage.'],
    hurt: ['I\'m going to step away from this. Take care.', 'I don\'t need this today. Blocking you, sorry.',
      'I\'m blocking you now. I hope someone is kinder to you than you were to me.'],
    deflect: ['Okay, joke\'s over. Blocking you. No hard feelings. Some hard feelings.', 'That\'s enough of that. Blocked!'],
    formal: ['This conversation is over. Blocked.', 'Blocking this account. Have a safe flight.'],
    pr: ['We\'re ending this conversation here. This account has been blocked.', 'Out of respect for our community, we\'ve blocked this account.'],
    bot: ['BLOCK PROTOCOL ENGAGED. Goodbye, human.', 'Account blocked. Forecast for you: quiet skies.']
  },
  // Cruel or profane: even fighters take a beat.
  harsh: [
    'Whoa. That\'s not banter anymore.',
    'Okay, that crossed a line.',
    'Yikes. You okay up there?',
    'That\'s a lot of anger for a small airplane seat.'
  ],
  // Bystanders who step in when you insult someone in public.
  defend: [
    'Leave {victim} alone. What did {victim} ever do to you?',
    'Not you coming for {victim} out of nowhere. Be so for... actually, just be nice.',
    '{victim} has been nothing but kind to this whole city. Log off.',
    'The audacity to talk to {victim} like that. On a plane. In public.',
    'Hey. {victim} is one of the good ones. Try again with kindness.',
    'Everyone screenshot this so we remember who was mean to {victim}.',
    'I don\'t even know {victim} that well and I\'m offended.',
    'Respect {victim}\'s name. Or at least spell your insults right.',
    'Team {victim} assembling in the replies. You picked the wrong person.',
    'Imagine being mean to {victim}. I could never.'
  ],
  // Answers to an apology, after a block.
  apologyYes: [
    'Okay. Apology accepted. You\'re unblocked. Don\'t make it weird.',
    'Fine. Unblocked. Everybody gets one.',
    'I appreciate that. Fresh start.',
    'Apology accepted. I was a little dramatic too. Only a little.'
  ],
  apologyNo: [
    'I saw your apology. I need a bit more time.',
    'Thanks for saying sorry. I\'m still going to keep you blocked for now.',
    'Appreciated, but no. Maybe next flight.'
  ]
};
