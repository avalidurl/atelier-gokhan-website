/**
 * Name annotation shown on hover/focus over "Gökhan" in the hero.
 *
 * Sourced, not guessed:
 * - Gökhan = gök ("sky") + han ("khan") — "sky lord". Nişanyan Adlar lists it as a
 *   Neoturkish name (gök + han), entering the mainstream Turkish repertoire c. 1930.
 *   TDK gives gök = sky/space/blue; han = a lordly title.
 *   IPA /ɟøcˈhan/ (Wiktionary). The g is palatal [ɟ] before the front vowel ö.
 * - Turhan is contested. Nişanyan reads it as tûr + han ("Turkic khan"); TDV İslâm
 *   Ansiklopedisi lists "turhan" among the variant forms of the title tarhan (a noble
 *   exempt from taxation). Both readings land on "lord / noble title", so the wording
 *   below stays true under either and stakes no claim on the disputed derivation.
 *   IPA /tuɾˈhan/ — rule-derived from Turkish phonology, no first-party source exists.
 * - Both names take stress on the final syllable (default Turkish stress).
 */
export interface NameGloss {
  readonly title: string;
  readonly tip: string;
}

export const nameGloss: NameGloss = {
  title: 'Gökhan Turhan',
  tip:
    'Turkish. Gökhan = gök “sky” + han “khan” — sky lord; /ɟøcˈhan/, say gurk-HAHN. ' +
    'Turhan = an old Turkic noble title; /tuɾˈhan/, say toor-HAHN. ' +
    'Stress falls on the second syllable of each.',
};
