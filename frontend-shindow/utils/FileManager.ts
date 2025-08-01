export default class FileManager {
  constructor() {}

  /**
   * This method receives a file and returns a promise to be resolved with it's content as a string.
   *
   * @param file - The file to be readed.
   * @returns - A promise of string to be resolved with the content of the file as a string.
   */
  public ReadFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        resolve(fileContent);
      };

      reader.onerror = (error) => reject(error);

      reader.readAsText(file);
    });
  }
}
