import type {
  BibleStory,
  CustomizationSchema,
  Location,
  Setting,
  SymbolTheologyMapping,
} from '../types';

export const locations: Record<string, Location> = {
  jerusalem: {
    id: 'jerusalem',
    name: 'Jerusalem',
    region: 'Judea',
    description:
      'The holy city set on a hill, where the temple courts echo with prayer and the law is taught to the people.',
  },
  socoh: {
    id: 'socoh',
    name: 'Socoh',
    region: 'Philistine territory',
    description:
      'A hilltop stronghold whose terraced slopes watch the valley where two armies wait in the morning mist.',
  },
  jericho: {
    id: 'jericho',
    name: 'Jericho',
    region: 'Judea',
    description:
      'An oasis walled city in the arid wilderness, watered by a perennial spring and shadowed by ancient palms.',
  },
  bethlehem: {
    id: 'bethlehem',
    name: 'Bethlehem',
    region: 'Judea',
    description:
      'The little town of David tucked among Judean hills, where flocks graze and the census brings the traveler home.',
  },
  babylon: {
    id: 'babylon',
    name: 'Babylon',
    region: 'Babylonia',
    description:
      "The proud mistress of the world, where burning lamps line the king's court and the river guides the gate.",
  },
  templeMount: {
    id: 'jerusalem-temple',
    name: 'Temple Mount',
    region: 'Judea',
    description:
      'Sacred courts where incense rises and the voice of the priests calls the people to worship.',
  },
};

export const settings: Record<string, Setting> = {
  socohValley: {
    location: locations.socoh,
    environment: 'a sun-baked wadi with rocky slopes and grain fields',
    description:
      'The valley of Elah lies still between the encamped armies, the air thick with the scent of thyme and dust.',
  },
  jerusalemStreets: {
    location: locations.jerusalem,
    environment: 'narrow cobbled streets crowded with merchants and travelers',
    description:
      'The morning market bustles beneath the shadow of the temple, where the sound of coins rings in the courts.',
  },
  roadToJericho: {
    location: locations.jericho,
    environment: 'a treacherous mountain path descending into the wilderness',
    description:
      'The road from Jerusalem down to Jericho winds through bare cliffs where a traveler left for dead lies in the dust.',
  },
  bethlehemVicinity: {
    location: locations.bethlehem,
    environment: 'a humble stable warmed by straw and animal breath',
    description:
      'A manger cradles a child while shepherds keep watch in the fields beyond.',
  },
  templeCourts: {
    location: locations.templeMount,
    environment: 'marble colonnades and rising incense',
    description:
      'The temple courts resound with prayer and the rustle of robes as the people gather.',
  },
  hangingGardens: {
    location: locations.babylon,
    environment: 'terraced gardens rising above the river plain',
    description:
      'Lush steps climb the hanging gardens where the wise of Babylon debate and lions roar beneath the shadow.',
  },
};

export const storiesCatalog: BibleStory[] = [
  {
    id: 'david-and-goliath',
    title: 'David and Goliath',
    reference: '1 Samuel 17',
    description:
      'A shepherd boy faces a giant with nothing but faith and a sling, showing that the battle belongs to the Lord.',
    characters: [
      {
        id: 'david',
        name: 'David',
        role: 'the anointed shepherd-king',
        symbolMeaning:
          'Faith and humble obedience; the young heart that trusts God over armaments.',
      },
      {
        id: 'goliath',
        name: 'Goliath',
        role: 'the towering champion of the Philistines',
        symbolMeaning:
          'Human might and boastful defiance apart from God; pride that precedes a fall.',
      },
      {
        id: 'saul',
        name: 'Saul',
        role: 'the hesitant king',
        symbolMeaning: 'Worldly authority that doubts divine deliverance.',
      },
    ],
    setting: settings.socohValley,
    timePeriod:
      'the reign of King Saul, around 1000 BCE, in the days of the judges-to-monarchy transition',
    coreTheme:
      "Faith in God's promise overcomes the power of this world, even when the enemy towers large.",
    theologicalMeaning:
      'The Lord delivers his people not by sword or spear, but by the name of the God of the armies of Israel, defeating the powers that defy him.',
    keySymbols: [
      'the sling',
      '5 smooth stones',
      "Goliath's spear and armor",
      'the stone that struck the forehead',
    ],
    doctrineTags: [
      'faith',
      'divine-delivery',
      'humility',
      'idolatry-of-might',
      'godly-courage',
    ],
    narrative:
      "In the days of {{timePeriod}}, as the armies of Israel and the Philistines encamped opposite each other in {{setting}}, a giant named {{antagonistName}} taunted the army of God day after day. Yet {{heroRole}} kept nothing but {{symbol1}} in his hand against the champion.\\n\\nWhen {{antagonistName}} lifted his spear and invoked the armies of heaven, {{heroName}} stepped forward and declared that the battle was the Lord's. One stone flew from {{symbol1}}, finding its mark upon the giant's brow, and he fell.\\n\\nThus the people learned that the Lord saves not by sword or spear, for the battle is the Lord's, and his faithfulness turns the smallest weapon into victory.",
  },
  {
    id: 'the-good-samaritan',
    title: 'The Good Samaritan',
    reference: 'Luke 10:25-37',
    description:
      'A wounded man is passed by religious leaders, but a despised neighbor shows the mercy that defines true holiness.',
    characters: [
      {
        id: 'traveler',
        name: 'A man',
        role: 'the wounded sojourner',
        symbolMeaning:
          'Every soul in need of compassion; the human condition of helplessness.',
      },
      {
        id: 'priest',
        name: 'A priest',
        role: 'the religious expert who passes by',
        symbolMeaning:
          'External religion that avoids the cost of mercy; law without love.',
      },
      {
        id: 'levite',
        name: 'A Levite',
        role: 'the assistant who also passes by',
        symbolMeaning:
          'Half-devotion that shrinks back from sacrifice; service that stops at ceremony.',
      },
      {
        id: 'samaritan',
        name: 'A Samaritan',
        role: 'the outsider who binds the wounded man',
        symbolMeaning:
          'Unmerited mercy and neighborly love that cross boundaries of prejudice and law.',
      },
    ],
    setting: settings.roadToJericho,
    timePeriod:
      'the ministry of Jesus, around 30 CE, in the region between Jerusalem and Jericho',
    coreTheme:
      "Mercy, not merely law-keeping, is the heartbeat of God's kingdom, and neighbor-love knows no border.",
    theologicalMeaning:
      "God's grace flows where human merit fails; true righteousness is measured by merciful deeds, not religious proximity.",
    keySymbols: [
      'the oil and wine',
      'the bloodied wounds',
      'the beast on which the Samaritan rode',
      'the inn',
      'the two coins paid to the host',
    ],
    doctrineTags: [
      'mercy',
      'neighbor-love',
      'grace',
      'compassion',
      'law-and-gospel',
    ],
    narrative:
      'In the time of {{timePeriod}}, a certain traveler went down the road from Jerusalem to Jericho, and {{setting}} left him beaten and half-dead. First a priest came by, and seeing him, passed on the other side. Then a Levite, too, came and passed by.\\n\\nBut {{heroRole}} stopped at the sight of him. He knelt, poured {{symbol1}} upon the wounds, and set the traveler upon his own beast, bringing him to an inn. There {{heroRole}} tended his wounds and paid for the man\'s care.\\n\\n"Which of these three, think you, was a neighbor?" The answer rings through every age: the one who showed mercy, and the voice calls to each listener, "Go and do likewise."',
  },
  {
    id: 'the-prodigal-son',
    title: 'The Prodigal Son',
    reference: 'Luke 15:11-32',
    description:
      'A wayward son squanders all and returns home, where a waiting father restores him with robes, a ring, and a feast.',
    characters: [
      {
        id: 'younger-son',
        name: 'The younger son',
        role: 'the wayward child who demands his share and returns empty',
        symbolMeaning:
          'The sinful heart that wastes life far from home and the grace that calls it back.',
      },
      {
        id: 'older-son',
        name: 'The older son',
        role: 'the self-righteous brother who resents grace',
        symbolMeaning:
          'Pharisaic piety that measures love by earned reward rather than lavish mercy.',
      },
      {
        id: 'father',
        name: 'The father',
        role: 'the ever-watching parent who runs to welcome',
        symbolMeaning:
          "God the Father's unrestrained mercy; divine grace that restores before the sinner finishes his speech.",
      },
    ],
    setting: settings.bethlehemVicinity,
    timePeriod:
      'the ministry of Jesus, around 30 CE, in a land of vineyards stretched beneath the hill-country sun',
    coreTheme:
      "God's grace restores the lost before they are worthy, and no measure of self-righteousness can earn or withhold that mercy.",
    theologicalMeaning:
      "Salvation is by grace through faith, received as a gift rather than earned by works; the father's embrace is the gospel itself.",
    keySymbols: [
      'the finest robe',
      'the inheritance money',
      'the pig feed',
      'the ring on the finger',
      'the fattened calf',
    ],
    doctrineTags: [
      'grace',
      'redemption',
      'repentance',
      'forgiveness',
      'salvation-by-faith',
      'joy-in-heaven',
    ],
    narrative:
      'In the days of {{timePeriod}}, a certain father had two sons. The younger asked for his share of the estate and went to a distant country, where he squandered his wealth in reckless living.\\n\\nWhen famine struck, the young son found himself feeding {{symbol1}} and came to his senses. He resolved to return home, saying, "I have sinned against heaven and before you."\\n\\nBut {{heroRole}} saw him from afar, had compassion, and ran to embrace him. He clothed the son in {{symbol1}} (restoring the robe of grace), placed a ring upon his finger, and killed the fattened calf, for this son had been dead and was alive again.\\n\\nSo the kingdom of heaven is like this: mercy meets us while we are still a ways off, and grace overflows beyond what either son deserved.',
  },
  {
    id: 'moses-and-passover',
    title: 'Moses and the Passover',
    reference: 'Exodus 12; Exodus 14',
    description:
      "The blood of the lamb marks God's people for deliverance as the sea opens to let the free walk through.",
    characters: [
      {
        id: 'moses',
        name: 'Moses',
        role: 'the reluctant prophet raised up to confront Pharaoh',
        symbolMeaning:
          'Divine intervention through appointed leadership; the staff that parts and provides.',
      },
      {
        id: 'pharaoh',
        name: 'Pharaoh',
        role: 'the proud king hardened against the Lord',
        symbolMeaning:
          'Human rebellion and the stubborn refusal to release what God claims as his own.',
      },
      {
        id: 'passover-lamb',
        name: 'The Passover lamb',
        role: 'the unblemished sacrifice whose blood is the sign of covenant',
        symbolMeaning:
          'The substitutionary sacrifice; innocent blood that spares the firstborn, prefiguring the Lamb of God.',
      },
      {
        id: 'israelites',
        name: 'The Israelite people',
        role: 'the redeemed covenant community',
        symbolMeaning:
          'The people bought by blood and led through the waters into freedom.',
      },
    ],
    setting: settings.hangingGardens,
    timePeriod:
      'the Exodus, around 1446 BCE, when the land of Egypt groaned under bondage and the sea lay beyond the wilderness',
    coreTheme:
      "God's covenant faithfulness delivers his people through judgment and provision, marking them by blood, not by might.",
    theologicalMeaning:
      'Deliverance comes by the blood of the Lamb and passes through the waters of separation; the same power that brought Israel out calls every believer in.',
    keySymbols: [
      'the blood on the doorposts',
      'the unleavened bread',
      'the cloud and pillar of fire',
      'the divided sea',
      'the song at the shore',
    ],
    doctrineTags: [
      'redemption',
      'covenant',
      'passover',
      'divine-judgment',
      'provision',
      'exodus-typology',
    ],
    narrative:
      'In the days of {{timePeriod}}, the people of Israel languished in bondage, their cry rising to the Lord. {{heroName}}, called by God from the burning bush, returned to Egypt and stood before Pharaoh, bearing the sign of {{symbol1}} and a staff lifted high.\\n\\nWhen the final plague fell, the Lord passed over the houses marked by the lamb\'s blood, and Israel went out with a great multitude, led by {{heroRole}} that took them safely across the wilderness.\\n\\nAt the shore of the sea, with chariots thundering behind and the waters parting ahead, the people walked through on dry ground, and the sea returned to swallow the pride of Egypt. Then Moses and all the people sang, "The Lord has triumphed gloriously," for the battle was the Lord\'s.\\n\\nSo the Passover stood: not by strength nor by might, but by the Spirit of the Lord, who leads his people from bondage to worship.',
  },
  {
    id: 'daniel-lions-den',
    title: "Daniel in the Lions' Den",
    reference: 'Daniel 6',
    description:
      'Faithful to God even under foreign law, a prophet is cast into darkness and emerges to praise at dawn.',
    characters: [
      {
        id: 'daniel',
        name: 'Daniel',
        role: 'the faithful administrator given to prayer',
        symbolMeaning:
          'Unwavering devotion to God above every earthly decree; peace that passes fear.',
      },
      {
        id: 'darius',
        name: 'Darius the Mede',
        role: 'the anxious ruler who tries to rescue',
        symbolMeaning:
          'Secular authority discovering that the God of heaven prevails over the laws of men.',
      },
      {
        id: 'conspirators',
        name: 'The jealous governors',
        role: 'the political accusers who scheme against Daniel',
        symbolMeaning:
          'The envy that manufactures law to bind a good man; evil that thinks it can cage the righteous.',
      },
    ],
    setting: settings.hangingGardens,
    timePeriod:
      'the reign of Darius the Mede, around 539 BCE, when Babylon bows to the rising Persian kingdom',
    coreTheme:
      'Faithful witness in a hostile court confounds every plot, and the Lord shuts the mouths of those who would devour the just.',
    theologicalMeaning:
      'The Lord rescues the faithful even in the jaws of the predator, making plain both divine power and the limits of human counsel.',
    keySymbols: [
      "the lions' den",
      'the window open to Jerusalem',
      'the stone that sealed the den the next morning',
      "the king's seal ring",
    ],
    doctrineTags: [
      'faithfulness',
      'divine-delivery',
      'sovereignty',
      'prayer',
      'innocence-of-suffering',
      'god-over-kings',
    ],
    narrative:
      'In the time of {{timePeriod}}, {{heroName}} walked among the stately courts of {{setting}}, yet his heart knelt three times a day toward {{heroRole}} that lifted toward Jerusalem.\\n\\nThe governors, envious and unable to find fault in Daniel, conspired until they tricked Darius into signing a decree that none might pray to any god or man for thirty days. Still, Daniel knelt openly, and the conspirators hurried to report him.\\n\\nWhen the law took its course, Daniel was cast into {{symbol1}}, where the hungry lions came to meet him. But in that dark pit, the angel of the Lord stood guard, and by dawn the lions had lain like lambs.\\n\\nAt the first light the king lifted his voice in praise, "My God has sent his messenger and shut the mouths of the lions!" — and Daniel emerged, singing thanksgiving, proven more than conqueror.',
  },
];

export const customizationSchema: CustomizationSchema = [
  {
    id: 'heroName',
    label: 'Hero name',
    type: 'text',
    storyField: 'character.name',
    guardrail: 'does-not-change-doctrine',
  },
  {
    id: 'antagonistName',
    label: 'Antagonist name',
    type: 'text',
    storyField: 'character.name',
    guardrail: 'does-not-change-doctrine',
  },
  {
    id: 'setting',
    label: 'Setting',
    type: 'select',
    storyField: 'setting',
    guardrail: 'does-not-change-doctrine',
    options: [
      'a sun-baked wadi with rocky slopes and grain fields',
      'narrow cobbled streets crowded with merchants and travelers',
      'a treacherous mountain path descending into the wilderness',
      'a humble stable warmed by straw and animal breath',
      'terraced gardens rising above the river plain',
      'the marble courts where incense rises in the morning',
      'a quiet village beside olive groves',
    ],
  },
  {
    id: 'timePeriod',
    label: 'Time period',
    type: 'select',
    storyField: 'timePeriod',
    guardrail: 'does-not-change-doctrine',
    options: [
      'in days of old, when the covenant was being forged',
      'in an age when the lamps were trimmed and the courts gathered',
      'under the reign of a great king who tested the hearts of men',
      'in the fullness of time when heaven leaned toward earth',
      'in a wilderness season when freedom was near and danger nearer',
    ],
  },
  {
    id: 'heroRole',
    label: 'Hero role',
    type: 'select',
    storyField: 'character.role',
    guardrail: 'preserves-core',
    options: [
      'a faithful witness who will not compromise',
      'a merciful neighbor who crosses every border',
      'a loving parent who runs to welcome the wayward child',
      'a steadfast leader who parts the waters of grace',
      'a bold voice that faces the den of lions',
      "a humble shepherd who trusts the Lord's deliverance",
    ],
  },
  {
    id: 'tone',
    label: 'Narrative tone',
    type: 'select',
    storyField: 'tone',
    guardrail: 'does-not-change-doctrine',
    options: [
      'hopeful and triumphant',
      'solemn and reflective',
      'uplifting and merciful',
      'dramatic and tense',
      'reverent and awe-filled',
    ],
  },
  {
    id: 'symbol1',
    label: 'Key symbolic detail',
    type: 'text',
    storyField: 'symbol',
    guardrail: 'symbolic-integrity',
  },
];

export const symbolTheologyMapping: SymbolTheologyMapping = {
  'the sling': 'faith and humble obedience that trusts God over armaments',
  '5 smooth stones': "completeness and perfection in God's provision",
  "goliath's spear and armor":
    'human might and boastful defiance apart from God',
  'the stone that struck the forehead':
    'the decisive blow of divine truth against pride',
  'the oil and wine': 'healing, consecration, and the mingled comfort of grace',
  'the bloodied wounds':
    "the cost of compassion and the price of another's love",
  'the beast on which the samaritan rode':
    "readiness to carry another's burden to restoration",
  'the inn': 'the church that receives the wounded and tends the rescued',
  'the two coins paid to the host':
    'the debt of mercy paid in full, doubling for the road ahead',
  'the finest robe': 'the righteousness of Christ credited to the repentant',
  'the inheritance money': "God's bounty entrusted to a wayward world",
  'the pig feed':
    "the depths of separation and the hunger for the Father's table",
  'the ring on the finger': 'restored sonship and covenantal belonging',
  'the fattened calf': 'the joy of reconciliation and the feast of forgiveness',
  'the blood on the doorposts':
    'substitutionary protection under the covenant blood',
  'the unleavened bread': 'hastened holiness and the removal of leaven',
  'the cloud and pillar of fire':
    'divine presence and guidance by day and night',
  'the divided sea':
    'salvation accomplished by passing through judgment to freedom',
  'the song at the shore': 'triumphant worship after deliverance',
  "the lions' den":
    'the place where suffering becomes a testimony of divine custody',
  'the stone that sealed the den the next morning':
    'the seal of the tomb and the dawn of vindication',
  'the window open to jerusalem':
    'prayer that cannot be chained and worship that cannot be forbidden',
  "the king's seal ring":
    'authority that seals the fate of the innocent and the guilty alike',
};
