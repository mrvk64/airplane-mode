// Airplane Mode: background feed posts (everyday life in Harbor City).
window.AM = window.AM || {};
AM.FEED = [
  { id: 'f001', by: 'weather', text: "✈️ FLIGHT CONDITIONS: Clear skies over Harbor City Airport. Light chop above 20,000 ft. If you're reading this on a plane: hi. You shouldn't be able to load this. How are you reading this.", tags: ['travel'], vibe: 'memes', scene: 'window', early: true,
    replies: [
      { by: 'nina', text: 'Phones on airplane mode, please. Then I guess... keep scrolling?' }
    ] },
  { id: 'f002', by: 'kai', text: "bestie i got to harbor city airport at 3:40am for a 6am flight because i don't trust myself. the security guy and i have been through so much together. he knows about the shampoo. he knows everything", tags: ['travel', 'memes'], vibe: 'memes', early: true,
    replies: [
      { by: 'nina', text: "3:40am people are my favorite passengers. You're either extremely organized or running from something." },
      { by: 'transit', text: "we took you there on the first airport tram. you were the only one on it. you were eating a whole cucumber. we didn't ask." }
    ] },
  { id: 'f003', by: 'moe', text: "NO MAYO ON THE PASTRAMI. I DON'T CARE IF YOUR THERAPIST SAID TREAT YOURSELF. TREAT YOURSELF TO MUSTARD.", tags: ['food'], vibe: 'drama', early: true,
    replies: [
      { by: 'kai', text: "moe's therapist when moe walks in: oh no" },
      { by: 'harry', text: 'Hot take: mayo is just mustard that gave up.' }
    ] },
  { id: 'f004', by: 'nina', text: "A man on today's flight asked if we could 'go a bit faster' because he had dinner plans. Sir, I will speak to the captain. The captain also has dinner plans. ✈️", tags: ['travel', 'memes'], vibe: 'memes', early: true,
    replies: [
      { by: 'ollie', text: "That passenger refused to accept the default speed. That's founder thinking." },
      { by: 'harry', text: "Hot take: he's right. Planes are too slow and nobody says it." }
    ] },
  { id: 'f005', by: 'harry', text: "Unpopular opinion: soup is a drink. If it comes in a mug, I'm drinking it. Spoons are for people who are scared. I'll be in the replies with my mug of minestrone.", tags: ['food'], vibe: 'drama', early: true,
    replies: [
      { by: 'moe', text: 'SOUP IS A MEAL, HARRY. YOU ARE DRINKING DINNER.' },
      { by: 'june', text: "Harry dear, please use a spoon. You'll burn your throat. Love, June" }
    ] },
  { id: 'f006', by: 'hcnow', text: "🚨 BREAKING: The Kestrel Park footbridge has been closed for two hours after a goose 'took control of it.' Officials describe the goose as 'calm but not cooperating.'", tags: ['city'], vibe: 'memes', early: true,
    replies: [
      { by: 'june', text: "I believe I've met this goose. He has a temper but he's fair. Love, June" },
      { by: 'transit', text: 'the 7 is diverted around the park. we will not be fighting the goose.' }
    ] },
  { id: 'f007', by: 'june', text: "My grandson set up this account for me. He says I'm supposed to post my lunch. Today I had a tuna sandwich and an apple. It was lovely. #lunchtme Love, June", tags: ['food'], vibe: 'wholesome', scene: 'sandwich', early: true,
    replies: [
      { by: 'kai', text: 'nana june this is the best post on this entire app' },
      { by: 'moe', text: "TUNA ON RYE NEXT TIME, JUNE. ON THE HOUSE. DON'T TELL ANYONE." }
    ] },
  { id: 'f008', by: 'transit', text: '🚋 SERVICE UPDATE: All Harbor Line trams are running on time this morning. Please screenshot this. We may never see it again.', tags: ['city', 'memes'], vibe: 'neutral', early: true },
  { id: 'f009', by: 'wren', text: "rain on the window / tea going cold in my hands / pickle asleep on my notebook / so i guess i'm not writing today", tags: ['pets', 'art'], vibe: 'wholesome', scene: 'rain', early: true },
  { id: 'f010', by: 'carl', text: 'BANG! 🏀 Reggie Fontaine has hit a three in 58 straight games, the longest active streak in Herons history. The man does not miss. He occasionally pauses.', tags: ['sports'], vibe: 'neutral', early: true },
  { id: 'f011', by: 'ollie', text: "My 4-year-old refused to eat her broccoli. I didn't force her. I asked what problem the broccoli was solving for her. She said 'none.' That's product-market fit. Agree? 👇", tags: ['food', 'memes'], vibe: 'memes', early: true,
    replies: [
      { by: 'harry', text: 'Hot take: your daughter is a better founder than you.' },
      { by: 'kai', text: 'the broccoli has been disrupted' }
    ] },
  { id: 'f012', by: 'rosa', text: 'RUN CLUB SATURDAY 8AM AT KESTREL PARK!!! all paces welcome!!! last week someone walked the whole loop holding a coffee and we cheered the LOUDEST for her!!! 🏃', tags: ['fitness'], vibe: 'wholesome', scene: 'park', early: true,
    replies: [
      { by: 'kai', text: "is the coffee lady coming back. i'll come if the coffee lady comes" },
      { by: 'harry', text: 'Hot take: the coffee lady won.' }
    ] },
  { id: 'f013', by: 'sam', text: 'Fog rolled over Pier 9 at 6am and turned every streetlight into a soft dandelion. The whole harbor was whispering.', tags: ['art', 'city'], vibe: 'neutral', scene: 'harbor', early: true },
  { id: 'f014', by: 'marcus', text: 'lost a ranked match because my cat stood on the controller. she went 3-0 before i got her off. chat says skill issue. chat is right. NERF THE CAT 😤', tags: ['gaming', 'pets'], vibe: 'memes', scene: 'game', early: true },
  { id: 'f015', by: 'harry', text: "Hot take: if your plane seat reclines, you're allowed to recline it. You paid for the button. Vote and be wrong.", tags: ['travel'], vibe: 'drama', poll: ['Recline freely', 'Never recline', 'Ask first', 'Remove the button'],
    replies: [
      { by: 'nina', text: "Harry, I've broken up fights over less. Ask first and you'll live longer." }
    ] },
  { id: 'f016', by: 'lena', text: 'deployed on a friday. not because it was safe. because i wanted to feel something.', tags: ['tech'], vibe: 'memes' },
  { id: 'f017', by: 'moe', text: "NO, WE DON'T HAVE OAT MILK. THIS IS A DELI.", tags: ['food'], vibe: 'drama' },
  { id: 'f018', by: 'marcus', text: "STREAM TONIGHT: 6 hours of Crown of Ash, no deaths allowed. every death = one spoonful of mustard on camera. mustard proudly sponsored by Moe's Deli", tags: ['gaming', 'food'], vibe: 'neutral',
    replies: [
      { by: 'moe', text: 'I DID NOT SPONSOR ANYTHING. I GAVE YOU A JAR SO YOU WOULD LEAVE.' }
    ] },
  { id: 'f019', by: 'carl', text: 'Herons practice report: Tobi Adeyemi hit 41 straight free throws, missed one, then made the whole team run sprints for it. Including himself. Leadership, folks.', tags: ['sports'], vibe: 'neutral' },
  { id: 'f020', by: 'nina', text: "POV: the seatbelt sign is still on, we're still taxiing, and 14C is standing in the aisle with his bag like he's about to win a prize. Sir. We haven't even parked.", tags: ['travel'], vibe: 'drama' },
  { id: 'f021', by: 'wren', text: "pickle knocked my favorite mug off the table, then sat beside the pieces like he was at a memorial. he wasn't sorry. but he stayed.", tags: ['pets'], vibe: 'wholesome', scene: 'cat' },
  { id: 'f022', by: 'transit', text: 'Friendly reminder that the seat next to you is for a person. Or a small, polite dog. It is not for your bag. Not your bag, Gerald.', tags: ['city'], vibe: 'drama' },
  { id: 'f023', by: 'carl', text: "Stat of the day: the Herons are 22-3 when Hank the Heron lands the halftime backflip. 4-11 when he doesn't. I'm not saying it's causal. I'm saying Hank, do the flip.", tags: ['sports', 'memes'], vibe: 'memes',
    replies: [
      { by: 'rosa', text: 'HANK YOU CAN DO IT!!! FLIP FOR US!!!' },
      { by: 'ollie', text: 'Hank understands that culture is a KPI.' }
    ] },
  { id: 'f024', by: 'kai', text: 'not me waving back at a guy on the tram who was waving at the person behind me. anyway i live in the ocean now 🫠', tags: ['city', 'memes'], vibe: 'memes' },
  { id: 'f025', by: 'greg', text: 'Built a birdhouse this weekend! No birds yet, but a squirrel moved in and honestly he seems very happy. A tenant is a tenant!', tags: ['pets', 'art'], vibe: 'wholesome' },
  { id: 'f026', by: 'harry', text: "Hot take: tacos are better cold. Next morning, straight from the fridge, standing in the dark like a raccoon. That's the real taco experience. 🌶️", tags: ['food'], vibe: 'drama', scene: 'tacos' },
  { id: 'f027', by: 'lena', text: "it works on my machine. so we're shipping my machine.", tags: ['tech', 'memes'], vibe: 'neutral' },
  { id: 'f028', by: 'nina', text: "A little girl on my flight drew me a picture of the plane. I'm in it. My legs go all the way down to the wheels. Never been more accurately represented. It's on my fridge forever.", tags: ['travel'], vibe: 'wholesome' },
  { id: 'f029', by: 'transit', text: 'Delays on the Pier 9 line due to a seagull sitting on the tracks. The driver has asked nicely. The seagull has declined. Negotiations are ongoing.', tags: ['city'], vibe: 'memes', scene: 'tram',
    replies: [
      { by: 'hcnow', text: "JUST IN: Seagull remains on Pier 9 tracks. Officials describe him as 'unbothered.'" },
      { by: 'weather', text: 'WEATHERBOT: Wind 12 mph from the west. Seagull unaffected. Seagull is never affected.' }
    ] },
  { id: 'f030', by: 'ollie', text: "Missed my flight this morning. Most people would be upset. I saw it as the universe telling me to be early to my own life. Next flight is in 6 hours. I'm networking with a vending machine.", tags: ['travel'], vibe: 'memes',
    replies: [
      { by: 'nina', text: 'Ollie, I watched you try to hand that vending machine a business card.' },
      { by: 'kai', text: 'the vending machine left you on read' }
    ] },
  { id: 'f031', by: 'marcus', text: "3x regional finalist. 0x regional winner. we don't talk about it. we especially don't talk about the button i pressed in game 5.", tags: ['gaming'], vibe: 'neutral' },
  { id: 'f032', by: 'harry', text: "Unpopular opinion: dogs are too enthusiastic. I don't need that much eye contact before 9am. Cats understand me.", tags: ['pets'], vibe: 'drama', scene: 'dog',
    replies: [
      { by: 'wren', text: 'pickle would like to formally welcome you' },
      { by: 'rosa', text: "HARRY my dog would change your whole life!! she runs 5k with me!! she already loves you and she hasn't even met you!!" }
    ] },
  { id: 'f033', by: 'transit', text: 'Seagull update: he has moved. Not far. He is now riding on the roof of tram 4 and passengers have named him Gary. Gary is going to Old Town. Gary did not pay.', tags: ['city', 'memes'], vibe: 'memes',
    replies: [
      { by: 'kai', text: "GARY RIDES FREE. GARY IS THE PEOPLE'S BIRD" },
      { by: 'sam', text: 'Got him at the Old Town stop. He looked like he owned the place.' }
    ] },
  { id: 'f034', by: 'kai', text: "the pigeons at pier 9 are running a scheme. one distracts you, one takes the fry, they split it behind the bench. i watched them do a debrief. it's giving organized crime and honestly? respect", tags: ['city', 'memes'], vibe: 'memes', scene: 'harbor' },
  { id: 'f035', by: 'lena', text: 'coffee: 4. bugs fixed: 1. bugs created: 3. net productivity: a crime scene. ☕', tags: ['tech'], vibe: 'neutral', scene: 'coffee' },
  { id: 'f036', by: 'greg', text: "Day 3 of building the kids a bunk bed. Box said 'easy assembly, 2 hours.' I have 14 leftover screws and a brand new respect for my wife. The bed is standing. Mostly.", tags: ['memes'], vibe: 'memes',
    replies: [
      { by: 'lena', text: '14 leftover screws is just optional dependencies. ship it.' },
      { by: 'ollie', text: "Greg's bunk bed is a masterclass in MVP thinking. Launch first, tighten later. Agree?" }
    ] },
  { id: 'f037', by: 'ava', text: "thrifted a wool coat for $9 and the lady at the register said 'that was my husband's.' then she said 'he'd love that you have it.' i'm going to wear this coat until it turns to dust", tags: ['fashion'], vibe: 'wholesome' },
  { id: 'f038', by: 'marcus', text: "people asking about my setup: 2 monitors, 1 chair with lumbar support, 14 empty cups i've become emotionally attached to", tags: ['gaming', 'tech'], vibe: 'neutral', scene: 'desk' },
  { id: 'f039', by: 'kai', text: 'went to a basement show in old town and the opener was one man with a cello, a smoke machine and zero explanation. best night of my life. i would die for cello man', tags: ['music'], vibe: 'wholesome', scene: 'concert' },
  { id: 'f040', by: 'sam', text: 'The Harbor Line at dusk. Everyone heading somewhere warm.', tags: ['city', 'art'], vibe: 'neutral', scene: 'tram' },
  { id: 'f041', by: 'hcnow', text: "Harbor City Airport says the new moving walkway in Terminal B is 'fully operational' after a week in which, according to travelers, it was 'just a floor.'", tags: ['travel', 'city'], vibe: 'neutral' },
  { id: 'f042', by: 'june', text: "Does anyone know how to make the letters bigger? I've been reading everything with a magnifying glass like a detective. Love, June", tags: ['tech'], vibe: 'wholesome' },
  { id: 'f043', by: 'nina', text: 'Crew room debate and we need outside help. Best seat on the plane?', tags: ['travel'], vibe: 'memes', poll: ['Window, obviously', 'Aisle, for freedom', 'Middle (send help)', 'Jump seat (ask me how)'] },
  { id: 'f044', by: 'carl', text: '14 years courtside and the arena nachos are still the best food in Harbor City. Moe can take it up with my editor.', tags: ['sports', 'food'], vibe: 'drama',
    replies: [
      { by: 'moe', text: 'CARL. MY DELI. TOMORROW. WE NEED TO TALK.' },
      { by: 'harry', text: 'Hot take: arena nachos are just chips with a fever.' }
    ] },
  { id: 'f045', by: 'harry', text: "Hot take: rain is the best weather. The city goes quiet, everything smells like pennies, and you're allowed to cancel plans. Sun people are exhausting.", tags: ['city'], vibe: 'neutral' },
  { id: 'f046', by: 'weather', text: "⛅ HARBOR CITY FORECAST: Today 64F, morning fog clearing by noon. Tonight: clear. Tomorrow: unknown. Like all of us, I'm doing my best.", tags: ['city'], vibe: 'neutral' },
  { id: 'f047', by: 'hcnow', text: "DEVELOPING: Old Town residents report a man playing bagpipes at 7am for the third day in a row. He says he's 'practicing.' Neighbors say he is 'not improving.'", tags: ['music', 'city'], vibe: 'drama' },
  { id: 'f048', by: 'rosa', text: "ran 20 miles this morning and a guy yelled 'WHY' at me from his car and honestly?? great question!! i'll let you know at mile 21!!", tags: ['fitness', 'memes'], vibe: 'memes' },
  { id: 'f049', by: 'wren', text: "wrote a poem about the tram. it's mostly about the sound the doors make. it's the most honest thing i've ever written.", tags: ['city', 'art'], vibe: 'neutral',
    replies: [
      { by: 'transit', text: 'we would like to print this and put it in every tram. no take backs.' },
      { by: 'sam', text: "That door sound is the city's heartbeat. You're right." }
    ] },
  { id: 'f050', by: 'greg', text: "Tried to fix our squeaky stair. Now there are two squeaky stairs and they harmonize. My daughter calls them 'the band.' I'm calling it a feature!", tags: ['music', 'memes'], vibe: 'memes' },
  { id: 'f051', by: 'june', text: "Taught 3rd grade for 34 years. Today a man at the grocery store said 'Mrs. Albright?' and it was one of my students. He's 41 and a dentist, and he still raised his hand to talk to me. I told him he could put it down. He didn't. Love, June", tags: ['city'], vibe: 'wholesome' },
  { id: 'f052', by: 'marcus', text: "chat can't agree so you're deciding: best snack for a 6 hour stream?", tags: ['gaming', 'food'], vibe: 'neutral', scene: 'pizza', poll: ['Chips', 'Grapes (elite)', 'Cold pizza', 'Nothing. Built different'] },
  { id: 'f053', by: 'lena', text: 'the wifi on the harbor line tram is a beautiful idea that has never once loaded a single webpage.', tags: ['tech', 'city'], vibe: 'drama' },
  { id: 'f054', by: 'moe', text: "A man asked for 'a little mayo, just on the side.' The side of WHAT? The side of the building? He can have it outside.", tags: ['food', 'memes'], vibe: 'drama' },
  { id: 'f055', by: 'nina', text: "Things passengers asked me this week: 'Is it cold outside up here?' 'Can I open the window a crack?' 'Do you live on the plane?' (Sometimes. Emotionally.)", tags: ['travel', 'memes'], vibe: 'memes' },
  { id: 'f056', by: 'harry', text: "Unpopular opinion: running is just walking for people who are late. Rosa, I know you're typing. Put the phone down and go jog.", tags: ['fitness'], vibe: 'drama',
    replies: [
      { by: 'rosa', text: "HARRY I'M ON A RUN RIGHT NOW AND TYPING THIS WHILE RUNNING!!! ALSO SO PROUD OF YOU FOR THINKING ABOUT RUNNING!!!" },
      { by: 'lena', text: "she replied faster than my test suite runs. and she's at mile 6." }
    ] },
  { id: 'f057', by: 'sam', text: "Shot a wedding in the rain today. The couple refused umbrellas. Best photos I've taken all year.", tags: ['art'], vibe: 'wholesome', scene: 'rain' },
  { id: 'f058', by: 'ollie', text: "Got ratio'd by a 22-year-old yesterday. Instead of getting defensive, I offered her a role. As a consultant. Unpaid. She hasn't responded. That's what a growth mindset looks like.", tags: ['memes'], vibe: 'drama' },
  { id: 'f059', by: 'june', text: "Went to Kestrel Park to feed the ducks and a goose told me off. I told him off right back. We've reached an understanding. #natrue Love, June", tags: ['city', 'pets'], vibe: 'drama' },
  { id: 'f060', by: 'hcnow', text: "Fog at Pier 9 was so thick this morning that a ferry briefly docked at the wrong pier. Passengers called it 'mostly fine' and 'a little embarrassing for everyone.'", tags: ['city'], vibe: 'neutral', scene: 'harbor' },
  { id: 'f061', by: 'kai', text: "update on my fitness journey: i bought the shorts. the shorts look incredible. that's the update", tags: ['fitness', 'memes'], vibe: 'memes', scene: 'gym' },
  { id: 'f062', by: 'greg', text: "Hung a shelf today! Very level-headed, unlike me, according to my wife. I'll be here all week. (Mostly because the shelf fell down and I'm hanging it again.) 🔨", tags: ['memes'], vibe: 'neutral' },
  { id: 'f063', by: 'wren', text: "pickle has decided the radiator is his job now. he clocks in at 9. he clocks out at 5. he looks tired. i don't ask about his work.", tags: ['pets', 'memes'], vibe: 'memes',
    replies: [
      { by: 'ollie', text: 'Pickle understands boundaries better than most executives. Agree?' },
      { by: 'lena', text: 'pickle has better work-life balance than my entire team' }
    ] },
  { id: 'f064', by: 'ollie', text: "Woke up at 4am. Cold shower. Journaled. Meditated. Ate a raw egg. It's 4:12am and I've already peaked. The rest of the day is just networking. Agree?", tags: ['fitness', 'memes'], vibe: 'memes' },
  { id: 'f065', by: 'nina', text: 'Our flight was delayed 3 hours and an older man led the whole gate in a singalong. By boarding, gate C12 was a full choir. Never seen people so happy to be late.', tags: ['travel', 'music'], vibe: 'wholesome' },
  { id: 'f066', by: 'ava', text: 'saw a man on the harbor line in a full corduroy suit, mustard yellow, with matching loafers. sir if you see this: the fit. THE FIT. you made my whole week ✨', tags: ['fashion', 'city'], vibe: 'wholesome', scene: 'tram' },
  { id: 'f067', by: 'kai', text: "ava called my outfit 'very brave' and i've been thinking about it for 3 days. was that a compliment. was that a warning. ava please", tags: ['fashion', 'memes'], vibe: 'memes' },
  { id: 'f068', by: 'carl', text: "Don't tell my editor, but the best basketball in this city isn't at the arena. It's 5pm pickup at the Kestrel Park courts. No refs, all heart, and one guy who calls a foul on every play.", tags: ['sports', 'city'], vibe: 'wholesome', scene: 'court',
    replies: [
      { by: 'ollie', text: "I'm the guy. Calling fouls is just radical feedback." }
    ] },
  { id: 'f069', by: 'greg', text: "Made the kids pancakes shaped like the Harbor City skyline. They said it looked like 'a pile.' Every artist has critics!", tags: ['food', 'art'], vibe: 'wholesome' },
  { id: 'f070', by: 'transit', text: "Airport line reminder: if you're on the 5am tram with a suitcase and your neck pillow already on, we see you, we respect you, and we hope your gate isn't C47. It's always C47.", tags: ['travel', 'city'], vibe: 'neutral',
    replies: [
      { by: 'nina', text: "It's always C47. I've walked there so many times my legs have their own frequent flyer number." }
    ] },
  { id: 'f071', by: 'sam', text: "People always ask which camera is best. It's the one in your pocket when the sky starts doing something ridiculous.", tags: ['art', 'tech'], vibe: 'neutral',
    replies: [
      { by: 'ollie', text: 'Sam is really talking about leadership here. The best leader is the one who shows up. Agree?' },
      { by: 'kai', text: 'ollie he is talking about the sky' }
    ] },
  { id: 'f072', by: 'harry', text: 'Hot take: the Harbor Line tram is the most beautiful thing in this city and I will not be taking questions.', tags: ['city'], vibe: 'wholesome',
    replies: [
      { by: 'transit', text: "harry. harry we're not crying, you're crying. this is being printed and taped inside tram 6" },
      { by: 'kai', text: 'harry got hacked. blink twice' }
    ] },
  { id: 'f073', by: 'nina', text: "Turbulence is just the sky clearing its throat. You're fine. I'm still pouring coffee. If I'm calm, you're calm.", tags: ['travel'], vibe: 'wholesome', scene: 'window',
    replies: [
      { by: 'weather', text: "WEATHERBOT: Can confirm. Light chop at 31,000 ft. The sky is fine. It's just like that sometimes." }
    ] },
  { id: 'f074', by: 'ollie', text: "Moe's Deli has had the same menu for almost 40 years. No pivots. No rebrands. No mayo. That's not stubbornness. That's a moat. Agree?", tags: ['food', 'city'], vibe: 'neutral',
    replies: [
      { by: 'moe', text: "I DON'T KNOW WHAT A MOAT IS AND I DON'T WANT YOU IN MY DELI." }
    ] },
  { id: 'f075', by: 'ava', text: "hot take (sorry harry): socks with sandals are back and honestly they never left. it's about confidence. wear the socks.", tags: ['fashion'], vibe: 'drama',
    replies: [
      { by: 'harry', text: "Finally someone gets it. Wait. No. I disagree. I'm disagreeing." },
      { by: 'june', text: "I've been doing this since 1972. Love, June" },
      { by: 'kai', text: 'nana june invented this trend and we need to start crediting her' }
    ] },
  { id: 'f076', by: 'transit', text: "We got 14 complaints that tram 9 'smells like bread.' We investigated. A man was carrying 11 baguettes. He has broken no rules. Let him live.", tags: ['city', 'food'], vibe: 'memes' },
  { id: 'f077', by: 'kai', text: "marcus said 'skill issue' to me on stream and now my mom says it to me. she doesn't know what it means. she just knows it hurts lmao", tags: ['gaming', 'memes'], vibe: 'memes',
    replies: [
      { by: 'marcus', text: 'YOUR MOM HAS PERFECT TIMING. tell her she has a permanent seat in chat' },
      { by: 'june', text: 'I said it to my grandson today and he went very quiet. Is that good? Love, June' }
    ] },
  { id: 'f078', by: 'wren', text: "the bookshop in old town has a chair in the back that's older than me. i sat in it for two hours. nobody asked me to leave. that's love, i think.", tags: ['art', 'city'], vibe: 'wholesome', scene: 'books' },
  { id: 'f079', by: 'lena', text: "catsitting pickle for wren. he walked across my keyboard and fixed a bug i've been stuck on for two days. i've been doing this for 11 years. i need a minute.", tags: ['tech', 'pets'], vibe: 'memes', scene: 'cat',
    replies: [
      { by: 'wren', text: "he does that. he's very gifted and very rude about it." },
      { by: 'marcus', text: 'pickle diff. hire the cat' }
    ] },
  { id: 'f080', by: 'marcus', text: "a kid in chat said watching my streams got him through a long hospital stay. had to go 'get water' for five minutes. gg kid. you're the real MVP.", tags: ['gaming'], vibe: 'wholesome' },
  { id: 'f081', by: 'hcnow', text: "Herons rookie Lukas Brandt spent two hours on his day off signing autographs at the Kestrel Park courts. One kid reportedly beat him at HORSE. Brandt: 'He's got range.'", tags: ['sports'], vibe: 'wholesome', scene: 'court' },
  { id: 'f082', by: 'sam', text: 'Old Town after the rain. Every cobblestone holding its own tiny sky.', tags: ['art', 'city'], vibe: 'neutral', scene: 'city' },
  { id: 'f083', by: 'kai', text: "my neighbor's cat comes to my balcony at 2am and stares at me through the glass. i've named him Landlord. he collects rent in the form of my peace", tags: ['pets'], vibe: 'memes', scene: 'cat' },
  { id: 'f084', by: 'carl', text: "Herons rookie Lukas Brandt asked me what my vertical is. I told him 'stable.' The kid's going to be fine in this league.", tags: ['sports', 'memes'], vibe: 'neutral' },
  { id: 'f085', by: 'moe', text: "Almost 40 years ago my pop opened this deli with one slicer and a bad attitude. The slicer broke in '04. The attitude is going strong. Thanks for coming in, Harbor City. Except you, Gerald. You know what you did.", tags: ['food', 'city'], vibe: 'wholesome' },
  { id: 'f086', by: 'marcus', text: "the new patch nerfed my main into a wet paper towel. FOUR YEARS i've played this character. i'm writing a letter. a real one. with a stamp.", tags: ['gaming'], vibe: 'drama',
    replies: [
      { by: 'lena', text: 'the balance team looked at your win rate. this patch is about you specifically.' },
      { by: 'harry', text: 'Hot take: the nerf was overdue.' }
    ] },
  { id: 'f087', by: 'kai', text: "moe yelled at me for asking about mayo and then slipped me a free pickle on the way out. i think that was an apology. i think i'm in a relationship with a deli now", tags: ['food'], vibe: 'wholesome',
    replies: [
      { by: 'moe', text: 'IT WAS NOT AN APOLOGY. IT WAS A PICKLE. DO NOT MAKE THIS WEIRD.' }
    ] },
  { id: 'f088', by: 'ava', text: "fashion school update: spent 11 hours on a jacket. my professor looked at it and said 'interesting.' i've cried in 3 different campus bathrooms. slay i guess", tags: ['fashion'], vibe: 'drama',
    replies: [
      { by: 'rosa', text: "11 HOURS!!! you're a machine!!! i KNOW it's beautiful!!!" },
      { by: 'ollie', text: "'Interesting' is the most powerful word in business. Frame it." }
    ] },
  { id: 'f089', by: 'hcnow', text: "JUST IN: Harbor City Library says a record 600 overdue books came back during 'no fines, no questions' week. Oldest return: a cookbook borrowed in 1994. Librarian: 'We're just glad it's home.'", tags: ['city'], vibe: 'wholesome', scene: 'books' },
  { id: 'f090', by: 'moe', text: "Someone left a 1-star review that says 'he yelled at me.' Yes. I yell at everyone. You weren't special. Come back and I'll yell at you again, as a friend.", tags: ['food'], vibe: 'drama',
    replies: [
      { by: 'ollie', text: 'Moe is teaching a masterclass in brand consistency. Every customer gets the same experience.' },
      { by: 'june', text: "You've never yelled at me, Moe. Love, June" }
    ] },
  { id: 'f091', by: 'ollie', text: "My barista spelled my name 'Olive.' I could have corrected her. Instead, I became Olive. Olive closes deals. Olive drinks oat lattes. Be the Olive you want to see in the world.", tags: ['food', 'memes'], vibe: 'memes', scene: 'coffee' },
  { id: 'f092', by: 'wren', text: 'tea: 6. poems: 0. pickle naps: 11. one of us is thriving.', tags: ['pets', 'memes'], vibe: 'memes' },
  { id: 'f093', by: 'rosa', text: "to the man at mile 18 of the harbor city marathon handing out orange slices and telling every single runner 'you look strong': you're a hero and i love you!!! i did not look strong!! i looked like a wet napkin!! but i BELIEVED you!!", tags: ['fitness'], vibe: 'wholesome' },
  { id: 'f094', by: 'greg', text: "Neighbor asked if I have a permit for the treehouse. I told him it's more of a tree apartment. He didn't laugh. The treehouse stands tall. The permit is... pending.", tags: ['city', 'memes'], vibe: 'drama',
    replies: [
      { by: 'june', text: "Greg, my Walter built a treehouse for our boys in 1979 with no permit and it's still standing. You go, dear. Love, June" },
      { by: 'hcnow', text: "DEVELOPING: Local tree apartment 'under review.' More as it happens." }
    ] },
  { id: 'f095', by: 'june', text: "My granddaughter showed me a 'meme.' I didn't understand it, so she explained it, and then I understood it and it still wasn't funny. Is that normal? Love, June", tags: ['memes'], vibe: 'memes',
    replies: [
      { by: 'kai', text: "nana june that is the most normal meme experience there is. you're one of us now" }
    ] },
  { id: 'f096', by: 'ollie', text: "Lost a pickup game at Kestrel Park 21-2. A lesser man would quit. I asked the winners for a post-game debrief. They left. That's called a learning moment. Agree?", tags: ['sports'], vibe: 'neutral' },
  { id: 'f097', by: 'moe', text: "Rye just came out of the oven. If you're in Old Town and you can't smell it, see a doctor.", tags: ['food', 'city'], vibe: 'neutral', scene: 'bread' },
  { id: 'f098', by: 'harry', text: 'Unpopular opinion: video games were better when they were cruel. You got three lives and a password written on a napkin. Kids today get checkpoints and a hug.', tags: ['gaming'], vibe: 'drama' },
  { id: 'f099', by: 'june', text: 'Made my lemon cake for the church bake sale and it sold out in 6 minutes. Pastor Dale bought three slices and said they were for his wife. They were not for his wife. 🍋 #bakeing Love, June', tags: ['food'], vibe: 'wholesome', scene: 'cake' },
  { id: 'f100', by: 'sam', text: 'Kestrel Park, 7am. One jogger, one dog, one man doing tai chi with total confidence. A full cast.', tags: ['city'], vibe: 'neutral', scene: 'park' },
  { id: 'f101', by: 'hcnow', text: 'DEVELOPING: A man at the beach has been building a sandcastle for six hours. It is now taller than him. A crowd has formed. High tide is at 4pm. This could get emotional.', tags: ['city'], vibe: 'drama', scene: 'beach',
    replies: [
      { by: 'kai', text: "the tide does not care about his dreams and that's the saddest sentence i've ever read" },
      { by: 'rosa', text: 'YOU CAN DO IT SANDCASTLE MAN!!! BEAT THE TIDE!!!' }
    ] },
  { id: 'f102', by: 'weather', text: "☔ AUTOMATED ALERT: 80% chance of rain this afternoon. 100% chance you leave your umbrella at home anyway. I don't make the rules. I just predict your mistakes.", tags: ['city', 'memes'], vibe: 'memes', scene: 'rain' },
  { id: 'f103', by: 'nina', text: "To 23C, who put his bare feet on the armrest of 22C: she knows. She's known for an hour. I brought her a free cookie. The entire crew is on her side.", tags: ['travel'], vibe: 'drama',
    replies: [
      { by: 'moe', text: "FEET DOWN. THAT'S A DELI RULE AND A SKY RULE." },
      { by: 'harry', text: 'Unpopular opinion: feet are natural. Bodies are natural.' },
      { by: 'ava', text: 'the free cookie is a power move. i would follow you into battle' }
    ] },
  { id: 'f104', by: 'carl', text: 'Career numbers: 1,100+ games covered. 3 laptops destroyed. 1 loose ball that knocked my coffee into my lap on live TV. Would do every second again.', tags: ['sports'], vibe: 'wholesome' },
  { id: 'f105', by: 'moe', text: "HOT TAKE HARRY ordered the pastrami 'with ranch.' He's banned for one week. He says it was 'a conversation starter.' The conversation is over, Harry.", tags: ['food'], vibe: 'drama',
    replies: [
      { by: 'harry', text: 'Unpopular opinion: ranch improves everything. Including bans.' },
      { by: 'rosa', text: "harry!! one week is so doable!! you've got this!!" },
      { by: 'marcus', text: 'getting banned from a deli is crazy lore' }
    ] },
  { id: 'f106', by: 'marcus', text: 'gaming on a plane. handheld out, battery at 41%, the guy next to me watching every move. no pressure. absolutely zero pressure. i have never played worse in my life', tags: ['gaming', 'travel'], vibe: 'memes' },
  { id: 'f107', by: 'june', text: "Planning my first airplane trip in 20 years, to see my sister. I've already packed sandwiches, a cardigan and three crossword books. Do they still give you peanuts? Love, June", tags: ['travel'], vibe: 'wholesome',
    replies: [
      { by: 'nina', text: "June, if you're on my flight you'll get peanuts AND the good cookie. Have a wonderful trip." },
      { by: 'rosa', text: 'HAVE THE BEST TIME JUNE!!!' }
    ] },
  { id: 'f108', by: 'sam', text: "Waited an hour for perfect light on the harbor. A seagull walked into frame, looked right at me, and left. That's the shot now. He knew.", tags: ['art'], vibe: 'memes',
    replies: [
      { by: 'transit', text: "that's gary. gary knows exactly what he's doing." }
    ] },
  { id: 'f109', by: 'ava', text: 'outfit check for a thing at Lumen rooftop. which one??', tags: ['fashion'], vibe: 'neutral', scene: 'rooftop', poll: ['The black dress', 'The vintage suit', 'Both at once', 'Pajamas, confidently'] },
  { id: 'f110', by: 'greg', text: "Put up a basketball hoop in the driveway! It's a little crooked, so every shot is a trick shot. Carl, tell the Herons I'm available.", tags: ['sports'], vibe: 'neutral', scene: 'court',
    replies: [
      { by: 'carl', text: "Greg, I watched the video. You're shooting 12% from the driveway. Love the energy though." }
    ] },
  { id: 'f111', by: 'wren', text: "someone left flowers on a bench in kestrel park with a note that said 'for whoever needs these.' i didn't take them. but i needed them. i think everyone who walked past did.", tags: ['city'], vibe: 'wholesome', scene: 'flowers' },
  { id: 'f112', by: 'rosa', text: "pre-race dinner at Ferri's Trattoria!! carb loading is a science and the science says order the second bowl!!", tags: ['food', 'fitness'], vibe: 'neutral', scene: 'pasta' },
  { id: 'f113', by: 'moe', text: "Kid came in today with his grandpa, who's been coming here since '89. Kid ordered the exact same sandwich. Grandpa teared up. I got something in my eye. It was onion. Shut up.", tags: ['food'], vibe: 'wholesome', scene: 'sandwich' },
  { id: 'f114', by: 'transit', text: "hi it's the intern. my manager is on vacation. the trams are fine. i have changed nothing. please stop asking if the account is ok. the account is thriving 🙂", tags: ['memes'], vibe: 'memes',
    replies: [
      { by: 'ollie', text: 'This intern is showing more ownership than my last three VPs combined. Promote them.' },
      { by: 'hcnow', text: "JUST IN: Harbor City Transit account 'thriving,' according to Harbor City Transit account." }
    ] },
  { id: 'f115', by: 'ollie', text: "Spent an hour at a gallery in front of a blank canvas priced at $40,000. Realized I am the canvas. Bought it. My accountant isn't speaking to me. Agree?", tags: ['art'], vibe: 'drama',
    replies: [
      { by: 'sam', text: "Ollie, that canvas was primed. The artist hadn't started yet." }
    ] },
  { id: 'f116', by: 'kai', text: "POV: it's 8am on the harbor line and the man across from you is eating an entire rotisserie chicken with his hands and you have never respected anyone more", tags: ['food', 'city'], vibe: 'memes' },
  { id: 'f117', by: 'nina', text: 'Landed in Harbor City at sunset and the whole harbor went gold under the wing. 9 years and it still gets me every time. Welcome home, everybody.', tags: ['travel', 'city'], vibe: 'wholesome', scene: 'window' },
  { id: 'f118', by: 'rosa', text: "POV: mile 23, your legs are gone, and your run club is holding a sign that says 'YOU'RE ALMOST THERE.' it's a lie!! it's a beautiful lie!! i love them so much!!", tags: ['fitness'], vibe: 'wholesome' },
  { id: 'f119', by: 'moe', text: 'Settle it. What goes on a pastrami on rye?', tags: ['food'], vibe: 'memes', poll: ['Mustard', 'Spicy mustard', 'Nothing. Perfect as is', 'Mayo (banned)'] },
  { id: 'f120', by: 'weather', text: 'WEATHERBOT STATUS: Sunny, 71F, light breeze off the water. A perfect day. I will spend it inside a server rack. Enjoy it for me.', tags: ['city'], vibe: 'wholesome', scene: 'beach' },
  { id: 'f121', by: 'kai', text: "someone in the group chat said 'k.' and left. no context. 11 people typing. nobody sending. it's giving hostage situation and i have work in the morning 😭", tags: ['memes'], vibe: 'drama' },
  { id: 'f122', by: 'carl', text: 'Greatest Herons moment of all time? Choose carefully. I will be fact-checking.', tags: ['sports'], vibe: 'neutral', poll: ["Fontaine's buzzer-beater", 'The 19-point comeback', "Hank's double flip", 'Adeyemi over three guys'] },
  { id: 'f123', by: 'hcnow', text: "City Council votes to install free phone chargers at every Harbor Line stop. Officials expect them to be broken 'within weeks' but say 'it's the thought that counts.'", tags: ['tech', 'city'], vibe: 'neutral' },
  { id: 'f124', by: 'ava', text: "there's a woman at the night market on canal st who hand-paints denim jackets and every single one has a different cat on the back. i bought a cat named Gregory. i don't make the rules", tags: ['fashion', 'art'], vibe: 'memes' },
  { id: 'f125', by: 'harry', text: "Hot take: sneakers are not wedding shoes. I don't care how clean they are. It's a wedding, not a pickup game. Wear a real shoe.", tags: ['fashion'], vibe: 'drama', scene: 'sneakers',
    replies: [
      { by: 'ava', text: "harry with love, the sneaker wedding is valid and one day you'll see one done right and it will change you" },
      { by: 'greg', text: "Wore sneakers to my own wedding! So did my wife. We're sole mates. 👟" }
    ] },
  { id: 'f126', by: 'nina', text: 'Pet passenger of the day: a very old cat in a carrier who meowed once at takeoff, once at landing, and slept like a retired CEO in between.', tags: ['pets', 'travel'], vibe: 'wholesome', scene: 'cat' },
  { id: 'f127', by: 'hcnow', text: "JUST IN: Art students have finished a 40-foot mural of a heron on the old cannery in Old Town. Locals call it 'stunning.' One man called it 'too much heron.' He has been asked to leave.", tags: ['art', 'city'], vibe: 'drama',
    replies: [
      { by: 'harry', text: 'I am that man. Hot take: still too much heron.' },
      { by: 'ava', text: 'the students who did this deserve a parade' },
      { by: 'carl', text: 'There is no such thing as too much heron. Go Herons.' }
    ] },
  { id: 'f128', by: 'ava', text: 'fit check from the Herons arena: a man in a full feathered heron costume. not the mascot. just a fan. a regular guy who woke up and chose plumage. couture.', tags: ['fashion', 'sports'], vibe: 'memes',
    replies: [
      { by: 'carl', text: "That's Section 112 Steve. Nine years in that costume. He has never once explained himself." }
    ] },
  { id: 'f129', by: 'marcus', text: 'Herons star Reggie Fontaine hopped on stream for one match and went 0-12. still my favorite athlete alive. some men are built for the court only', tags: ['gaming', 'sports'], vibe: 'memes',
    replies: [
      { by: 'carl', text: 'Fontaine shoots 44% from three and 0% from a controller. Both are historic numbers.' }
    ] },
  { id: 'f130', by: 'moe', text: "TO WHOEVER KEEPS PUTTING MAYO PACKETS IN MY TIP JAR: I know it's you, Gerald.", tags: ['food', 'memes'], vibe: 'drama',
    replies: [
      { by: 'transit', text: "gerald strikes again. we are so sorry. gerald is everyone's problem now" }
    ] },
  { id: 'f131', by: 'carl', text: 'Courtside tip: if a player is falling toward you, do not protect the laptop. Protect the face. Laptops can be replaced. Ask me how I know.', tags: ['sports'], vibe: 'neutral' },
  { id: 'f132', by: 'sam', text: "Steam off a bowl of ramen at the night market, lit by one red lantern. I ate it right after. I'm only human.", tags: ['food', 'art'], vibe: 'neutral', scene: 'ramen' },
  { id: 'f133', by: 'rosa', text: "someone at run club called my energy 'aggressively cheerful' and i've decided it's a compliment!! (it was a compliment!! right??)", tags: ['fitness'], vibe: 'drama',
    replies: [
      { by: 'harry', text: 'Hot take: it was not a compliment.' },
      { by: 'ava', text: 'it was a compliment and your neon jacket is iconic. never dim it' }
    ] },
  { id: 'f134', by: 'transit', text: "To whoever left a full lasagna on the bench at the Kestrel Park stop: it's been 4 hours. It's in Lost & Found now. It is somehow still warm. Please come get your lasagna. We're scared of it.", tags: ['food', 'city'], vibe: 'memes' },
  { id: 'f135', by: 'hcnow', text: "Harbor City Fashion Week opens at Pier 9 with a runway built directly over the water. Organizers say no models have fallen in. 'Yet,' one organizer added.", tags: ['fashion'], vibe: 'neutral' },
  { id: 'f136', by: 'lena', text: "coding on a plane with no wifi is engineering in its purest form. no docs. no searching. just me, my instincts and 40 errors i can't look up.", tags: ['tech', 'travel'], vibe: 'neutral' },
  { id: 'f137', by: 'sam', text: 'Shot a show at a tiny Old Town venue last night. The drummer smiled the entire set, like the songs were jokes only he got.', tags: ['music', 'art'], vibe: 'wholesome', scene: 'concert' },
  { id: 'f138', by: 'harry', text: 'Unpopular opinion: Moe is right about mayo and I hate that I agree with a deli.', tags: ['food'], vibe: 'memes' },
  { id: 'f139', by: 'greg', text: "My 6-year-old planted one tomato seed in a cup and checked on it 40 times today. When it sprouted she screamed so loud the neighbors came out. She's already planning the sauce.", tags: ['food'], vibe: 'wholesome', scene: 'plant' },
  { id: 'f140', by: 'nina', text: "Day off. Went to the night market on Canal St and nobody asked me 'chicken or pasta' once. Freedom tastes like dumplings.", tags: ['food', 'city'], vibe: 'neutral' },
  { id: 'f141', by: 'lena', text: "a stakeholder asked if we could 'just add AI to it.' to what. 'to it.' i'm going to go lie down in the server room. it's cold and nobody asks questions.", tags: ['tech'], vibe: 'drama',
    replies: [
      { by: 'ollie', text: 'I was the stakeholder. Still think it needs AI.' }
    ] },
  { id: 'f142', by: 'harry', text: "Hot take: concerts were better before everyone filmed them. I'm not watching the band through your phone. I'm watching your lock screen. Cute dog though.", tags: ['music'], vibe: 'drama' },
  { id: 'f143', by: 'kai', text: 'is it weird to clap when the plane lands. asking for me. i clapped. alone. the whole plane turned around', tags: ['travel', 'memes'], vibe: 'memes', poll: ['Clap proudly', 'Clap on the inside', 'Never, ever', 'I start the clap'],
    replies: [
      { by: 'nina', text: 'I clapped with you from the galley, Kai. Nobody claps alone on my flights.' }
    ] },
  { id: 'f144', by: 'wren', text: "pickle has been staring at the same corner of the ceiling for 20 minutes. i asked him what's there. he won't say. i'm not sleeping tonight.", tags: ['pets'], vibe: 'memes',
    replies: [
      { by: 'weather', text: 'WEATHERBOT: No supernatural activity forecast in your area. This is not a guarantee.' },
      { by: 'june', text: 'Cats see angels, dear. My mother always said so. Love, June' }
    ] },
  { id: 'f145', by: 'transit', text: "Shoutout to Bernadette on the 7, who knows the name of every regular's dog and says good morning to each one. Bernadette retires next week. Please be emotional about this with us.", tags: ['city', 'pets'], vibe: 'wholesome' },
  { id: 'f146', by: 'lena', text: "hot take for harry: tabs vs spaces doesn't matter. what matters is that you're consistent and that you agree with me.", tags: ['tech'], vibe: 'drama', poll: ['Tabs', 'Spaces', 'Whatever Lena uses', 'I fear you all'] },
  { id: 'f147', by: 'weather', text: '💨 WIND ADVISORY: Gusts up to 30 mph along Pier 9. Secure your hats. Secure your umbrellas. Secure your fries. Gary the seagull is already airborne and cannot be stopped.', tags: ['city', 'memes'], vibe: 'memes' },
  { id: 'f148', by: 'june', text: 'A young man was playing violin on the Harbor Line today. I gave him $5 and told him to stand up straight. He did. Love, June', tags: ['music', 'city'], vibe: 'wholesome' },
  { id: 'f149', by: 'hcnow', text: 'Over 3,000 runners finished the Harbor City Fun Run, including one man dressed as a tram who came 2nd and refuses to say who he is.', tags: ['fitness', 'city'], vibe: 'wholesome',
    replies: [
      { by: 'rosa', text: "I CAME 3RD BEHIND THE TRAM!!! i'll get you next year tram man!!!" },
      { by: 'transit', text: 'we can neither confirm nor deny that it was the intern.' }
    ] },
  { id: 'f150', by: 'greg', text: "Installed a smart doorbell myself! It rings every time a car drives by and once at 3am for nobody. My wife says it's haunted. I say it's just friendly.", tags: ['tech'], vibe: 'memes' },
  { id: 'f151', by: 'nina', text: "Nothing humbles you like being a flight attendant at a rooftop bar. Someone at Lumen dropped a glass last night and I stood up and said 'please remain seated.'", tags: ['city', 'memes'], vibe: 'memes', scene: 'cocktail' },
  { id: 'f152', by: 'transit', text: 'Lost & Found weekly report: 41 umbrellas, 9 single gloves, 1 trombone, 1 framed photo of a man holding a fish. Sir, your fish is safe with us.', tags: ['city', 'memes'], vibe: 'neutral' },
  { id: 'f153', by: 'weather', text: 'DAILY REPORT: UV index 6. Pollen: moderate. Mood: partly cloudy with a chance of meaningful connection. ERROR: mood is not a weather metric. Removing. Sorry.', tags: ['memes'], vibe: 'memes' },
  { id: 'f154', by: 'lena', text: "rosa got me to do one (1) run. i get it now. it's endorphins. it's basically a drug. i ran 2km and now i want to start a podcast.", tags: ['fitness'], vibe: 'wholesome',
    replies: [
      { by: 'rosa', text: "LENA!!! I'M SO PROUD!!! podcast name: 'it works on my legs'!!!" }
    ] },
  { id: 'f155', by: 'ollie', text: 'Lost to my 9-year-old nephew at a racing game 14 times in a row. Promoted him to Head of Speed. Some call that nepotism. I call it talent acquisition.', tags: ['gaming'], vibe: 'memes' },
  { id: 'f156', by: 'transit', text: "The break room is split on this one: what's the correct thing to grab when the tram brakes hard?", tags: ['city'], vibe: 'memes', poll: ['The pole', 'The strap', 'A stranger', 'Pure core strength'] },
  { id: 'f157', by: 'sam', text: 'Drove up to the ridge at 5am. The mountains were wearing a scarf of cloud. Some days the light does all the work and I just carry the camera.', tags: ['art'], vibe: 'neutral', scene: 'mountains' },
  { id: 'f158', by: 'weather', text: 'SYSTEM NOTICE: A user asked if it will rain at their wedding. I am a weather bot, not a fortune teller. But yes. Bring a tent. Congratulations.', tags: ['city'], vibe: 'neutral',
    replies: [
      { by: 'june', text: 'Rain on your wedding day is good luck! It rained on ours and my Walter and I had 51 wonderful years. Love, June' },
      { by: 'sam', text: 'Rain weddings photograph beautifully. Skip the tent. Bring towels.' }
    ] },
  { id: 'f159', by: 'wren', text: 'the busker by pier 9 plays the same three songs every evening. tonight he played a fourth. i stopped walking. it felt like being trusted with something.', tags: ['music', 'city'], vibe: 'wholesome', scene: 'guitar' },
  { id: 'f160', by: 'june', text: "Knitted scarves for all six grandchildren. Ava from this app says they are 'serving.' I don't know what they're serving, but I'm glad. Love, June", tags: ['fashion'], vibe: 'wholesome' },
  { id: 'f161', by: 'rosa', text: "4 hour delay at harbor city airport so i ran laps of terminal B!! 11km!! a pilot high-fived me!! a gate agent asked me to 'please stop'!! best delay ever!!", tags: ['travel', 'fitness'], vibe: 'memes',
    replies: [
      { by: 'nina', text: 'Rosa, that gate agent is my friend Paula and she has talked about you every single day since.' }
    ] },
  { id: 'f162', by: 'transit', text: "Ride the Harbor Line at golden hour and tell us this city isn't the main character. You can't. The windows are dirty but the vibes are spotless.", tags: ['city', 'art'], vibe: 'wholesome', scene: 'tram' },
  { id: 'f163', by: 'moe', text: "Herons win, half price for anyone in a jersey. Herons lose, full price and I don't want to hear about it. Either way, no mayo.", tags: ['sports', 'food'], vibe: 'neutral' },
  { id: 'f164', by: 'ava', text: "compliment i gave today: 'your earrings look like they know things.' compliment i got today: 'your bag is so big.' we are not the same", tags: ['fashion', 'memes'], vibe: 'memes' },
  { id: 'f165', by: 'rosa', text: "NEW RUNNING SHOES DAY!!! they're bright green!! they're so fast!! i haven't run in them yet but i can FEEL it!! 👟💚", tags: ['fitness', 'fashion'], vibe: 'wholesome', scene: 'sneakers' },
  { id: 'f166', by: 'weather', text: '🌅 SUNSET TONIGHT: 7:51PM. Clouds: scattered, photogenic. Probability that Sam Whitaker posts about it: 98%.', tags: ['art', 'city'], vibe: 'memes', scene: 'sunset',
    replies: [
      { by: 'sam', text: '...yes.' },
      { by: 'harry', text: "Hot take: I'll be indoors." }
    ] },
  { id: 'f167', by: 'harry', text: "Hot take: sunsets are overrated. It happens every single day. You don't clap when the fridge light comes on.", tags: ['art', 'city'], vibe: 'drama', scene: 'sunset',
    replies: [
      { by: 'sam', text: 'I have photographed sunsets for nine years and this is the most hurtful thing anyone has ever said to me' },
      { by: 'weather', text: "WEATHERBOT: Sunset scheduled for 7:42pm regardless of Harry's feelings." },
      { by: 'kai', text: 'some of us DO clap when the fridge light comes on harry' }
    ] },
  { id: 'f168', by: 'hcnow', text: "JUST IN: Two night market food trucks on Canal St are in a standoff over who invented the 'dumpling taco.' Both claim they did it first. Neither will comment. Both are now open until 2am.", tags: ['food'], vibe: 'drama' },
  { id: 'f169', by: 'sam', text: "Every photographer in Harbor City knows the 40 seconds after sunset when the bridge turns pink. I've missed it about 300 times. Got it tonight.", tags: ['art', 'city'], vibe: 'wholesome', scene: 'sunset',
    replies: [
      { by: 'harry', text: 'Hot take: it was orange.' },
      { by: 'weather', text: 'WEATHERBOT: Confirmed pink. Hex value logged. Harry is wrong.' }
    ] },
  { id: 'f170', by: 'weather', text: "WEATHERBOT DIAGNOSTIC: I have forecast 4,212 rainy days. I have never felt rain. Is it nice? Please don't answer. Resuming forecast. 62F. Drizzle.", tags: ['city'], vibe: 'neutral' }
];
