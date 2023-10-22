import {validationResult} from "express-validator";
import {Request, Response} from "express";

const validate = (req:Request, res:Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({
            success: false,
            message: "The request contains invalid or incomplete fields ",
        });
    }
}

export default validate