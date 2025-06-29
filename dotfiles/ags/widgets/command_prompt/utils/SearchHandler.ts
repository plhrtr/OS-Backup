export default class SearchHandler {
  private items: string[];

  /**
   * Creates a new search handler
   * @param items the items this search handler should handle
   */
  constructor(items: string[]) {
    this.items = items;
  }

  /**
   * Searches for matching strings
   * @param input the input for the search
   * @returns all matching items given in the constructor
   */
  search(input: string): string[] {
    const found_values: string[] = [...this.items];

    return found_values
      .filter((item) => {
        return this.calculate_first_substring_length(input, item) > 0;
      })
      .sort(
        (a, b) =>
          this.calculate_first_substring_length(input, a) -
          this.calculate_first_substring_length(input, b),
      );
  }

  private calculate_first_substring_length(
    input: string,
    value: string,
  ): number {
    let current_index = 0;
    for (let i = 0; i < input.length; i++) {
      current_index = value.indexOf(input[i], current_index);
      if (current_index < 0) return -1;
    }
    return current_index + 1;
  }
}
