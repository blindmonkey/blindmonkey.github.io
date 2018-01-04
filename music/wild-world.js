(function() {

var c = music.Chord;
var Cmaj7 = c.C.maj7();

songLoaded({
  id: 'wild-world',
  name: 'Wild World',
  by: 'Cat Stevens',
  key: c.Am,
  lyrics: new music.Song()
    .section('Intro')
    .line({spacing: 4, lyrics: false}).chords(c.Am, c.D7, c.G, c.Cmaj7)
    .line({spacing: 4, lyrics: false}).lyrics(c.F, '  ', c.Dm, c.E, c.E)

    .section('Verse')
    .line().lyrics(c.Am, 'Now that I\'ve', c.D7, 'lost everything to', c.G, 'you')
    .line().lyrics('You say you', c.Cmaj7, 'wanna start something', c.F, 'new')
    .line().lyrics('And it\'s', c.Dm, 'breaking my heart you\'re', c.E, 'leaving')
    .line().lyrics(c.E7, 'Baby I\'m grievin\'')
    .build()


// 'Am            'D7                  'G
//
// (G)         Cmaj7                                 F
// 'You say you', c.Cmaj7, 'wanna start something', c.F, 'new'
// (F)       Dm                                    E
// ('And it\'s', c.Dm, 'breaking my heart you\'re', c.E, 'leaving')
// c.E7
// (c.E7, 'Baby I\'m grievin\'')


// Am                       D7                      G
// But if you want to leave take good care
// (G)                       Cmaj7                     F
// Hope you have a lot of nice things to wear
// (F)            Dm                             E           G7   G
// But then a lot of nice things turn bad out there
// C   G                       F             F
// Oh baby baby it's a wild world
// G                F                          C           G
// It's hard to get by just upon a smile
// C  G                         F                     F
// Oh baby baby it's a wild world
// (G)                F                          C                  D  E
// I'll always remember you like a child, girl

// Am                 D7                          G
// You know i've seen a lot of what the world can do
// (G)             Cmaj7           F
// And it's breaking my heart in two
// F         Dm                    E
// Because I never want ot see you sad girl
// E
// Don't be a bad girl


// Am                 D7               G
// But if you want to leave take good care
// G               Cmaj7                     F
// Hope you make a lot of nice friends out there
// F          Dm                     E                         G7
// But just remember theres a lot of bad out there
// C  G                        F
// Oh baby baby it's a wild world
// G                F             C
// It's hard to get by just upon a smile
// C  G                Am   F
// Oh baby baby it's a wild world
// G                F             C           D  E
// I'll always remember you like a child, girl


// Am  D7  G  Cmaj7  F  Dm7
// Am  D7  G  Cmaj7  F  Dm7
// E              Am
// Baby I love you
// Am                 D7              G
// But if you want to leave take good care
// G                C                      F
// Hope you make a lot of nice friends out there
// F           Dm                    E          G7
// But just remember theres a lot of bad out there

})

})();
