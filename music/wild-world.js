withChords(function() {

// var c = music.Chord;
// var Cmaj7 = C.maj7();

songLoaded({
  id: 'wild-world',
  name: 'Wild World',
  by: 'Cat Stevens',
  key: Am,
  lyrics: new music.Song()
    .section('Intro')
    .line({spacing: 4, lyrics: false}).chords(Am, D7, G, Cmaj7)
    .line({spacing: 4, lyrics: false}).lyrics(F, '  ', Dm, E, E)

    .section('Verse')
    .lyrics(Am, 'Now that I\'ve', D7, 'lost everything to', G, 'you')
    .lyrics('You say you', Cmaj7, 'wanna start something', F, 'new')
    .lyrics('And it\'s', Dm, 'breaking my heart you\'re', E, 'leaving')
    .lyrics(E7, 'Baby I\'m grievin\'')
    .break()
    .lyrics(Am, null, 'But if you want to ', D7, 'leave, take good', G, 'care')
    .lyrics('Hope you have a', Cmaj7, 'lot of nice things to', F, 'wear')
    .lyrics('But then a', Dm, 'lot of nice things turn', E, 'bad out', G7, 'there')

    .section('Chorus')
    .lyrics(C, null, 'Oh', G, 'baby baby it\'s a', F, 'wild world')
    .lyrics(G, null, 'It\'s hard to', F, 'by just upon a', C, 'smile', G)
    .lyrics(C, null, 'Oh', G, 'baby baby it\'s a', F, 'wild world')
    .lyrics(G, null, 'I\'ll always re', F, 'member you like a', C, 'child, girl', G)
    .section('Transition')
    .line({spacing: 8}).chords(D, E)

    .section('Verse')
    .lyrics(Am, 'You know I\'ve seen a', D7, 'lot of what the world can', G, 'do')
    .lyrics('And it\'s', Cmaj7, 'breaking my heart in', F, 'two')
    .lyrics('Because I', Dm, 'never want to see you', E, 'sad girl')
    .lyrics(E7, 'Don\'t be a bad girl')
    .break()
    .lyrics(Am, null, 'But if you want to ', D7, 'leave, take good', G, 'care')
    .lyrics('Hope you make a', Cmaj7, 'lot of nice friends out', F, 'there')
    .lyrics('But just re', Dm, 'member there\'s a lot of', E, 'bad out', G7, 'there')

    .section('Chorus')
    .lyrics(C, null, 'Oh', G, 'baby baby it\'s a', F, 'wild world')
    .lyrics(G, null, 'It\'s hard to', F, 'by just upon a', C, 'smile', G)
    .lyrics(C, null, 'Oh', G, 'baby baby it\'s a', F, 'wild world')
    .lyrics(G, null, 'I\'ll always re', F, 'member you like a', C, 'child, girl', G)
    .section('Transition')
    .line({spacing: 8}).chords(D, E)

    .section('Solo')
    .line({spacing: 4}).chords(Am, D7, G, Cmaj7, F, Dm, E).build()
    .lyrics(E7, 'Baby I love you')
    .break()
    .lyrics(Am, null, 'But if you want to ', D7, 'leave, take good', G, 'care')
    .lyrics('Hope you make a', Cmaj7, 'lot of nice friends out', F, 'there')
    .lyrics('But just re', Dm, 'member there\'s a lot of', E, 'bad out', G7, 'there')

    .section('Chorus')
    .lyrics(C, null, 'Oh', G, 'baby baby it\'s a', F, 'wild world')
    .lyrics(G, null, 'It\'s hard to', F, 'by just upon a', C, 'smile', G)
    .lyrics(C, null, 'Oh', G, 'baby baby it\'s a', F, 'wild world')
    .lyrics(G, null, 'I\'ll always re', F, 'member you like a', C, 'child, girl', G)

});

});
