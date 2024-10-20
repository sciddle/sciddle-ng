import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeSentences',
  standalone: true
})
export class CapitalizeSentencesPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    // Regex to match the end of sentences (dot, exclamation, question mark, followed by space or end of string)
    const sentenceEndRegex = /([.!?]\s*|\n|$)/;

    // Split the text into sentences
    const sentences = value.split(sentenceEndRegex);

    // Capitalize first letter of each sentence
    const capitalized = sentences.map(sentence => {
      const trimmedSentence = sentence.trim();
      if (trimmedSentence.length === 0) {
        return sentence; // Return empty strings or whitespace unchanged
      }
      return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    });

    // Join sentences back together
    return capitalized.join('');
  }

}

