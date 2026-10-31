/** Random enrolment phrases. Three are shown per visit (liveness check). */
export const ENROLMENT_PHRASES = [
  "The ferry to Lamma Island leaves every forty minutes.",
  "Seven bright lanterns floated slowly over the harbour.",
  "My favourite breakfast is a pineapple bun with butter.",
  "Please remember to water the plants on Thursday.",
  "The tram rattled past the market on Des Voeux Road.",
  "A gentle breeze carried the smell of rain across the city.",
  "We counted twelve red taxis outside the station.",
  "The library closes early on public holidays.",
  "Quiet mornings are the best time to think clearly.",
  "Her grandmother keeps a jar of lemon sweets by the door.",
  "The hiking trail climbs steeply before the view opens up.",
  "Thunderstorms are expected later this afternoon.",
  "Bring a jacket because the cinema is always cold.",
  "The orange cat sleeps on the warm windowsill.",
  "Our group project is due before the end of the month.",
  "Fresh mangoes taste sweetest in early summer.",
  "The night market was crowded with people and music.",
  "I left my umbrella on the second floor of the bus.",
  "Every voice has a colour that makes it unique.",
  "The pilot announced a smooth landing in ten minutes.",
  "Six silver spoons were placed beside each plate.",
  "A good cup of milk tea needs patience and strong leaves.",
  "The street lights flickered on one by one at dusk.",
  "Practice makes the hardest songs feel effortless.",
] as const;

export function pickPhrases(count: number, random: () => number = Math.random): string[] {
  const pool = [...ENROLMENT_PHRASES];
  const out: string[] = [];
  while (out.length < count && pool.length > 0) {
    out.push(pool.splice(Math.floor(random() * pool.length), 1)[0]);
  }
  return out;
}
