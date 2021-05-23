import { User } from "../entities/User";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import { COOKIE_NAME } from "../constants";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

/**
 * A class that represents an API Error having to do with a User.
 */
@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

/**
 * A class that holds the response information for Users.
 * This includes any FieldErrors that have occurred and/or the user information queried.
 */
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  /**
   * Who am I?
   * Returns the currently logged in user.
   * @returns null if no user is logged in, or the currently logged in User
   */
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext): Promise<User | null> {
    // user not logged in
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  /**
   * Registers a new user with the given UsernamePasswordInput login info.
   * @param options A UsernamePasswordInput object that holds the desired
   * new user's username and password
   * @returns A UserResponse with any server-side errors that occur during the
   * creation of this new user, and/or the newly created User
   */
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "length must be greater than 2 characters",
          },
        ],
      };
    }
    if (options.password.length < 8) {
      return {
        errors: [
          {
            field: "password",
            message: "password must be at least 8 characters",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.code === "23505") {
        // duplicate user found
        return {
          errors: [
            {
              field: "username",
              message: "username already exists",
            },
          ],
        };
      }
    }

    // store user ID session, essentially logging them in
    req.session.userId = user.id;

    return { user };
  }

  /**
   * Logs the given user in.
   * @param options A UsernamePasswordInput object that holds the user's username and password
   * @returns A UserResponse with any server-side errors that occur during the
   * log in of the user, and/or the User who just logged in
   */
  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "that username does not exist!",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    // store user ID session, thus logging them in
    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
