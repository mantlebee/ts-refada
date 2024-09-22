/**
 * The essay builder is used to generate essay-like texts.
 */
export interface IEssayBuilder {
  /**
   * Actuale length of the generated text.
   */
  readonly length: number;
  /**
   * Next word to add to the text.
   * Base on the kind of implementation,
   * the word can be added with the first letter uppercase,
   * or followed by a dot.
   * @param word word to add.
   */
  addWord(word: string): void;
  /**
   * Returns the whole generated text as string.
   */
  toString(): string;
}
