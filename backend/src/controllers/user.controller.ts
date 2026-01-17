import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { z } from 'zod';

// Validation schema
const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  timezone: z.string().optional().default('UTC'),
  language_preference: z.enum(['en', 'hi']).optional().default('en'),
});

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * POST /api/users
   * Create a new user
   */
  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate request body
      const validationResult = CreateUserSchema.safeParse(req.body);

      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid request data',
          message: validationResult.error.issues
            .map((e) => `${e.path.join('.')}: ${e.message}`)
            .join(', '),
        });
        return;
      }

      const { email, name, timezone, language_preference } = validationResult.data;

      // Create user
      const user = await this.userService.createUser(email, name, timezone, language_preference);

      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          timezone: user.timezone,
          language_preference: user.language_preference,
          created_at: user.created_at,
        },
        message: 'User created successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to create user',
      });
    }
  };
}

