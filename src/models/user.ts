export class User {
  /**
   * Constructs a new User.
   *
   * @param id - The unique identifier of the user.
   * @param username - The username of the user.
   * @param email - The email of the user.
   * @param password - The password of the user.
   */
    constructor(
      public id: number,
      public username: string,
      public email: string,
      public password: string
    ) {}
  }
  
  // Mock database
  export const users: User[] = [];
  