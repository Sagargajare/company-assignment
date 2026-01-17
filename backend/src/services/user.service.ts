import { AppDataSource } from '../data-source';
import { User } from '../entities';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Create a new user
   * @param email User email (must be unique)
   * @param name User name
   * @param timezone User timezone (defaults to UTC)
   * @param language_preference User language preference (defaults to 'en')
   * @returns Created user
   */
  async createUser(
    email: string,
    name: string,
    timezone: string = 'UTC',
    language_preference: string = 'en'
  ): Promise<User> {
    try {
      // Check if user with email already exists
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      if (existingUser) {
        // Return existing user instead of throwing error
        return existingUser;
      }

      // Create new user
      const user = this.userRepository.create({
        email,
        name,
        timezone,
        language_preference,
      });

      const savedUser = await this.userRepository.save(user);
      return savedUser;
    } catch (error) {
      throw new Error(
        `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      return user;
    } catch (error) {
      throw new Error(
        `Failed to get user: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

