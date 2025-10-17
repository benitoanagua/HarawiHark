// src/app/services/grammar-generator.service.ts
import { Injectable } from '@angular/core';
import { RiTa } from 'rita';

// Eliminar la interfaz no utilizada y usar solo Record
type GrammarRulesRecord = Record<string, string>;

@Injectable({
  providedIn: 'root',
})
export class GrammarGeneratorService {
  /**
   * Genera un poema usando gramática formal
   */
  generatePoemWithGrammar(form: string): string {
    const grammars: Record<string, GrammarRulesRecord> = {
      haiku: {
        start: '$line5\\n$line7\\n$line5',
        line5: '$nature $action | $season $image',
        line7: '$detailedScene $emotion | $extendedNature $moment',
        nature: 'old pond | cherry blossoms | autumn moon | winter wind',
        action: 'frog jumps | leaf falls | snow melts | bird sings',
        season: 'spring rain | summer heat | autumn chill | winter snow',
        image: 'silent pond | still water | quiet garden | empty sky',
        detailedScene: 'a frog jumps into the pond | leaves drift on still water',
        emotion: 'loneliness profound | peace descends softly',
        extendedNature: 'in the quiet forest deep | across the mountain peak',
        moment: 'breaking the silence | marking the time',
      },

      limerick: {
        start: '$opening\\n$second\\n$short1\\n$short2\\n$closing',
        opening: 'There once was $person from $place',
        second: 'Who $peculiarTrait with $object',
        short1: '$action1 $location',
        short2: '$action2 $reaction',
        closing: 'And $finalOutcome for $reward',
        person: 'a young poet | an old bard | a wise scholar | a clever scribe',
        place: 'Peru | Maine | Spain | the lane',
        peculiarTrait: 'wrote verses | spoke in rhymes | counted syllables',
        object: 'great grace | a smiling face | much pace',
        action1: 'They wrote | They spoke | They joked',
        location: 'all day | by the bay | in May',
        action2: 'Their words | Their rhymes | Their lines',
        reaction: 'were clever | lasted forever | were never better',
        finalOutcome: 'won fame | earned a name | found acclaim',
        reward: 'their art | their heart | their part',
      },

      sonnet: {
        start: '$quatrain1\\n$quatrain2\\n$quatrain3\\n$couplet',
        quatrain1: '$line1\\n$line2\\n$line3\\n$line4',
        quatrain2: '$line5\\n$line6\\n$line7\\n$line8',
        quatrain3: '$line9\\n$line10\\n$line11\\n$line12',
        couplet: '$line13\\n$line14',
        line1: 'Shall I compare thee to a $summerDay',
        line2: 'Thou art more $lovely and more $temperate',
        line3: 'Rough winds do shake the $darlingBuds of May',
        line4: "And summer's lease hath all too $shortADate",
        summerDay: "summer's day",
        lovely: 'lovely',
        temperate: 'temperate',
        darlingBuds: 'darling buds',
        shortADate: 'short a date',
      },
    };

    const selectedGrammar = grammars[form] || grammars['haiku'];
    const grammar = RiTa.grammar(selectedGrammar);
    return grammar.expand();
  }

  /**
   * Genera un poema con tema específico
   */
  generateThematicPoem(theme: 'nature' | 'love' | 'melancholy' | 'joy'): string[] {
    const themes: Record<string, GrammarRulesRecord> = {
      nature: {
        start: '$intro\\n$body\\n$closing',
        intro: 'In the $place, $creature.art() $action',
        body: '$timeofday $weather, $emotion $intensity',
        closing: 'And $element.art() $metaphor remains',
        place: 'forest | garden | mountain | valley | riverbank',
        creature: 'bird | fox | deer | owl | butterfly',
        action: 'watches | waits | listens | dreams | sings',
        timeofday: 'at dawn | at dusk | by moonlight | in daylight',
        weather: 'mist rises | wind whispers | rain falls | sun shines',
        emotion: 'peace | wonder | silence | beauty | calm',
        intensity: 'profound | eternal | fleeting | deep | quiet',
        element: 'memory | shadow | echo | light | dream',
        metaphor: 'forever | unspoken | unchanged | eternal | timeless',
      },

      love: {
        start: '$opening\\n$middle\\n$ending',
        opening: 'Your $feature is like $simile',
        middle: 'I $verb you $timeframe',
        ending: 'Together we $shared_action',
        feature: 'smile | eyes | voice | touch | heart',
        simile: 'morning light | ocean waves | starlight | spring rain',
        verb: 'cherish | adore | treasure | need | love',
        timeframe: 'endlessly | always | forever | deeply | completely',
        shared_action: 'dance | dream | fly | shine | grow',
      },

      melancholy: {
        start: '$lament\\n$reflection\\n$acceptance',
        lament: 'The $lost_thing is $state',
        reflection: 'I $remember $adv',
        acceptance: 'Yet $wisdom $persists',
        lost_thing: 'summer | youth | dream | song | love',
        state: 'gone | faded | distant | silent | lost',
        remember: 'recall | know | feel | sense | miss',
        adv: 'vaguely | dimly | fondly | sadly | clearly',
        wisdom: 'time | life | memory | hope | change',
        persists: 'continues | endures | remains | flows | heals',
      },

      joy: {
        start: '$celebration\\n$description\\n$conclusion',
        celebration: 'Oh, the $joyful_thing that $action',
        description: '$positive_adjective and $positive_quality',
        conclusion: 'My heart $heart_action with $completion',
        joyful_thing: 'sunlight | laughter | music | friendship | love',
        action: 'shines | sings | dances | grows | blooms',
        positive_adjective: 'bright | warm | beautiful | wonderful',
        positive_quality: 'free | light | happy | glorious',
        heart_action: 'sings | dances | soars | rejoices',
        completion: 'delight | happiness | joy | pleasure',
      },
    };

    const selectedTheme = themes[theme] || themes['nature'];
    const grammar = RiTa.grammar(selectedTheme);
    const poem = grammar.expand();
    return poem.split('\\n');
  }
}
