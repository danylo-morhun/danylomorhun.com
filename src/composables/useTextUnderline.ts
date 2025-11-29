export function useTextUnderline(underlinePhrases: string[]) {
  const processTextWithUnderlines = (text: string) => {
    const parts: Array<{ text: string; shouldUnderline: boolean }> = [];
    let lastIndex = 0;
    
    const matches: Array<{ phrase: string; index: number }> = [];
    
    underlinePhrases.forEach(phrase => {
      const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({ phrase: match[0], index: match.index });
      }
    });
    
    matches.sort((a, b) => a.index - b.index);
    
    const nonOverlappingMatches: Array<{ phrase: string; index: number; length: number }> = [];
    matches.forEach(match => {
      const length = match.phrase.length;
      const endIndex = match.index + length;
      
      const overlaps = nonOverlappingMatches.some(existing => {
        return !(endIndex <= existing.index || match.index >= existing.index + existing.length);
      });
      
      if (!overlaps) {
        nonOverlappingMatches.push({ phrase: match.phrase, index: match.index, length });
      }
    });
    
    if (nonOverlappingMatches.length === 0) {
      return [{ text, shouldUnderline: false }];
    }
    
    nonOverlappingMatches.forEach(match => {
      if (match.index > lastIndex) {
        parts.push({ text: text.substring(lastIndex, match.index), shouldUnderline: false });
      }
      parts.push({ text: match.phrase, shouldUnderline: true });
      lastIndex = match.index + match.length;
    });
    
    if (lastIndex < text.length) {
      parts.push({ text: text.substring(lastIndex), shouldUnderline: false });
    }
    
    return parts;
  };

  return { processTextWithUnderlines };
}

