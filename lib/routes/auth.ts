import { Router } from "express";
import {query, param, body} from "express-validator";
import { login, register, resetPassword } from "../controller/auth";

const authRouter = Router();

authRouter.post("/register", body("username").notEmpty(),body("password").notEmpty(),body("email").notEmpty(), register);
authRouter.post("/login", login);
authRouter.post("/reset-password", resetPassword)


export default authRouter;

// router.post(
//     "/post",
//     body("title").not().isEmpty(),
//     body("body").not().isEmpty(),
//     createPost
// );
// //@route GET api/v1/
// //@desc Returns a single post
// router.get("/post/:id", param("id").not().isEmpty(), getOne);
//
// //@route GET api/v1/
// //@desc Returns all posts
// router.get("/posts", getAll);
//
// //@route GET api/v1/
// //@desc Returns a paginated list of all posts
// router.get(
//     "/paginated-posts",
//     param("limit").not().isEmpty().isNumeric(),
//     param("cursor").not().isEmpty().isNumeric(),
//     getPaginatedPosts
// );
//
// //@route DELETE api/v1/
// //@desc Deletes a single post
// router.delete("/post/:id", param("id").not().isEmpty(), deleteOne);
//
// //@route DELETE api/v1/post
// //@desc Deletes all blog posts
// router.delete("/posts", deleteAll);
//
// //@route PUT api/v1/post
// //@desc Updates a post
//
// router.put("/post/:id", param("id").not().isEmpty(), updateOne);
//
// // Comment Routes
//
// //@route POST api/v1/comment
// //@desc creates a comment for a blog post
// router.post(
//     "/comment/:postID",
//     body("content").not().isEmpty(),
//     param("postID").not().isEmpty(),
//     createComment
// );
//
// //@route GET api/v1/
// //@desc Returns a single comment from a post
// router.get("/comment/:id", param("id").not().isEmpty(), getOneComment);
//
// //@route GET api/v1/
// //@desc Returns all comments from a post
// router.get(
//     "/comments/post/:postID",
//     param("postID").not().isEmpty(),
//     getAllCommentsFromPost
// );
//
// //@route GET api/v1/
// //@desc Returns all comments in the database
// router.get("/comments", getEveryComment);
//
// //@route PUT api/v1/
// //@desc Updates a single comment
// router.put("/comment/:id", param("id").not().isEmpty(), updateComment);
//
// //@route DELETE api/v1/
// //@desc Deletes a single comment
// router.delete("/comment/:id", param("id").not().isEmpty(), deleteOneComment);
//
// export default router;