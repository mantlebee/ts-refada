import { List } from "@mantlebee/ts-core";

import { capitalizeFirstLetter, getNumberFromRange } from "../utils";
import { IEssayBuilder } from "./interfaces";
import { EssayBuilderOptions } from "./types";

/**
 * Base essay builder. Its purpose is:
 * - to collect words.
 * - to calculate the total length of text.
 * - to return the whole text, separating the collected words by a predefined separator.
 */
export class EssayBuilderBase implements IEssayBuilder {
  private _length: number;
  private readonly _separator: string;
  protected readonly _chunks: List<string>;
  protected readonly _options: EssayBuilderOptions;

  /**
   *
   * @param separator The text used the separate the words, when the whole text is return, using the {@link toString} method.
   * @param options The options defining how many paragraphs the essay has, how many sentences per paragraph, and how many words per each sentence.
   */
  public constructor(separator: string, options: EssayBuilderOptions) {
    this._length = separator.length;
    this._separator = separator;
    this._chunks = [];
    this._options = options;
  }

  public get length() {
    return this._length - this._separator.length;
  }
  public addWord(word: string) {
    this._length += word.length + this._separator.length;
    this._chunks.push(word);
  }
  public toString(): string {
    return this._chunks.join(this._separator);
  }
}

/**
 * The essay builder collects the word in separated paragraphs, using the {@link ParagraphBuilder}.
 * The number of paragraphs in the essay is defined through the {@link EssayBuilderOptions}.
 */
export class EssayBuilder extends EssayBuilderBase {
  private _paragraphBuilder: ParagraphBuilder;
  private readonly _paragraphsCount: number;

  public constructor(options: EssayBuilderOptions) {
    super("\n\n", options);
    this._paragraphBuilder = new ParagraphBuilder(options);
    this._paragraphsCount = getNumberFromRange(options.paragraphs);
  }

  public get complete(): boolean {
    return this._chunks.length === this._paragraphsCount;
  }

  public addWord(word: string): void {
    this._paragraphBuilder.addWord(word);
    if (this._paragraphBuilder.complete) {
      super.addWord(this._paragraphBuilder.toString());
      this._paragraphBuilder = new ParagraphBuilder(this._options);
    }
  }
}

/**
 * The paragraph builder collects the word in separated sentences, using the {@link SentenceBuilder}.
 * The number of the sentences in the paragraph is defined through the {@link EssayBuilderOptions}.
 */
export class ParagraphBuilder extends EssayBuilderBase {
  private _sentenceBuilder: SentenceBuilder;
  private readonly _sentencesCount: number;

  public constructor(options: EssayBuilderOptions) {
    super(" ", options);
    this._sentenceBuilder = new SentenceBuilder(options);
    this._sentencesCount = getNumberFromRange(options.sentencesPerParagraph);
  }

  public get complete(): boolean {
    return this._chunks.length === this._sentencesCount;
  }

  public addWord(word: string): void {
    this._sentenceBuilder.addWord(word);
    if (this._sentenceBuilder.complete) {
      super.addWord(this._sentenceBuilder.toString());
      this._sentenceBuilder = new SentenceBuilder(this._options);
    }
  }
}

/**
 * The sentence builder collects the first word capitalizing its first letter, and adding a dot at the end of whole text.
 * The number of words in the sentence is defined through the {@link EssayBuilderOptions}.
 */
export class SentenceBuilder extends EssayBuilderBase {
  private readonly _wordsCount: number;

  public constructor(options: EssayBuilderOptions) {
    super(" ", options);
    this._wordsCount = getNumberFromRange(options.wordsPerSentence);
  }

  public get complete(): boolean {
    return this._chunks.length === this._wordsCount;
  }

  private get _isFirstWord(): boolean {
    return !this._chunks.length;
  }
  private get _isLastWord(): boolean {
    return this._chunks.length === this._wordsCount - 1;
  }

  public addWord(word: string): void {
    if (this._isFirstWord) word = capitalizeFirstLetter(word);
    else if (this._isLastWord) word += ".";
    super.addWord(word);
  }
}
