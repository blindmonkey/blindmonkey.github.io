(function() {

var C = music.Chord.C;
var D = music.Chord.D;
var E = music.Chord.E;
var Em = E.minor();
var G = music.Chord.G;
var A = music.Chord.A;
var Am = music.Chord.A.minor();
var Dm = music.Chord.D.minor();
var Bm = music.Chord.B.minor();
var B7 = music.Chord.B.seventh();


songLoaded({
  id: 'hotel-california',
  name: 'Hotel California',
  by: 'The Eagles',
  key: Em,
  keys: [
    { key: Bm, label: 'Original key' }
  ],
  lyrics: new music.Song()
    .section('Intro')
    .line({spacing: 4, lyrics: false}).chord(Em).chord(B7).chord(D).chord(A).chord(C).chord(G).chord(Am).chord(B7)

    .section('Verse 1')
    .line().chord(Em).lyric('On a dark desert highway')
      .chord(B7).lyric('cool wind in my hair')
    .line().chord(D).lyric('Warm smell of colitas')
      .chord(A).lyric('rising up through the air')
    .line().chord(C).lyric('Up ahead in the distance,')
      .chord(G).lyric('I saw a shimmering light')
    .line().chord(Am).lyric('My head grew heavy and my sight grew dim')
      .chord(B7).lyric('I had to stop for the night')
    .break()
    .line().chord(Em).lyric('There she stood in the doorway;')
      .chord(B7).lyric('I heard the mission bell')
    .line().chord(D).lyric('And I was thinking to myself this could be')
      .lyric(A, 'heaven or this could be hell')
    .line().chord(C).lyric('Then she lit up a candle,')
      .chord(G).lyric('and she showed me the way')
    .line().chord(Am).lyric('There were voices down the corridor,')
      .chord(B7).lyric('I thought I heard them say')

    .section('Chorus')
    .line().chord(C).lyric('Welcome to the Hotel Cali').lyric(G, 'fornia.')
    .line().lyric('Such a').lyric(B7, 'lovely place, (such a lovely place), such a')
      .lyric(Em, 'lovely face')
    .line().lyric('There\'s').lyric(C, 'plenty of room at the Hotel Cali')
      .lyric(G, 'fornia')
    .line().lyric('Any').lyric(Am, 'time of year, (any time of year) You can')
      .lyric(B7, 'find it here')

    .section('Verse 2')
    .line().chord(Em).lyric('Her mind is Tiffany-twisted,')
      .chord(B7).lyric('She got the Mercedes bends')
    .line().chord(D).lyric('She got a lot of pretty pretty boys')
      .chord(A).lyric('she calls friends')
    .line().chord(C).lyric('How they danced in the courtyard,')
      .lyric(C, 'sweet summer sweat')
    .line().chord(Am).lyric('Some dance to remember,')
      .chord(B7).lyric('some dance to forget')
    .break()
    .line().chord(Em).lyric('So I called up the captain;')
      .chord(B7).lyric('Please bring me my wine')
    .line().lyric('he said').chord(D).lyric('"We haven\'t had that spirit here since')
      .chord(A).lyric('1969"')
    .line().chord(C).lyric('and still those voices are calling from')
      .lyric(C, 'far away')
    .line().chord(Am).lyric('Wake you up in the middle of the night')
    .line().chord(B7).lyric('Just to hear them say...')

    .section('Chorus')
    .line().chord(C).lyric('Welcome to the Hotel Cali').lyric(G, 'fornia.')
    .line().lyric('Such a').lyric(B7, 'lovely place, (such a lovely place), such a')
      .lyric(Em, 'lovely face')
    .line().lyric('They\'re').lyric(C, 'livin\' it up at the Hotel Cali')
      .lyric(G, 'fornia')
      // What a nice surprise, (what a nice surprise) Bring your alibis
    .line().lyric('What a').lyric(Am, 'nice surprise, (what a nice surprise) Bring your')
      .lyric(B7, 'alibis')


    .section('Verse 3')
    .line().chord(Em).lyric('Mirrors on the ceiling;')
      .chord(B7).lyric('the pink champagne on ice (and she said)')
    .line().chord(D).lyric('We are all just prisoners here,')
      .chord(A).lyric('of our own device')
    .line().chord(C).lyric('and in the master\'s chambers,')
      .chord(G).lyric('they gathered for the feast')
    .line().chord(Am).lyric('They stab it with their steely knives but they')
    .line().lyric(B7, 'just can\'t kill the beast')
    .break()
    .line().chord(Em).lyric('Last thing I remember, I was')
      .chord(B7).lyric('running for the door')
    .line().chord(D).lyric('I had find the passage back to the')
      .lyric(A, 'place I was before')
    .line().chord(C).lyric('"Relax" said the night man; we are')
      .chord(G).lyric('programmed to receive')
    .line().chord(Am).lyric('You can check out any time you like')
    .line().chord(B7).lyric('But you can never leave...')

    .section('Solo')
    .line({spacing: 4, lyrics: false}).chord(Em).chord(B7).chord(D).chord(A).chord(C).chord(G).chord(Am).chord(B7)
    .line({spacing: 4, lyrics: false}).chord(Em).chord(B7).chord(D).chord(A).chord(C).chord(G).chord(Am).chord(B7)
    .line({spacing: 4, lyrics: false}).chord(Em).chord(B7).chord(D).chord(A).chord(C).chord(G).chord(Am).chord(B7)
    .line({spacing: 4, lyrics: false}).chord(Em).chord(B7).chord(D).chord(A).chord(C).chord(G).chord(Am).chord(B7)

    .build()
});

})();
