import { createClient } from '../../lib/supabase/server'
import { AuthenticationError, ValidationError } from '../../lib/errors'

export class AuthService {
  /**
   * Signs in a user and establishes a session cookie.
   */
  static async signIn(email: string, password: string) {
    if (!email || !password) {
      throw new ValidationError("Email and password are required")
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new AuthenticationError((error as Error).message)
    }

    return data
  }

  /**
   * Signs out the current user.
   */
  static async signOut() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new AuthenticationError((error as Error).message)
    }
  }

  /**
   * Gets the current user session details.
   */
  static async getCurrentUser() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      throw new AuthenticationError("User is not authenticated")
    }

    return user
  }
}
