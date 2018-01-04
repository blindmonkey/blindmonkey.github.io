(function() {

var C = music.Chord.C;
var D = music.Chord.D;
var E = music.Chord.E;
var Em = Em;
var F = music.Chord.F;
var G = music.Chord.G;
var A = music.Chord.A;
var Am = music.Chord.A.minor();
var Dm = music.Chord.D.minor();
var B7 = music.Chord.B.seventh();

songLoaded({
  id: 'let-it-be',
  name: 'Let It Be',
  by: 'The Beatles',
  key: C,
  // keys: [],
  lyrics: new music.Song()
    .section('Intro')
    .line({spacing: 4, lyrics: false}).chords(C, G, Am, F)
    .line({spacing: 4, lyrics: false}).lyrics(C, G, F, '  ', C)

    .section('Verse 1')
    .lyrics('When I', C, 'find myself in', G, 'times of trouble', Am, 'Mother Mary', F, 'comes to me')
    .lyrics(C, 'Speaking words of', G, 'wisdom, let it', F, 'be', C)
    .lyrics('And', C, 'in my hour of', G, 'darkness she is', Am, 'standing right in', F, 'front of me')
    .lyrics(C, 'Speaking words of', G, 'wisdom, let it', F, 'be', C)

    .section('Chorus')
    .lyrics('Let it', Am, 'be, let it', G, 'be, let it', F, 'be, let it', C, 'be')
    .lyrics(C, 'Whisper words of', G, 'wisdom, let it', F, 'be')

    .section('Verse 2')
    .lyrics('And', C, 'when the broken', G, 'hearted people', Am, 'living in the', F, 'world agree')
    .lyrics(C, 'There will be an', G, 'answer, let it', F, 'be', C)
    .lyrics('For', C, 'though they may be', G, 'parted, there is', Am, 'still a chance that', F, 'they will see')
    .lyrics(C, 'Whisper words of', G, 'wisdom, let it', F, 'be', C)

    .section('Chorus')
    .lyrics('Let it', Am, 'be, let it', G, 'be, let it', F, 'be, let it', C, 'be')
    .lyrics(C, 'There will be an', G, 'answer, let it', F, 'be', C)
    .lyrics('Let it', Am, 'be, let it', G, 'be, let it', F, 'be, let it', C, 'be')
    .lyrics(C, 'Whisper words of', G, 'wisdom, let it', F, 'be')

    .section('Transition')
    .line({spacing: 4, lyrics: false}).chords(F, C, G, C)
    .line({spacing: 4, lyrics: false}).chords(F, C, G, C)

    .section('Solo')
    .line({spacing: 4, lyrics: false}).chords(C, G, Am, F)
    .line({spacing: 4, lyrics: false}).lyrics(C, G, F, '  ', C)
    .line({spacing: 4, lyrics: false}).chords(C, G, Am, F)
    .line({spacing: 4, lyrics: false}).lyrics(C, G, F, '  ', C)

    .section('Chorus')
    .lyrics('Let it', Am, 'be, let it', G, 'be, let it', F, 'be, let it', C, 'be')
    .lyrics(C, 'Whisper words of', G, 'wisdom, let it', F, 'be')

    .section('Verse')
    .lyrics('And', C, 'when the night is', G, 'cloudy there is', Am, 'still a light that', F, 'shines on me')
    .lyrics(C, 'Shine until', G, 'tomorrow, let it', F, 'be', C)
    .lyrics('I', C, 'wake up to the', G, 'sound of music,', Am, 'Mother Mary', F, 'comes to me')
    .lyrics(C, 'Speaking words of', G, 'wisdom, let it', F, 'be', C)

    .section('Chorus')
    .lyrics('Let it', Am, 'be, let it', G, 'be, let it', F, 'be, let it', C, 'be')
    .lyrics(C, 'There will be an', G, 'answer, let it', F, 'be', C)
    .lyrics('Let it', Am, 'be, let it', G, 'be, let it', F, 'be, let it', C, 'be')
    .lyrics(C, 'There will be an', G, 'answer, let it', F, 'be', C)
    .lyrics('Let it', Am, 'be, let it', G, 'be, let it', F, 'be, let it', C, 'be')
    .lyrics(C, 'Whisper words of', G, 'wisdom, let it', F, 'be')

    .section('Ending')
    .line({spacing: 4, lyrics: false}).chords(F, C, G, C).build()

});

})();
